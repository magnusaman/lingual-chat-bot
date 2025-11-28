import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, Home, Grid3X3, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import useOllama from '../hooks/useOllama';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isHealthy, message } = useOllama();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/catalog', label: 'Catalog', icon: Grid3X3 },
    { path: '/direct-chat', label: 'Direct Chat', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-violet to-neon-cyan blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
            </motion.div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan font-bold">
                LustLingual
              </div>
              <div className="font-display text-base font-extrabold tracking-tight text-white">
                NSFW AI Chatbot
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-violet/20 to-neon-cyan/20 border border-white/10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/80 border border-white/10"
            >
              <div className="relative">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isHealthy
                      ? 'bg-neon-cyan'
                      : 'bg-red-500'
                  }`}
                />
                {isHealthy && (
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-neon-cyan animate-ping opacity-75" />
                )}
              </div>
              <span className="text-sm font-medium text-white/70">{message}</span>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-white/10">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-neon-violet/20 to-neon-cyan/20 text-white border border-white/10'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Mobile Status */}
                <div className="pt-2 mt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 px-4 py-2 text-white/50">
                    <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-neon-cyan' : 'bg-red-500'}`} />
                    <span className="text-sm">{message}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
