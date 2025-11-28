"""
LustLingual Modal Backend - NSFW AI Chatbot
Deploy with: modal deploy modal_backend.py
"""

import modal

app = modal.App("lustlingual-backend")

# Image with all dependencies
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "torch",
        "transformers",
        "accelerate",
        "bitsandbytes",
        "sentencepiece",
        "protobuf",
        "fastapi",
        "pydantic",
    )
)

# Volume to cache model weights
volume = modal.Volume.from_name("lustlingual-models", create_if_missing=True)

# Global model storage
model_instance = {}

MODEL_ID = "cognitivecomputations/dolphin-2.6-mixtral-8x7b"


def load_model():
    """Load the dolphin-mixtral model on-demand"""
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

    global model_instance

    if "model" not in model_instance:
        print(f"Loading model: {MODEL_ID}")

        # 4-bit quantization to fit in 24GB VRAM
        quantization_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
        )

        tokenizer = AutoTokenizer.from_pretrained(
            MODEL_ID,
            trust_remote_code=True,
            cache_dir="/models",
        )

        model = AutoModelForCausalLM.from_pretrained(
            MODEL_ID,
            quantization_config=quantization_config,
            device_map="auto",
            trust_remote_code=True,
            torch_dtype=torch.float16,
            cache_dir="/models",
        )

        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token

        model_instance["model"] = model
        model_instance["tokenizer"] = tokenizer
        print("Model loaded successfully!")

    return model_instance["model"], model_instance["tokenizer"]


def generate_response(message, system_prompt="", conversation_history=None, temperature=0.8, max_tokens=512):
    """Generate a response using the model"""
    import torch

    model, tokenizer = load_model()
    conversation_history = conversation_history or []

    # Build prompt using ChatML format (dolphin uses this)
    prompt_parts = []

    if system_prompt:
        prompt_parts.append(f"<|im_start|>system\n{system_prompt}<|im_end|>")

    # Add conversation history (last 10 messages)
    for msg in conversation_history[-10:]:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        prompt_parts.append(f"<|im_start|>{role}\n{content}<|im_end|>")

    # Current message
    prompt_parts.append(f"<|im_start|>user\n{message}<|im_end|>")
    prompt_parts.append("<|im_start|>assistant\n")

    prompt = "\n".join(prompt_parts)

    # Tokenize
    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=4096,
    ).to(model.device)

    # Generate
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            temperature=temperature,
            do_sample=True,
            top_p=0.9,
            top_k=50,
            repetition_penalty=1.1,
            pad_token_id=tokenizer.pad_token_id,
            eos_token_id=tokenizer.eos_token_id,
        )

    # Decode
    response = tokenizer.decode(
        outputs[0][inputs["input_ids"].shape[1]:],
        skip_special_tokens=True,
    )

    # Clean up
    response = response.strip()
    if "<|im_end|>" in response:
        response = response.split("<|im_end|>")[0].strip()

    return response


@app.function(
    image=image,
    gpu=modal.gpu.A10G(),  # 24GB VRAM - $1.10/hr (try this first)
    # gpu=modal.gpu.A100(size="40GB"),  # Fallback if A10G doesn't fit - $3/hr
    timeout=600,
    container_idle_timeout=300,  # 5 minutes idle timeout
    volumes={"/models": volume},
)
@modal.asgi_app()
def fastapi_app():
    """FastAPI app for LustLingual"""
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    from typing import Optional, List

    web_app = FastAPI(title="LustLingual API")

    # CORS
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
        memory: Optional[str] = None
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
            "version": "1.0.0",
            "status": "running",
            "docs": "/docs",
        }

    @web_app.get("/health")
    async def health():
        return {
            "status": "healthy",
            "model": MODEL_ID,
            "gpu": "A10G-24GB",
            "ollama_status": "connected",
            "available_models": ["dolphin-mixtral"],
        }

    @web_app.post("/chat", response_model=ChatResponse)
    async def chat(request: ChatRequest):
        """Chat endpoint - compatible with existing frontend"""
        try:
            # Build full system prompt with memory
            full_system_prompt = request.system_prompt or ""
            if request.memory:
                full_system_prompt += f"\n\nMemory/Context:\n{request.memory}"

            # Convert conversation history
            history = [
                {"role": msg.role, "content": msg.content}
                for msg in (request.conversation_history or [])
            ]

            # Generate response
            response = generate_response(
                message=request.message,
                system_prompt=full_system_prompt,
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

    @web_app.get("/models")
    async def list_models():
        return {
            "models": [
                {
                    "name": "dolphin-mixtral",
                    "model": MODEL_ID,
                    "size": "26GB (4-bit quantized)",
                }
            ]
        }

    return web_app
