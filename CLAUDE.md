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
# Backend (Modal)
py -3.9 -m modal deploy modal_backend.py

# Frontend (local dev)
cd react_frontend && npm run dev
```

## Key Files
```
modal_backend.py          # Ollama on Modal
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
**Last Updated**: 2025-11-29
