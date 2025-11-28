/**
 * ALL REACT COMPONENTS
 * Split this file into individual component files as shown in comments
 * Each section is marked with the filename it should go into
 */

// ==================== src/components/Navbar.jsx ====================
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useOllama from '../hooks/useOllama';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isHealthy, message } = useOllama();

  return (
    <nav className="relative z-50 border-b border-white/10 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <div className="text-xs uppercase tracking-widest text-white/60">
                LustLingual
              </div>
              <div className="font-display text-sm font-bold tracking-tight">
                NSFW AI Chatbot
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" active={location.pathname === '/'}>
              Home
            </NavLink>
            <NavLink to="/catalog" active={location.pathname === '/catalog'}>
              Catalog
            </NavLink>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
              <div
                className={`w-2 h-2 rounded-full ${
                  isHealthy ? 'bg-neon-cyan animate-pulse' : 'bg-red-500'
                }`}
              />
              <span className="text-xs text-white/70">{message}</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg glass glass-hover"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 space-y-2"
          >
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/catalog" onClick={() => setIsMenuOpen(false)}>
              Catalog
            </MobileNavLink>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className={`text-sm font-medium transition-colors ${
      active ? 'text-white' : 'text-white/60 hover:text-white'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 rounded-lg text-white/80 hover:bg-white/5 transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;

// ==================== src/components/Hero.jsx ====================
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold mb-6">
            <span className="gradient-purple-cyan">Unleash Tomorrow.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-white/70 mb-8 max-w-3xl mx-auto">
            AI experiences designed beyond imagination — immersive roleplay and
            premium storytelling powered by{' '}
            <span className="text-neon-cyan font-semibold">Ollama</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/catalog">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary shimmer"
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                Enter the Future
              </motion.button>
            </Link>

            <a href="#features">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                Explore More →
              </motion.button>
            </a>
          </div>

          {/* Feature Cards */}
          <div
            id="features"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="One-Click Personas"
              description="Launch a story with tuned archetypes designed for chemistry and depth."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Custom Contexts"
              description="Define tone, limits, world rules, and memory snippets — per character."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Streamed Replies"
              description="Fluid token-by-token generation for an alive, dynamic feel."
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="card card-hover neon-border"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center mb-4 animate-pulse-glow">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-white/60 text-sm">{description}</p>
  </motion.div>
);

export default Hero;

// ==================== src/components/CharacterCard.jsx ====================
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const CharacterCard = ({ character, delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/chat/${character.id}`)}
      className="card card-hover neon-border text-left w-full min-h-[220px] relative group"
    >
      {/* Top border shine */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={clsx(
            'w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br',
            character.gradient,
            'animate-pulse-glow'
          )}
        >
          {character.emoji}
        </div>
        <span className="text-xs text-white/50 uppercase tracking-wider">
          Persona
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          {character.name}
        </h3>
        <p className="text-white/60 text-sm line-clamp-2 mb-4">
          {character.tagline}
        </p>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 rounded-md text-xs bg-white/5 border border-white/10">
            NSFW
          </span>
          <span className="px-2 py-1 rounded-md text-xs bg-white/5 border border-white/10">
            Roleplay
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default CharacterCard;

// ==================== src/components/MessageBubble.jsx ====================
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import clsx from 'clsx';

const MessageBubble = ({ message, index }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={clsx(
        'flex gap-3 items-start',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          isUser
            ? 'bg-gradient-to-br from-neon-violet to-neon-cyan'
            : 'glass border border-white/10'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={clsx(
          'max-w-[75%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-gradient-to-br from-neon-violet to-neon-cyan text-white'
            : 'glass border border-white/10 text-white/90'
        )}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;

// ==================== src/components/ChatInterface.jsx ====================
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, StopCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import useChat from '../hooks/useChat';

const ChatInterface = ({ characterId }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, isLoading, isStreaming, send, stop } = useChat(characterId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await send(message);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} index={index} />
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && !isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass border border-white/10 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce animation-delay-100" />
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce animation-delay-200" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-white/10 glass"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your message..."
            rows={1}
            className="input flex-1 resize-none max-h-32 custom-scrollbar"
            disabled={isLoading}
          />

          {isStreaming ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={stop}
              className="px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-2 transition-colors"
            >
              <StopCircle className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn-primary shimmer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;

// ==================== src/components/ContextPanel.jsx ====================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Download, Trash2, Sparkles } from 'lucide-react';
import { contextsStorage } from '../utils/storage';
import toast from 'react-hot-toast';

const ContextPanel = ({ characterId, onClear }) => {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [memory, setMemory] = useState('');

  useEffect(() => {
    const context = contextsStorage.getForCharacter(characterId);
    setSystemPrompt(context.systemPrompt || '');
    setMemory(context.memory || '');
  }, [characterId]);

  const handleSave = () => {
    contextsStorage.setForCharacter(characterId, { systemPrompt, memory });
    toast.success('Context saved successfully!');
  };

  const handleExport = () => {
    const context = { systemPrompt, memory, characterId };
    const blob = new Blob([JSON.stringify(context, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `character_${characterId}_context.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Context exported!');
  };

  const quickContexts = [
    { label: 'Flirty', value: 'Tone: flirtatious, playful.' },
    { label: 'Poetic', value: 'Style: poetic cyberpunk slang.' },
    { label: 'Slow Burn', value: 'Pacing: slow reveal, vivid detail.' },
    { label: 'Boundaries', value: 'Consent-affirming, safe word: Orion.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col p-6 space-y-6"
    >
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-neon-cyan" />
        Context
      </h3>

      {/* System Prompt */}
      <div>
        <label className="block text-sm text-white/70 mb-2">
          System Prompt
        </label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Describe the character's persona, boundaries, speaking style..."
          className="input h-40 custom-scrollbar"
        />
      </div>

      {/* Quick Context Chips */}
      <div>
        <label className="block text-sm text-white/70 mb-2">
          Quick Commands
        </label>
        <div className="flex flex-wrap gap-2">
          {quickContexts.map((ctx) => (
            <button
              key={ctx.label}
              onClick={() =>
                setSystemPrompt((prev) => `${prev}\n${ctx.value}`.trim())
              }
              className="px-3 py-1.5 rounded-lg text-sm glass glass-hover"
            >
              {ctx.label}
            </button>
          ))}
        </div>
      </div>

      {/* Memory */}
      <div>
        <label className="block text-sm text-white/70 mb-2">Memory</label>
        <textarea
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          placeholder="Add facts to persist about this relationship or story arc..."
          className="input h-24 custom-scrollbar"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="flex-1 btn-primary flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="btn-secondary flex items-center justify-center"
        >
          <Download className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClear}
          className="btn-secondary flex items-center justify-center text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ContextPanel;

// ==================== src/components/LoadingState.jsx ====================
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] gap-4"
    >
      <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
      <p className="text-white/60">{message}</p>
    </motion.div>
  );
};

export default LoadingState;

// ==================== src/components/StatusIndicator.jsx ====================
import { motion } from 'framer-motion';
import useOllama from '../hooks/useOllama';

const StatusIndicator = () => {
  const { isHealthy, message, refresh } = useOllama();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer"
      onClick={refresh}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isHealthy
            ? 'bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse'
            : 'bg-red-500'
        }`}
      />
      <span className="text-sm text-white/80">{message}</span>
    </motion.div>
  );
};

export default StatusIndicator;

// ==================== src/pages/HomePage.jsx ====================
import { motion } from 'framer-motion';
import Hero from '../components/Hero';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <Hero />
    </motion.div>
  );
};

export default HomePage;

// ==================== src/pages/CatalogPage.jsx ====================
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import CharacterCard from '../components/CharacterCard';
import { charactersStorage } from '../utils/storage';
import { useState, useEffect } from 'react';
import StatusIndicator from '../components/StatusIndicator';

const CatalogPage = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    setCharacters(charactersStorage.get());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">
            <span className="gradient-purple-cyan">Character Catalog</span>
          </h1>
          <p className="text-white/60">
            Choose a persona to begin your story
          </p>
        </div>

        <StatusIndicator />
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {characters.map((character, index) => (
          <CharacterCard
            key={character.id}
            character={character}
            delay={index * 0.1}
          />
        ))}

        {/* Create New Character Card */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: characters.length * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="card card-hover neon-border min-h-[220px] flex flex-col items-center justify-center gap-4 text-white/60 hover:text-white"
        >
          <div className="w-14 h-14 rounded-xl glass flex items-center justify-center">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-semibold">Create New Character</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CatalogPage;

// ==================== src/pages/ChatPage.jsx ====================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import ContextPanel from '../components/ContextPanel';
import LoadingState from '../components/LoadingState';
import { charactersStorage, chatsStorage } from '../utils/storage';
import clsx from 'clsx';

const ChatPage = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [showContext, setShowContext] = useState(false);

  useEffect(() => {
    const char = charactersStorage
      .get()
      .find((c) => c.id === characterId);
    if (!char) {
      navigate('/catalog');
    } else {
      setCharacter(char);
    }
  }, [characterId, navigate]);

  const handleClearChat = () => {
    if (confirm('Clear this conversation?')) {
      chatsStorage.clearForCharacter(characterId);
      window.location.reload();
    }
  };

  if (!character) {
    return <LoadingState message="Loading character..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[calc(100vh-4rem)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/catalog')}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div
              className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br',
                character.gradient,
                'animate-pulse-glow'
              )}
            >
              {character.emoji}
            </div>
            <div>
              <div className="font-semibold">{character.name}</div>
              <div className="text-xs text-white/60">{character.tagline}</div>
            </div>
          </div>

          <button
            onClick={() => setShowContext(!showContext)}
            className="btn-secondary lg:hidden"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-4 h-[calc(100%-80px)]">
          {/* Context Panel */}
          <div
            className={clsx(
              'neon-border glass overflow-hidden',
              showContext ? 'block' : 'hidden lg:block'
            )}
          >
            <ContextPanel
              characterId={characterId}
              onClear={handleClearChat}
            />
          </div>

          {/* Chat Interface */}
          <div className="neon-border glass overflow-hidden">
            <ChatInterface characterId={characterId} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPage;
