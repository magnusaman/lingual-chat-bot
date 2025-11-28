import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';

const DirectChatPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gray-950"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-base text-white">Direct Chat</div>
                <div className="text-xs text-white/50">Chat without persona</div>
              </div>
            </div>

            <div className="w-32"></div>
          </div>
        </div>

        {/* Full Screen Chat */}
        <div className="flex-1 bg-gray-950 overflow-hidden">
          <ChatInterface characterId="direct" />
        </div>
      </div>
    </motion.div>
  );
};

export default DirectChatPage;
