"""
LustLingual Modal Backend - Using Ollama (Simple!)
Deploy with: modal deploy modal_backend.py

Just like running locally - ollama pull && ollama run
"""

import modal

app = modal.App("lustlingual-backend")

# Image with Ollama installed
image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("curl", "systemctl")
    .run_commands(
        "curl -fsSL https://ollama.com/install.sh | sh",
    )
    .pip_install("fastapi", "pydantic", "httpx")
)

# Volume to store Ollama models
volume = modal.Volume.from_name("ollama-models", create_if_missing=True)

MODEL_NAME = "dolphin-mistral"  # Uncensored 7B - fast and good


@app.cls(
    image=image,
    gpu="A10G",
    timeout=600,
    scaledown_window=300,
    volumes={"/root/.ollama": volume},
)
class OllamaServer:
    """Ollama server running on Modal"""

    @modal.enter()
    def start_ollama(self):
        """Start Ollama server and pull model"""
        import subprocess
        import time
        import httpx

        # Start Ollama server in background
        print("Starting Ollama server...")
        self.ollama_process = subprocess.Popen(
            ["ollama", "serve"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        # Wait for server to be ready
        for _ in range(30):
            try:
                resp = httpx.get("http://localhost:11434/api/tags", timeout=2)
                if resp.status_code == 200:
                    print("Ollama server is ready!")
                    break
            except:
                time.sleep(1)

        # Pull model if not exists
        print(f"Checking model: {MODEL_NAME}")
        result = subprocess.run(
            ["ollama", "pull", MODEL_NAME],
            capture_output=True,
            text=True,
        )
        print(result.stdout)
        if result.returncode != 0:
            print(f"Pull error: {result.stderr}")

        print("Model ready!")

    @modal.exit()
    def stop_ollama(self):
        """Stop Ollama server"""
        if hasattr(self, 'ollama_process'):
            self.ollama_process.terminate()

    @modal.method()
    def generate(self, message: str, system_prompt: str = "", memory: str = "",
                 conversation_history: list = None, temperature: float = 0.8,
                 max_tokens: int = 512) -> str:
        """Generate response using Ollama"""
        import httpx

        # Build messages
        messages = []

        # System prompt with memory
        full_system = system_prompt or ""
        if memory:
            full_system += f"\n\nMemory/Context:\n{memory}"

        if full_system:
            messages.append({"role": "system", "content": full_system})

        # Conversation history
        for msg in (conversation_history or [])[-10:]:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })

        # Current message
        messages.append({"role": "user", "content": message})

        # Call Ollama
        response = httpx.post(
            "http://localhost:11434/api/chat",
            json={
                "model": MODEL_NAME,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens,
                }
            },
            timeout=120.0,
        )

        if response.status_code != 200:
            raise Exception(f"Ollama error: {response.text}")

        return response.json()["message"]["content"]


# Global reference
ollama = OllamaServer()


@app.function(
    image=image,
    timeout=600,
    scaledown_window=300,
)
@modal.asgi_app()
def fastapi_app():
    """FastAPI app"""
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import StreamingResponse
    from pydantic import BaseModel
    from typing import Optional, List
    import json

    web_app = FastAPI(title="LustLingual API")

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
        model: Optional[str] = "dolphin-mistral"

    class ChatResponse(BaseModel):
        response: str
        character_id: Optional[str] = None

    @web_app.get("/")
    async def root():
        return {
            "name": "LustLingual API",
            "version": "3.0.0",
            "status": "running",
            "engine": "Ollama",
            "model": MODEL_NAME,
        }

    @web_app.get("/health")
    async def health():
        return {
            "status": "healthy",
            "model": MODEL_NAME,
            "ollama_status": "connected",
            "available_models": [MODEL_NAME],
        }

    @web_app.post("/chat", response_model=ChatResponse)
    async def chat(request: ChatRequest):
        """Chat endpoint"""
        try:
            history = [
                {"role": msg.role, "content": msg.content}
                for msg in (request.conversation_history or [])
            ]

            response = ollama.generate.remote(
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
        """Streaming endpoint (simulated)"""
        try:
            history = [
                {"role": msg.role, "content": msg.content}
                for msg in (request.conversation_history or [])
            ]

            async def event_generator():
                try:
                    response = ollama.generate.remote(
                        message=request.message,
                        system_prompt=request.system_prompt or "",
                        memory=request.memory or "",
                        conversation_history=history,
                        temperature=request.temperature,
                        max_tokens=request.max_tokens,
                    )

                    # Stream in chunks
                    for i in range(0, len(response), 10):
                        chunk = response[i:i + 10]
                        yield f"data: {json.dumps({'token': chunk})}\n\n"

                    yield f"data: {json.dumps({'done': True})}\n\n"

                except Exception as e:
                    yield f"data: {json.dumps({'error': str(e)})}\n\n"

            return StreamingResponse(
                event_generator(),
                media_type="text/event-stream",
            )

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @web_app.get("/models")
    async def list_models():
        return {"models": [{"name": MODEL_NAME}]}

    return web_app
