import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import useOllama from '../hooks/useOllama';

const StatusIndicator = ({ compact = false }) => {
  const { isHealthy, refresh, isChecking } = useOllama();

  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={refresh}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/80 border border-white/10 hover:border-white/20 transition-all"
      >
        <div className="relative">
          <div
            className={`w-2 h-2 rounded-full ${
              isHealthy ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          {isHealthy && (
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
          )}
        </div>
        <span className={`text-xs font-medium ${isHealthy ? 'text-green-400' : 'text-red-400'}`}>
          {isHealthy ? 'Online' : 'Offline'}
        </span>
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
      className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-900/60 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-gray-900/80 transition-all cursor-pointer"
    >
      {/* Status dot */}
      <div className="relative">
        <div
          className={`w-3 h-3 rounded-full ${
            isHealthy ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        {isHealthy && (
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
        )}
      </div>

      {/* Status text */}
      <span className={`text-sm font-bold ${isHealthy ? 'text-green-400' : 'text-red-400'}`}>
        {isHealthy ? 'Online' : 'Offline'}
      </span>

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
