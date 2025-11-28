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
