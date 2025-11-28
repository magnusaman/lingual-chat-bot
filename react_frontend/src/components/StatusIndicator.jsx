import { motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import useOllama from '../hooks/useOllama';

const StatusIndicator = ({ compact = false }) => {
  const { isHealthy, message, refresh, isChecking } = useOllama();

  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={refresh}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/80 border border-white/10 hover:border-white/20 transition-all"
        title={message}
      >
        <div className="relative">
          <div
            className={`w-2 h-2 rounded-full ${
              isHealthy ? 'bg-neon-cyan' : 'bg-red-500'
            }`}
          />
          {isHealthy && (
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-neon-cyan animate-ping opacity-75" />
          )}
        </div>
        <span className="text-xs font-medium text-white/60">{isHealthy ? 'Online' : 'Offline'}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={refresh}
      disabled={isChecking}
      className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-900/60 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-gray-900/80 transition-all cursor-pointer"
    >
      {/* Status icon */}
      <div className="relative">
        {isHealthy ? (
          <Wifi className="w-4 h-4 text-neon-cyan" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        <div
          className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
            isHealthy ? 'bg-neon-cyan' : 'bg-red-500'
          }`}
        >
          {isHealthy && (
            <span className="absolute inset-0 rounded-full bg-neon-cyan animate-ping opacity-75" />
          )}
        </div>
      </div>

      {/* Status text */}
      <div className="flex flex-col items-start">
        <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">Ollama</span>
        <span className={`text-sm font-medium ${isHealthy ? 'text-neon-cyan' : 'text-red-400'}`}>
          {message}
        </span>
      </div>

      {/* Refresh icon */}
      <RefreshCw
        className={`w-4 h-4 text-white/30 group-hover:text-white/60 transition-all ${
          isChecking ? 'animate-spin' : ''
        }`}
      />
    </motion.button>
  );
};

export default StatusIndicator;
