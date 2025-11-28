# LustLingual - NSFW AI Chatbot

A bilingual (Hindi/English) NSFW chatbot with immersive roleplay capabilities. Features a premium glassmorphism UI with animated backgrounds.

![LustLingual](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.4-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## Features

- **4 Character Personas** - Harry Potter themed with detailed NSFW contexts
- **Direct Chat Mode** - Simple chatbot without persona
- **Glassmorphism UI** - Premium dark theme with animated backgrounds
- **Local & Private** - Runs on Ollama locally, no data leaves your machine
- **Context Management** - Custom system prompts and memory per character
- **Streaming Responses** - Real-time token generation

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS + Framer Motion
- React Router DOM
- Axios

### Backend
- FastAPI (Python)
- Ollama (Local LLM)
- dolphin-mistral model (7B, uncensored)

## Quick Start

### Prerequisites
1. [Node.js](https://nodejs.org/) (v18+)
2. [Python](https://python.org/) (v3.10+)
3. [Ollama](https://ollama.ai/)

### 1. Install Ollama & Model
```bash
# Install Ollama from https://ollama.ai/
# Then pull the model:
ollama pull dolphin-mistral
```

### 2. Clone & Install
```bash
git clone https://github.com/magnusaman/lingual-chat-bot.git
cd lingual-chat-bot

# Install frontend dependencies
cd react_frontend
npm install

# Install backend dependencies
cd ..
pip install -r requirements_ollama.txt
```

### 3. Run the Application

**Terminal 1 - Ollama:**
```bash
ollama serve
```

**Terminal 2 - Backend:**
```bash
python ollama_backend.py
```

**Terminal 3 - Frontend:**
```bash
cd react_frontend
npm run dev
```

### 4. Open in Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Ollama: http://localhost:11434

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `react_frontend`
4. Set environment variable:
   - `VITE_API_URL` = Your backend URL

### Backend Options

#### Option A: Local with ngrok (Demo)
```bash
# Install ngrok
ngrok http 8000
# Use the ngrok URL as VITE_API_URL
```

#### Option B: Modal (Production)
```bash
# Coming soon - Modal deployment script
```

#### Option C: Railway/Render
Deploy the FastAPI backend to any Python hosting service.

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Backend
No environment variables required for local development.

## Project Structure

```
lingual-chat-bot/
├── react_frontend/           # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # API & storage utilities
│   ├── package.json
│   └── vercel.json
├── ollama_backend.py         # FastAPI backend
├── requirements_ollama.txt   # Python dependencies
└── CLAUDE.md                # Development log
```

## Characters

| Character | Emoji | Personality |
|-----------|-------|-------------|
| Hermione Granger | 📚 | Brilliant, passionate, submissive |
| Ginny Weasley | 🔥 | Bold, dominant, competitive |
| Luna Lovegood | 🌙 | Dreamy, curious, tantric |
| Bellatrix Lestrange | ⚡ | Unhinged, dominant, intense |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/chat` | POST | Send message |
| `/chat/stream` | POST | Stream response (SSE) |
| `/context/{id}` | GET | Get character context |
| `/models` | GET | List available models |

## License

MIT License - Use responsibly.

## Disclaimer

This is an adult-oriented application. Users must be 18+ years old. All characters and scenarios are fictional.
