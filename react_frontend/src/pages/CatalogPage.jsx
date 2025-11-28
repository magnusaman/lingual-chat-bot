import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';
import { charactersStorage, GENRES } from '../utils/storage';
import { useState, useEffect } from 'react';
import StatusIndicator from '../components/StatusIndicator';

const CatalogPage = () => {
  const [characters, setCharacters] = useState([]);
  const [expandedGenres, setExpandedGenres] = useState({});

  useEffect(() => {
    // Clear localStorage to get fresh characters with new structure
    const existingChars = localStorage.getItem('lustlingual_characters');
    if (existingChars) {
      const parsed = JSON.parse(existingChars);
      // Check if using old format (no genre field or less than 48 chars)
      if (parsed[0] && (!parsed[0].genre || parsed.length < 40)) {
        localStorage.removeItem('lustlingual_characters');
      }
    }
    const chars = charactersStorage.get();
    setCharacters(chars);

    // Expand first genre by default
    if (GENRES.length > 0) {
      setExpandedGenres({ [GENRES[0].id]: true });
    }
  }, []);

  const toggleGenre = (genreId) => {
    setExpandedGenres(prev => ({
      ...prev,
      [genreId]: !prev[genreId]
    }));
  };

  const getCharactersByGenre = (genreId) => {
    return characters.filter(c => c.genre === genreId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero section */}
      <div className="relative pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-neon-cyan font-bold">
                  48 Personas • 6 Genres
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-extrabold mb-3">
                <span className="gradient-purple-cyan">Choose Your Fantasy</span>
              </h1>
              <p className="text-white/60 text-lg max-w-xl">
                Select a character for private AI roleplay. Each persona has unique personality, kinks, and boundaries.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StatusIndicator />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Genre Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {GENRES.map((genre, genreIndex) => {
          const genreCharacters = getCharactersByGenre(genre.id);
          const isExpanded = expandedGenres[genre.id];

          return (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: genreIndex * 0.1 }}
              className="mb-8"
            >
              {/* Genre Header */}
              <button
                onClick={() => toggleGenre(genre.id)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{genre.icon}</span>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-white">{genre.name}</h2>
                    <p className="text-sm text-white/50">{genreCharacters.length} characters</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/50 group-hover:text-white transition-colors"
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.div>
              </button>

              {/* Genre Characters */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
                      {genreCharacters.map((character, index) => (
                        <CharacterCard
                          key={character.id}
                          character={character}
                          delay={index * 0.05}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Create Custom Character */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <div className="p-6 rounded-xl border-2 border-dashed border-white/20 hover:border-neon-cyan/50 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-violet/20 to-neon-cyan/20 flex items-center justify-center group-hover:from-neon-violet/40 group-hover:to-neon-cyan/40 transition-all">
                <Plus className="w-7 h-7 text-white/50 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Create Custom Persona</h3>
                <p className="text-sm text-white/50">Design your own character with custom personality and kinks</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="my-12 flex items-center gap-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="text-white/30 text-sm uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Direct Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="card neon-border p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/10 via-transparent to-neon-cyan/10" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm text-white/60">No persona • Pure AI chat</span>
              </div>

              <h2 className="text-2xl lg:text-3xl font-display font-bold mb-3">
                <span className="gradient-purple-cyan">Direct Chat Mode</span>
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-6">
                Chat without a character persona. Set your own system prompt and memory.
              </p>

              <Link to="/direct-chat">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-violet to-neon-cyan text-white font-bold text-lg shadow-xl"
                >
                  <MessageSquare className="w-5 h-5" />
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
