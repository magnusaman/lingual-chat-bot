import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { MessageCircle, Sparkles } from 'lucide-react';

const CharacterCard = ({ character, delay = 0 }) => {
  return (
    <Link to={`/chat/${character.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -12, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="card card-hover neon-border text-left w-full min-h-[320px] relative group overflow-hidden cursor-pointer"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50" />

        {/* Top shine effect */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Glowing orb on hover */}
        <div className={clsx(
          "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500",
          character.gradient?.includes('violet') && "bg-neon-violet",
          character.gradient?.includes('pink') && "bg-neon-pink",
          character.gradient?.includes('cyan') && "bg-neon-cyan",
        )} />

        {/* Content wrapper */}
        <div className="relative z-10">
          {/* Header with avatar and badge */}
          <div className="flex items-start justify-between mb-6">
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className={clsx(
                'w-18 h-18 rounded-2xl flex items-center justify-center text-4xl bg-gradient-to-br shadow-2xl ring-2 ring-white/10',
                character.gradient,
                'group-hover:ring-white/30 group-hover:shadow-neon-violet/30 transition-all duration-300'
              )}
              style={{ width: '72px', height: '72px' }}
            >
              {character.emoji}
            </motion.div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                Persona
              </span>
              <div className="flex items-center gap-1 text-neon-cyan/60">
                <Sparkles className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-wider">AI Enhanced</span>
              </div>
            </div>
          </div>

          {/* Character name with gradient */}
          <h3 className="text-2xl font-bold mb-3 font-display tracking-tight">
            <span className="gradient-purple-cyan">{character.name}</span>
          </h3>

          {/* Tagline */}
          <p className="text-white/60 text-sm leading-relaxed mb-6 min-h-[48px] line-clamp-2">
            {character.tagline}
          </p>

          {/* Tags row */}
          <div className="flex gap-2 flex-wrap mb-6">
            <span className="px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-violet/20 to-neon-pink/20 border border-neon-violet/30 text-neon-violet">
              NSFW
            </span>
            <span className="px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30 text-neon-cyan">
              Roleplay
            </span>
            <span className="px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider bg-white/5 border border-white/20 text-white/50">
              Interactive
            </span>
          </div>

          {/* Chat button hint */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/40 group-hover:text-white/70 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Start conversation</span>
            </div>
            <motion.div
              className="text-neon-cyan opacity-0 group-hover:opacity-100 transition-all duration-300"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-sm">→</span>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className={clsx(
          "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          character.gradient
        )} />
      </motion.div>
    </Link>
  );
};

export default CharacterCard;
