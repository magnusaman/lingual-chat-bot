import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Download, Trash2, Sparkles } from 'lucide-react';
import { contextsStorage } from '../utils/storage';
import toast from 'react-hot-toast';

const ContextPanel = ({ characterId, onClear }) => {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [memory, setMemory] = useState('');

  useEffect(() => {
    // Load from storage first
    const context = contextsStorage.getForCharacter(characterId);

    // If no custom context exists, load from character's default systemPrompt
    if (!context.systemPrompt) {
      const characters = JSON.parse(localStorage.getItem('lustlingual_characters') || '[]');
      const character = characters.find(c => c.id === characterId);
      if (character && character.systemPrompt) {
        setSystemPrompt(character.systemPrompt);
        // Save it to context storage for future use
        contextsStorage.setForCharacter(characterId, { systemPrompt: character.systemPrompt, memory: '' });
      } else {
        setSystemPrompt('');
      }
    } else {
      setSystemPrompt(context.systemPrompt);
    }

    setMemory(context.memory || '');
  }, [characterId]);

  const handleSave = () => {
    contextsStorage.setForCharacter(characterId, { systemPrompt, memory });
    toast.success('Context saved successfully!');
  };

  const handleExport = () => {
    const context = { systemPrompt, memory, characterId };
    const blob = new Blob([JSON.stringify(context, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `character_${characterId}_context.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Context exported!');
  };

  const quickContexts = [
    { label: 'Flirty', value: 'Tone: flirtatious, playful.' },
    { label: 'Poetic', value: 'Style: poetic cyberpunk slang.' },
    { label: 'Slow Burn', value: 'Pacing: slow reveal, vivid detail.' },
    { label: 'Boundaries', value: 'Consent-affirming, safe word: Orion.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col p-6 space-y-5 bg-gray-950/30"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold gradient-purple-cyan font-display">
          Context & Memory
        </h3>
      </div>

      {/* System Prompt */}
      <div className="flex-shrink-0">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          System Prompt
        </label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Describe the character's persona, boundaries, speaking style..."
          className="input h-40 custom-scrollbar text-sm"
        />
      </div>

      {/* Quick Context Chips */}
      <div className="flex-shrink-0">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          Quick Commands
        </label>
        <div className="flex flex-wrap gap-2">
          {quickContexts.map((ctx) => (
            <motion.button
              key={ctx.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setSystemPrompt((prev) => `${prev}\n${ctx.value}`.trim())
              }
              className="px-3 py-1.5 rounded-lg text-xs font-medium glass glass-hover border border-white/10 hover:border-neon-cyan/50"
            >
              {ctx.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Memory */}
      <div className="flex-1 flex flex-col min-h-0">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          Memory Notes
        </label>
        <textarea
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          placeholder="Add facts to persist about this relationship or story arc..."
          className="input flex-1 custom-scrollbar text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-white/10 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="flex-1 btn-primary flex items-center justify-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          Save
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="btn-secondary flex items-center justify-center px-4 shadow-lg"
        >
          <Download className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          className="btn-secondary flex items-center justify-center px-4 text-red-400 hover:text-red-300 shadow-lg hover:shadow-red-500/30"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ContextPanel;
