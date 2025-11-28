"""
LustLingual Modal Backend - NSFW AI Chatbot with vLLM
Deploy with: modal deploy modal_backend.py

Features:
- vLLM for fast inference with native streaming
- dolphin-2.6-mixtral-8x7b (uncensored, NSFW-friendly)
- SSE streaming support
- Full CORS enabled
"""

import modal

app = modal.App("lustlingual-backend")

# vLLM-optimized image
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "vllm==0.6.3.post1",
        "fastapi",
        "pydantic",
        "sse-starlette",
    )
)

# Volume to cache model weights
volume = modal.Volume.from_name("lustlingual-models", create_if_missing=True)

# Model configuration
MODEL_ID = "TheBloke/dolphin-2.6-mixtral-8x7b-AWQ"  # AWQ quantized for vLLM


@app.cls(
    image=image,
    gpu="A10G",  # 24GB VRAM
    timeout=600,
    scaledown_window=300,  # 5 minutes idle timeout
    volumes={"/models": volume},
)
@modal.concurrent(max_inputs=10)
class LustLingualModel:
    """vLLM-powered inference server"""

    @modal.enter()
    def load_model(self):
        """Load the model when container starts"""
        from vllm import LLM, SamplingParams

        print(f"Loading model: {MODEL_ID}")
        self.llm = LLM(
            model=MODEL_ID,
            download_dir="/models",
            dtype="half",
            max_model_len=4096,
            gpu_memory_utilization=0.9,
            trust_remote_code=True,
        )
        self.sampling_params = SamplingParams(
            temperature=0.8,
            top_p=0.9,
            top_k=50,
            max_tokens=512,
            repetition_penalty=1.1,
        )
        print("Model loaded successfully!")

    def build_prompt(self, message: str, system_prompt: str = "", memory: str = "", conversation_history: list = None):
        """Build ChatML format prompt"""
        prompt_parts = []

        # System prompt with memory
        full_system = system_prompt or ""
        if memory:
            full_system += f"\n\nMemory/Context:\n{memory}"

        if full_system:
            prompt_parts.append(f"<|im_start|>system\n{full_system}<|im_end|>")

        # Conversation history (last 10 messages)
        for msg in (conversation_history or [])[-10:]:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            prompt_parts.append(f"<|im_start|>{role}\n{content}<|im_end|>")

        # Current message
        prompt_parts.append(f"<|im_start|>user\n{message}<|im_end|>")
        prompt_parts.append("<|im_start|>assistant\n")

        return "\n".join(prompt_parts)

    @modal.method()
    def generate(self, message: str, system_prompt: str = "", memory: str = "",
                 conversation_history: list = None, temperature: float = 0.8,
                 max_tokens: int = 512) -> str:
        """Generate a response"""
        from vllm import SamplingParams

        prompt = self.build_prompt(message, system_prompt, memory, conversation_history)

        params = SamplingParams(
            temperature=temperature,
            top_p=0.9,
            top_k=50,
            max_tokens=max_tokens,
            repetition_penalty=1.1,
            stop=["<|im_end|>", "<|im_start|>"],
        )

        outputs = self.llm.generate([prompt], params)
        response = outputs[0].outputs[0].text.strip()

        # Clean up any remaining tokens
        if "<|im_end|>" in response:
            response = response.split("<|im_end|>")[0].strip()

        return response

    @modal.method()
    def generate_stream(self, message: str, system_prompt: str = "", memory: str = "",
                        conversation_history: list = None, temperature: float = 0.8,
                        max_tokens: int = 512):
        """Generate a streaming response"""
        from vllm import SamplingParams

        prompt = self.build_prompt(message, system_prompt, memory, conversation_history)

        params = SamplingParams(
            temperature=temperature,
            top_p=0.9,
            top_k=50,
            max_tokens=max_tokens,
            repetition_penalty=1.1,
            stop=["<|im_end|>", "<|im_start|>"],
        )

        # Use vLLM's streaming
        for output in self.llm.generate([prompt], params, use_tqdm=False):
            text = output.outputs[0].text
            if "<|im_end|>" in text:
                text = text.split("<|im_end|>")[0]
            yield text


# Create a global reference to the model class
model = LustLingualModel()


@app.function(
    image=image,
    timeout=600,
    scaledown_window=300,
)
@modal.asgi_app()
def fastapi_app():
    """FastAPI app for LustLingual"""
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import StreamingResponse
    from pydantic import BaseModel
    from typing import Optional, List
    import json

    web_app = FastAPI(title="LustLingual API")

    # CORS - allow all origins for development
    web_app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    class ChatMessage(BaseModel):
        role: str
        content: str

    class ChatRequest(BaseModel):
        message: str
        system_prompt: Optional[str] = ""
        character_id: Optional[str] = None
        memory: Optional[str] = ""
        conversation_history: Optional[List[ChatMessage]] = []
        temperature: Optional[float] = 0.8
        max_tokens: Optional[int] = 512
        model: Optional[str] = "dolphin-mixtral"

    class ChatResponse(BaseModel):
        response: str
        character_id: Optional[str] = None

    @web_app.get("/")
    async def root():
        return {
            "name": "LustLingual API",
            "version": "2.0.0",
            "status": "running",
            "docs": "/docs",
            "engine": "vLLM",
        }

    @web_app.get("/health")
    async def health():
        return {
            "status": "healthy",
            "model": MODEL_ID,
            "gpu": "A10G-24GB",
            "ollama_status": "connected",  # For frontend compatibility
            "available_models": ["dolphin-mixtral"],
            "engine": "vLLM",
        }

    @web_app.post("/chat", response_model=ChatResponse)
    async def chat(request: ChatRequest):
        """Chat endpoint - non-streaming"""
        try:
            history = [
                {"role": msg.role, "content": msg.content}
                for msg in (request.conversation_history or [])
            ]

            response = model.generate.remote(
                message=request.message,
                system_prompt=request.system_prompt or "",
                memory=request.memory or "",
                conversation_history=history,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
            )

            return ChatResponse(
                response=response,
                character_id=request.character_id,
            )

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @web_app.post("/chat/stream")
    async def chat_stream(request: ChatRequest):
        """Chat endpoint - Server-Sent Events streaming"""
        try:
            history = [
                {"role": msg.role, "content": msg.content}
                for msg in (request.conversation_history or [])
            ]

            async def event_generator():
                prev_text = ""
                try:
                    for text in model.generate_stream.remote_gen(
                        message=request.message,
                        system_prompt=request.system_prompt or "",
                        memory=request.memory or "",
                        conversation_history=history,
                        temperature=request.temperature,
                        max_tokens=request.max_tokens,
                    ):
                        # Only yield new tokens
                        new_text = text[len(prev_text):]
                        if new_text:
                            data = json.dumps({"token": new_text})
                            yield f"data: {data}\n\n"
                            prev_text = text

                    # Send done signal
                    yield f"data: {json.dumps({'done': True})}\n\n"
                except Exception as e:
                    yield f"data: {json.dumps({'error': str(e)})}\n\n"

            return StreamingResponse(
                event_generator(),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "X-Accel-Buffering": "no",
                },
            )

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @web_app.get("/models")
    async def list_models():
        return {
            "models": [
                {
                    "name": "dolphin-mixtral",
                    "model": MODEL_ID,
                    "size": "AWQ quantized (~26GB)",
                    "engine": "vLLM",
                }
            ]
        }

    return web_app
