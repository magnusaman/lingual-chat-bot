import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Lock, MessageSquare, ArrowRight, Heart, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-neon-violet/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-pink/10 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/20 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-white/80">NSFW AI • Uncensored • Private</span>
            <Heart className="w-4 h-4 text-red-500" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold mb-8 leading-[0.95]"
          >
            <span className="block text-white mb-2">Your Fantasies</span>
            <span className="gradient-purple-cyan inline-block">No Limits</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            48 character personas for adult roleplay.{' '}
            <span className="text-neon-cyan font-semibold">100% private</span>,{' '}
            <span className="text-neon-violet font-semibold">no filters</span>,{' '}
            runs on your terms.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/catalog">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(124, 58, 237, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-violet via-neon-purple to-neon-cyan text-white font-bold text-lg shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Browse Personas
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-violet opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </Link>

            <Link to="/direct-chat">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl glass border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all text-white font-semibold"
              >
                <MessageSquare className="w-5 h-5" />
                Direct Chat
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-16"
          >
            <StatItem value="48" label="Personas" />
            <StatItem value="6" label="Genres" />
            <StatItem value="100%" label="Private" />
            <StatItem value="∞" label="Uncensored" />
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            id="features"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="48 Characters"
              description="Marvel, DC, Anime, Wizarding World, TV & Original personas with detailed kinks and personalities."
              gradient="from-neon-violet to-neon-pink"
              delay={0}
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Completely Private"
              description="Runs locally or on your own server. No logs, no filters, no judgment. Your fantasies stay yours."
              gradient="from-neon-pink to-neon-cyan"
              delay={0.1}
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Full Roleplay"
              description="Each persona has unique personality, desires, boundaries, and safewords for immersive experiences."
              gradient="from-neon-cyan to-neon-violet"
              delay={0.2}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const StatItem = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl lg:text-4xl font-display font-bold gradient-purple-cyan mb-1">{value}</div>
    <div className="text-sm text-white/50 uppercase tracking-wider">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, description, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.8 + delay }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="card card-hover neon-border group relative overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-neon-cyan transition-colors">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </div>

    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
  </motion.div>
);

export default Hero;
