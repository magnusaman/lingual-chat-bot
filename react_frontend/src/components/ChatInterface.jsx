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
    <div className="flex flex-col h-full bg-gray-950/30">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center text-4xl shadow-lg">
              💬
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 gradient-purple-cyan">Start a Conversation</h3>
              <p className="text-white/60 text-sm max-w-md">
                Send a message to begin your roleplay experience. Your AI companion is ready to chat!
              </p>
            </div>
          </motion.div>
        )}

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
            <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center shadow-lg">
              <Loader2 className="w-5 h-5 animate-spin text-neon-cyan" />
            </div>
            <div className="glass border border-white/10 rounded-2xl px-5 py-3 shadow-lg">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-neon-violet rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-neon-purple rounded-full animate-bounce animation-delay-100" />
                <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce animation-delay-200" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-white/10 glass backdrop-blur-xl"
      >
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            rows={1}
            className="input flex-1 resize-none max-h-32 custom-scrollbar text-base"
            disabled={isLoading}
          />

          {isStreaming ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={stop}
              className="px-5 py-3 rounded-xl bg-red-500/90 hover:bg-red-600 text-white font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-red-500/50"
            >
              <StopCircle className="w-5 h-5" />
              Stop
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn-primary shimmer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
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
