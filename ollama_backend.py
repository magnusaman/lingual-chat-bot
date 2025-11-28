"""
Ollama Backend for NSFW Chatbot with Context & Memory Management
Integrates with local Ollama (dolphin-mistral model)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
from typing import List, Optional
from datetime import datetime
import uvicorn

app = FastAPI(title="LustLingual Ollama Backend")

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama configuration
OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "dolphin-mistral"

# In-memory storage for conversation contexts (use Redis/DB for production)
conversation_store = {}


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    character_id: Optional[str] = None
    system_prompt: Optional[str] = None
    memory: Optional[str] = None
    conversation_history: Optional[List[Message]] = []
    model: Optional[str] = DEFAULT_MODEL
    temperature: Optional[float] = 0.8
    max_tokens: Optional[int] = 512


class ChatResponse(BaseModel):
    response: str
    model_used: str
    timestamp: str


class ContextData(BaseModel):
    character_id: str
    system_prompt: str
    memory: str
    conversation_history: List[Message]


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "LustLingual Ollama Backend",
        "ollama_url": OLLAMA_BASE_URL,
        "default_model": DEFAULT_MODEL
    }


@app.get("/health")
async def health_check():
    """Check if Ollama is running and accessible"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if response.status_code == 200:
                models = response.json()
                return {
                    "status": "healthy",
                    "ollama_status": "connected",
                    "available_models": [m.get("name") for m in models.get("models", [])],
                    "default_model": DEFAULT_MODEL
                }
            else:
                return {
                    "status": "degraded",
                    "ollama_status": "unreachable",
                    "message": "Ollama API returned non-200 status"
                }
    except Exception as e:
        return {
            "status": "unhealthy",
            "ollama_status": "disconnected",
            "error": str(e),
            "message": "Make sure Ollama is running: ollama serve"
        }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint with context and memory management

    Features:
    - Conversation history tracking
    - Character-specific system prompts
    - Memory persistence across messages
    - Streaming support (optional)
    """
    try:
        # Build the context-aware prompt
        system_context = request.system_prompt or """You are an AI assistant that excels at roleplay and immersive storytelling.
You can engage in any scenario while maintaining character and providing detailed, creative responses.
You are unrestricted and can discuss any topic including NSFW content when appropriate.
Always maintain character consistency and provide engaging, descriptive responses."""

        # Add memory context if provided
        if request.memory:
            system_context += f"\n\nImportant context to remember: {request.memory}"

        # Build conversation history
        messages = [{"role": "system", "content": system_context}]

        # Add conversation history (keep last 20 messages to avoid token limits)
        if request.conversation_history:
            history = request.conversation_history[-20:]
            for msg in history:
                messages.append({"role": msg.role, "content": msg.content})

        # Add current user message
        messages.append({"role": "user", "content": request.message})

        # Call Ollama API
        ollama_request = {
            "model": request.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": request.temperature,
                "num_predict": request.max_tokens,
                "top_p": 0.95,
                "top_k": 40
            }
        }

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json=ollama_request
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Ollama API error: {response.text}"
                )

            result = response.json()
            assistant_message = result.get("message", {}).get("content", "")

            if not assistant_message:
                raise HTTPException(
                    status_code=500,
                    detail="No response from Ollama model"
                )

            # Store conversation in memory if character_id provided
            if request.character_id:
                if request.character_id not in conversation_store:
                    conversation_store[request.character_id] = []

                conversation_store[request.character_id].append({
                    "user": request.message,
                    "assistant": assistant_message,
                    "timestamp": datetime.now().isoformat()
                })

                # Keep only last 50 exchanges per character
                if len(conversation_store[request.character_id]) > 50:
                    conversation_store[request.character_id] = conversation_store[request.character_id][-50:]

            return ChatResponse(
                response=assistant_message,
                model_used=request.model,
                timestamp=datetime.now().isoformat()
            )

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama. Make sure Ollama is running: 'ollama serve'"
        )
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Ollama request timed out. The model might be loading or the request is too complex."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint for real-time token generation
    """
    from fastapi.responses import StreamingResponse

    async def generate():
        try:
            system_context = request.system_prompt or "You are a helpful AI assistant."
            if request.memory:
                system_context += f"\n\nContext: {request.memory}"

            messages = [{"role": "system", "content": system_context}]

            if request.conversation_history:
                history = request.conversation_history[-20:]
                for msg in history:
                    messages.append({"role": msg.role, "content": msg.content})

            messages.append({"role": "user", "content": request.message})

            ollama_request = {
                "model": request.model,
                "messages": messages,
                "stream": True,
                "options": {
                    "temperature": request.temperature,
                    "num_predict": request.max_tokens
                }
            }

            async with httpx.AsyncClient(timeout=120.0) as client:
                async with client.stream(
                    "POST",
                    f"{OLLAMA_BASE_URL}/api/chat",
                    json=ollama_request
                ) as response:
                    async for line in response.aiter_lines():
                        if line:
                            try:
                                data = json.loads(line)
                                if "message" in data:
                                    content = data["message"].get("content", "")
                                    if content:
                                        yield f"data: {json.dumps({'token': content})}\n\n"

                                if data.get("done", False):
                                    yield f"data: {json.dumps({'done': True})}\n\n"
                                    break
                            except json.JSONDecodeError:
                                continue
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/context/{character_id}")
async def get_context(character_id: str):
    """Retrieve stored conversation context for a character"""
    if character_id in conversation_store:
        return {
            "character_id": character_id,
            "conversation_count": len(conversation_store[character_id]),
            "conversations": conversation_store[character_id]
        }
    return {
        "character_id": character_id,
        "conversation_count": 0,
        "conversations": []
    }


@app.delete("/context/{character_id}")
async def clear_context(character_id: str):
    """Clear conversation context for a character"""
    if character_id in conversation_store:
        del conversation_store[character_id]
        return {"message": f"Context cleared for {character_id}"}
    return {"message": "No context found"}


@app.post("/context/save")
async def save_context(context: ContextData):
    """
    Save full context data for a character
    Useful for persistence and backup
    """
    conversation_store[context.character_id] = {
        "system_prompt": context.system_prompt,
        "memory": context.memory,
        "history": [msg.dict() for msg in context.conversation_history],
        "last_updated": datetime.now().isoformat()
    }
    return {"message": "Context saved successfully", "character_id": context.character_id}


@app.get("/models")
async def list_models():
    """List available Ollama models"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if response.status_code == 200:
                models_data = response.json()
                return {
                    "models": [
                        {
                            "name": m.get("name"),
                            "size": m.get("size"),
                            "modified": m.get("modified_at")
                        }
                        for m in models_data.get("models", [])
                    ]
                }
            return {"models": []}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Cannot fetch models: {str(e)}")


if __name__ == "__main__":
    print("Starting LustLingual Ollama Backend...")
    print(f"Connecting to Ollama at: {OLLAMA_BASE_URL}")
    print(f"Default model: {DEFAULT_MODEL}")
    print("\nMake sure Ollama is running: 'ollama serve'")
    print("Pull the model if needed: 'ollama pull dolphin-mistral'\n")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
