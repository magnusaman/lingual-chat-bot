import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import clsx from 'clsx';

const MessageBubble = ({ message, index }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, type: "spring", stiffness: 100 }}
      className={clsx(
        'flex gap-3 items-start',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg',
          isUser
            ? 'bg-gradient-to-br from-neon-violet to-neon-cyan'
            : 'glass border border-white/20 bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20'
        )}
      >
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5 text-neon-cyan" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={clsx(
          'max-w-[75%] rounded-2xl px-5 py-3.5 shadow-lg',
          isUser
            ? 'bg-gradient-to-br from-neon-violet to-neon-cyan text-white font-medium'
            : 'glass border border-white/10 text-white/95 backdrop-blur-xl'
        )}
      >
        <div className="text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        {message.timestamp && (
          <div className={clsx(
            "text-xs mt-2 pt-2 border-t",
            isUser ? "border-white/20 text-white/70" : "border-white/10 text-white/40"
          )}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
