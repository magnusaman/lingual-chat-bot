import { motion } from 'framer-motion';
import { Plus, MessageSquare, Wand2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';
import { charactersStorage } from '../utils/storage';
import { useState, useEffect } from 'react';
import StatusIndicator from '../components/StatusIndicator';

const CatalogPage = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    // Clear localStorage to get fresh default characters with static IDs
    const existingChars = localStorage.getItem('lustlingual_characters');
    if (existingChars) {
      const parsed = JSON.parse(existingChars);
      // Check if using old dynamic IDs (contains underscore with random string)
      if (parsed[0]?.id && parsed[0].id.includes('_') && parsed[0].id.length > 20) {
        localStorage.removeItem('lustlingual_characters');
      }
    }
    setCharacters(charactersStorage.get());
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero section for catalog */}
      <div className="relative pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Wand2 className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-xs uppercase tracking-[0.3em] text-neon-cyan font-bold">
                  Choose Your Experience
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-display font-extrabold mb-4">
                <span className="gradient-purple-cyan">Character Catalog</span>
              </h1>
              <p className="text-white/60 text-lg max-w-xl">
                Select a persona to begin your immersive AI roleplay experience.
                Each character has unique personality traits and storylines.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <StatusIndicator />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Character Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8"
        >
          {characters.map((character, index) => (
            <CharacterCard
              key={character.id}
              character={character}
              delay={index * 0.1}
            />
          ))}

          {/* Create New Character Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: characters.length * 0.1 }}
            whileHover={{ y: -12, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="card neon-border min-h-[320px] flex flex-col items-center justify-center gap-6 text-white/50 hover:text-white group relative overflow-hidden cursor-pointer transition-all duration-300 hover:bg-white/5"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/5 to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Animated border on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-neon-violet/20 to-neon-cyan/20" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-5">
              <motion.div
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 group-hover:border-neon-cyan/50 flex items-center justify-center transition-all duration-300"
              >
                <Plus className="w-10 h-10 group-hover:text-neon-cyan transition-colors" />
              </motion.div>
              <div className="text-center">
                <span className="font-bold text-lg block mb-1">Create New</span>
                <span className="text-sm text-white/40">Design your own persona</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="my-16 flex items-center gap-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="text-white/30 text-sm uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Direct Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative"
        >
          <div className="card neon-border p-8 lg:p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 via-transparent to-neon-cyan/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
              >
                <Sparkles className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm text-white/60">No persona required</span>
              </motion.div>

              <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                <span className="gradient-purple-cyan">Start a Direct Chat</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto mb-8 text-lg">
                Skip the roleplay and chat directly with the AI. Perfect for casual conversations,
                quick questions, or exploring without a specific character persona.
              </p>

              <Link to="/direct-chat">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-neon-violet to-neon-cyan text-white font-bold text-lg shadow-2xl hover:shadow-neon-violet/50 transition-all"
                >
                  <MessageSquare className="w-6 h-6" />
                  <span>Open Direct Chat</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CatalogPage;
