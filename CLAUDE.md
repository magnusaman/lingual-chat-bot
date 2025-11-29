# LustLingual - NSFW AI Chatbot

## Live URLs
- **Backend**: https://thedevs-org--lustlingual-backend-fastapi-app.modal.run
- **GitHub**: https://github.com/magnusaman/lingual-chat-bot

## Stack
- **Backend**: Modal + Ollama + FastAPI
- **Model**: dolphin-mistral (7B, uncensored)
- **Frontend**: React 18 + Vite + Tailwind + Framer Motion
- **Hosting**: Modal (backend), Vercel (frontend)

## 48 Character Personas (6 Genres)

| Genre | Characters |
|-------|------------|
| **Wizarding World** | Hermione, Ginny, Luna, Bellatrix, Fleur, Tonks, Narcissa, Cho |
| **Marvel** | Black Widow, Scarlet Witch, Captain Marvel, She-Hulk, Gamora, Storm, Rogue, Jean Grey |
| **DC** | Catwoman, Harley Quinn, Wonder Woman, Poison Ivy, Supergirl, Batgirl, Zatanna, Black Canary |
| **Anime/Gaming** | 2B, Tifa, Lara Croft, D.Va, Bayonetta, Samus, Ahri, Morrigan |
| **TV/Movies** | Daenerys, Cersei, Mystique, Leia, Trinity, Morticia, Elvira, Jessica Rabbit |
| **Original** | Mistress Valentina, Dr. Serena, Luna Nightshade, Captain Scarlett, Empress Zara, Agent Vixen, The Succubus, Goddess Athena |

## API Endpoints
```
GET  /health     - Health check
POST /chat       - Send message (non-streaming)
POST /chat/stream - Send message (SSE streaming)
GET  /models     - List available models
```

## Deploy Commands
```bash
# Backend (Modal) - USE PYTHON 3.9-3.12, not 3.14!
py -3.9 -m modal deploy modal_backend.py

# Frontend (local dev)
cd react_frontend && npm run dev
```

## Key Files
```
modal_backend.py          # Ollama on Modal (SIMPLE!)
download_models.py        # Pre-download models to volume
react_frontend/
├── src/utils/storage.js  # 48 characters with NSFW prompts
├── src/pages/CatalogPage.jsx    # Genre-based catalog
├── src/pages/DirectChatPage.jsx # Direct chat with settings
├── src/components/ContextPanel.jsx # Memory management
└── src/utils/api.js      # API client
```

## Environment Variables
```bash
# Vercel Frontend
VITE_API_URL=https://thedevs-org--lustlingual-backend-fastapi-app.modal.run
```

## What Works
- 48 NSFW character personas with explicit prompts
- Uncensored dolphin-mistral model
- Ollama running on Modal (simple, like local)
- Genre-based collapsible catalog UI
- Direct chat mode with custom system prompts
- Memory notes per character
- SSE streaming support

## Costs
- Modal A10G GPU: ~$1.10/hr (only when active)
- 5-minute idle timeout, then scales to zero

---

## Development Log (2025-11-29)

### What We Tried (Failed)

1. **vLLM with Mixtral 8x7B AWQ** - CUDA out of memory on A10G (24GB)
2. **vLLM with A100** - FlashAttention assertion errors, model execution failures
3. **vLLM with smaller 7B models** - Still had compatibility issues with vLLM 0.6.3

**Lesson**: vLLM is powerful but finicky. Version mismatches, attention backend issues, and MoE model support problems made it unreliable.

### What Worked (Final Solution)

**Ollama on Modal** - Just like running locally!
- Install Ollama in Modal image
- Run `ollama serve` on container start
- Pull `dolphin-mistral` model
- Models cached in Modal volume for fast restarts

```python
# Simple - exactly like local development
subprocess.Popen(["ollama", "serve"])
subprocess.run(["ollama", "pull", "dolphin-mistral"])
httpx.post("http://localhost:11434/api/chat", ...)
```

### Key Decisions Made

1. **Model Choice**: dolphin-mistral (7B) - uncensored, NSFW-friendly, fits on A10G
2. **Backend Approach**: Ollama > vLLM for simplicity
3. **GPU**: A10G ($1.10/hr) - enough for 7B models
4. **Character System**: 48 personas, 6 genres, explicit system prompts with kinks/safewords
5. **UI**: Read-only personas (with edit option), always-editable memory

### Modal Deprecation Fixes
- `gpu=modal.gpu.A10G()` → `gpu="A10G"`
- `container_idle_timeout` → `scaledown_window`
- `allow_concurrent_inputs` → `@modal.concurrent(max_inputs=N)`

### Files in Volume
```
/root/.ollama/           # Ollama models (cached)
  └── models/
      └── dolphin-mistral/

# Old vLLM attempts (can delete):
/models/
  ├── TheBloke--dolphin-2.2.1-mistral-7B-AWQ (3.87 GB)
  ├── TheBloke--OpenHermes-2.5-Mistral-7B-AWQ (3.87 GB)
  └── TheBloke--dolphin-2.6-mixtral-8x7b-AWQ (22.96 GB)
```

### Test Command
```bash
curl -X POST "https://thedevs-org--lustlingual-backend-fastapi-app.modal.run/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hey sexy", "system_prompt": "You are flirty and explicit.", "max_tokens": 150}'
```

---
**Last Updated**: 2025-11-29
**Status**: ✅ Working - Ollama on Modal
