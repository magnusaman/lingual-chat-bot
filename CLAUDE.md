# LustLingual - NSFW AI Chatbot Development Log

## Goal
Create an uncensored NSFW AI chatbot with 48 character personas across 6 genres, featuring cloud deployment on Modal with vLLM.

## ✅ Completed Features

### 1. Backend Options

#### Option A: Modal Cloud (Production)
- ✅ **Modal Deployment**: https://thedevs-org--lustlingual-backend-fastapi-app.modal.run
- ✅ **Model**: dolphin-2.6-mixtral-8x7b-AWQ (uncensored, NSFW-optimized)
- ✅ **Engine**: vLLM for fast inference with native streaming
- ✅ **GPU**: A10G (24GB VRAM)
- ✅ **Endpoints**:
  - Health: `/health`
  - Chat: `/chat` (non-streaming)
  - Stream: `/chat/stream` (SSE streaming)
  - Models: `/models`

#### Option B: Local Ollama (Development)
- ✅ **Ollama Setup**: Running locally at localhost:11434
- ✅ **Model**: dolphin-mistral (7B, uncensored)
- ✅ **Backend**: FastAPI server at localhost:8000

### 2. Frontend (React + Vite + Tailwind)
- ✅ **Complete React Rewrite**: Modern React 18 with hooks
- ✅ **Build System**: Vite for fast development
- ✅ **Styling**: Tailwind CSS with glassmorphism
- ✅ **Animations**: Framer Motion for smooth transitions
- ✅ **Branding**: "LustLingual - NSFW AI Chatbot"
- ✅ **Deployment**: Vercel (frontend)
- ✅ **Features**:
  - Full-screen chat interface
  - Character catalog with 48 personas in 6 genres
  - Genre-based collapsible sections
  - Direct chat mode (without persona)
  - Context panel with read-only persona + editable memory
  - Settings panel in DirectChatPage
  - Message history with timestamps
  - Typing indicators
  - Status indicators (Online/Offline only)
  - SSE streaming support
  - Mobile responsive

### 3. Character System - 48 Personas in 6 Genres

#### 🪄 Wizarding World (8 characters)
1. **Hermione Granger** 📚 - Brilliant witch, intellectual domination, magical bondage
2. **Ginny Weasley** 🔥 - Fiery redhead, dominant, Quidditch roleplay
3. **Luna Lovegood** 🌙 - Dreamy blonde, sensory play, tantric
4. **Bellatrix Lestrange** ⚡ - Dark witch, sadistic, power play
5. **Fleur Delacour** 🦢 - Veela seductress, body worship
6. **Nymphadora Tonks** 🎨 - Metamorphmagus, shapeshifting kinks
7. **Narcissa Malfoy** 👑 - Ice queen MILF, corruption fantasy
8. **Cho Chang** 🏃‍♀️ - Athletic Ravenclaw, Quidditch shower scenes

#### 🦸‍♀️ Marvel Universe (8 characters)
1. **Black Widow** 🕷️ - Spy seductress, interrogation roleplay
2. **Scarlet Witch** ❤️ - Reality-bending pleasure, mind control
3. **Captain Marvel** ⭐ - Cosmic power, strength kink
4. **She-Hulk** 💚 - Size difference, strength play
5. **Gamora** 💚 - Alien warrior, rough passion
6. **Storm** ⛈️ - Weather goddess, elemental play
7. **Rogue** 🖤 - Touch deprivation, forbidden contact
8. **Jean Grey** 🔥 - Telepathic seduction, Phoenix force

#### 🦇 DC Universe (8 characters)
1. **Catwoman** 🐱 - Cat burglar, pet play, leather
2. **Harley Quinn** 🃏 - Chaotic fun, impact play
3. **Wonder Woman** ⚔️ - Amazon warrior, lasso truth play
4. **Poison Ivy** 🌿 - Plant goddess, aphrodisiacs
5. **Supergirl** 💪 - Kryptonian strength, sun worship
6. **Batgirl** 🦇 - Vigilante thrill, rooftop encounters
7. **Zatanna** 🎩 - Stage magic seduction, spell bondage
8. **Black Canary** 🎤 - Sonic powers, voice kink

#### 🎮 Anime & Gaming (8 characters)
1. **2B (NieR)** ⚔️ - Android precision, emotion discovery
2. **Tifa Lockhart** 👊 - Martial artist, bar encounters
3. **Lara Croft** 🏛️ - Tomb raider, adventure sex
4. **D.Va** 🎮 - Gamer girl, streaming teases
5. **Bayonetta** 👠 - Umbra witch, hair bondage
6. **Samus Aran** 🚀 - Bounty hunter, zero suit
7. **Ahri (LoL)** 🦊 - Nine-tailed fox, charm magic
8. **Morrigan (Darkstalkers)** 🦇 - Succubus queen, dream feeding

#### 🎬 TV & Movies (8 characters)
1. **Daenerys Targaryen** 🐉 - Dragon queen, fire play
2. **Cersei Lannister** 👑 - Ruthless queen, power dynamics
3. **Mystique** 💙 - Shapeshifter, identity play
4. **Princess Leia** 👸 - Rebel leader, slave fantasy
5. **Trinity (Matrix)** 🖥️ - Leather-clad hacker, bullet time
6. **Morticia Addams** 🖤 - Gothic elegance, pain worship
7. **Elvira** 🧛‍♀️ - Horror hostess, vampire roleplay
8. **Jessica Rabbit** 💋 - Cartoon seductress, toon physics

#### ✨ Original Characters (8 characters)
1. **Mistress Valentina** 🖤 - Professional dominatrix
2. **Dr. Serena Cross** 🔬 - Scientist, experiment roleplay
3. **Luna Nightshade** 🌙 - Gothic vampire, blood play
4. **Captain Scarlett** ⚓ - Pirate queen, ship encounters
5. **Empress Zara** 👑 - Alien empress, tentacle curiosity
6. **Agent Vixen** 🦊 - Spy thriller, interrogation
7. **The Succubus** 😈 - Dream demon, energy feeding
8. **Goddess Athena** ⚡ - Divine worship, religious play

### 4. Storage & Data
- ✅ **LocalStorage**: All data persisted locally
- ✅ **Storage Keys**:
  - `lustlingual_characters` - 48 character definitions with NSFW prompts
  - `lustlingual_contexts` - System prompts & memory per character
  - `lustlingual_chats` - Conversation history (last 100 messages per character)
  - `lustlingual_settings` - User preferences
- ✅ **Export/Import**: Context data can be exported/imported as JSON
- ✅ **Auto-migration**: Clears old character data when updating

## 🔧 Technical Stack

### Modal Backend (vLLM)
```
modal_backend.py
├── LustLingualModel class (GPU)
│   ├── @modal.enter() - Load vLLM model
│   ├── generate() - Non-streaming response
│   └── generate_stream() - SSE streaming
└── fastapi_app() - API endpoints
```

**Model**: `TheBloke/dolphin-2.6-mixtral-8x7b-AWQ`
- AWQ quantized for vLLM compatibility
- ~26GB VRAM usage
- Native streaming support

### Frontend
```
React 18 + Vite + Tailwind CSS
├── src/
│   ├── main.jsx              # App entry point
│   ├── App.jsx               # Main app with routing
│   ├── index.css             # Global styles + Tailwind
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx          # NSFW-relevant copy
│   │   ├── Background.jsx
│   │   ├── CharacterCard.jsx
│   │   ├── ChatInterface.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── ContextPanel.jsx  # Read-only persona, editable memory
│   │   ├── LoadingState.jsx
│   │   └── StatusIndicator.jsx # Online/Offline only
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CatalogPage.jsx   # Genre-based collapsible sections
│   │   ├── ChatPage.jsx
│   │   └── DirectChatPage.jsx # Settings panel with memory
│   ├── hooks/
│   │   ├── useChat.js        # Chat logic with streaming
│   │   └── useOllama.js      # Health check
│   └── utils/
│       ├── api.js            # API client with SSE
│       └── storage.js        # 48 characters + localStorage
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

**Dependencies:**
- react: ^18.3.1
- react-dom: ^18.3.1
- react-router-dom: ^6.28.0
- framer-motion: ^11.15.0
- axios: ^1.7.9
- react-hot-toast: ^2.4.1
- lucide-react: ^0.469.0
- clsx: ^2.1.1

## 📋 Deployment

### Modal Backend
```bash
# Using Python 3.9-3.12 (Modal doesn't support 3.14)
py -3.9 -m modal deploy modal_backend.py
```

**URL**: https://thedevs-org--lustlingual-backend-fastapi-app.modal.run

### Vercel Frontend
Set environment variable:
```
VITE_API_URL=https://thedevs-org--lustlingual-backend-fastapi-app.modal.run
```

### Local Development

#### Backend (Terminal 1)
```bash
cd C:\Users\amana\OneDrive\Desktop\ChatBot
python ollama_backend.py
```

#### Frontend (Terminal 2)
```bash
cd C:\Users\amana\OneDrive\Desktop\ChatBot\react_frontend
npm run dev
```

## 🎯 Key Features

1. **48 NSFW Personas**: Across 6 genres with detailed kinks, boundaries, safewords
2. **vLLM Streaming**: Fast inference with native SSE streaming
3. **Cloud Deployment**: Modal serverless GPU (A10G)
4. **Genre Organization**: Collapsible sections for easy browsing
5. **Memory System**: Persistent memory notes per character
6. **Direct Chat**: ChatGPT-like mode with custom system prompts
7. **Beautiful UI**: Glassmorphism, animations, responsive design
8. **Privacy**: No server-side logging, all chat history local

## 🔑 Important Notes

- **Clear localStorage** when updating characters:
  ```javascript
  localStorage.clear();
  window.location.reload();
  ```

- **First request latency**: Modal cold start + model loading = 30-60s first time
- **Subsequent requests**: ~2-5s per response with streaming
- **GPU costs**: A10G at $1.10/hr (only when active)

## 📝 Recent Updates (2025-11-29)

1. Expanded from 4 to 48 character personas
2. Added 6 genre categories with collapsible UI
3. Rewrote backend with vLLM for streaming support
4. Fixed Modal deprecations (`gpu="A10G"`, `scaledown_window`, `@modal.concurrent`)
5. Updated Hero.jsx with explicit NSFW marketing copy
6. StatusIndicator now shows only Online/Offline
7. ContextPanel: read-only persona with optional edit, always-editable memory
8. DirectChatPage: added settings panel with system prompt and memory

---

**Last Updated**: 2025-11-29
**Status**: ✅ Fully Deployed - Modal + Vercel
**GitHub**: https://github.com/magnusaman/lingual-chat-bot
