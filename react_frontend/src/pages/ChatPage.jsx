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
      className="fixed inset-0 z-50 bg-gray-950"
    >
      <div className="h-full flex flex-col">
        {/* Compact Header */}
        <div className="flex-shrink-0 border-b border-white/10 bg-gray-900/95 backdrop-blur-xl">
          <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/catalog')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Catalog
            </motion.button>

            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br shadow-lg',
                  character.gradient
                )}
              >
                {character.emoji}
              </div>
              <div>
                <div className="font-bold text-base text-white">{character.name}</div>
                <div className="text-xs text-white/50">{character.tagline}</div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowContext(!showContext)}
              className="lg:hidden px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Full Screen Chat Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[360px,1fr] overflow-hidden">
          {/* Context Panel */}
          <div
            className={clsx(
              'border-r border-white/10 bg-gray-900/50 overflow-hidden',
              showContext ? 'block' : 'hidden lg:block'
            )}
          >
            <ContextPanel
              characterId={characterId}
              onClear={handleClearChat}
            />
          </div>

          {/* Chat Interface - Full Height */}
          <div className="bg-gray-950 overflow-hidden">
            <ChatInterface characterId={characterId} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPage;
