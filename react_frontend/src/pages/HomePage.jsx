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
