import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Download, Trash2, Sparkles, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { contextsStorage, charactersStorage } from '../utils/storage';
import toast from 'react-hot-toast';

const ContextPanel = ({ characterId, onClear }) => {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [memory, setMemory] = useState('');
  const [isPromptEditable, setIsPromptEditable] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [characterName, setCharacterName] = useState('');

  useEffect(() => {
    // Get character's default system prompt
    const characters = charactersStorage.get();
    const character = characters.find(c => c.id === characterId);

    if (character) {
      setCharacterName(character.name);
      // Always use character's built-in system prompt
      setSystemPrompt(character.systemPrompt || '');
    }

    // Load saved memory only
    const context = contextsStorage.getForCharacter(characterId);
    setMemory(context.memory || '');
  }, [characterId]);

  const handleSave = () => {
    // Only save memory, not the system prompt (it's fixed per character)
    contextsStorage.setForCharacter(characterId, {
      systemPrompt: systemPrompt, // Keep it for context but it's the character's default
      memory
    });
    toast.success('Memory saved!');
  };

  const handleExport = () => {
    const context = { systemPrompt, memory, characterId, characterName };
    const blob = new Blob([JSON.stringify(context, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${characterName.replace(/\s+/g, '_')}_context.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Context exported!');
  };

  const handleClearMemory = () => {
    setMemory('');
    contextsStorage.setForCharacter(characterId, { systemPrompt, memory: '' });
    toast.success('Memory cleared!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col p-6 space-y-4 bg-gray-950/30"
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-violet to-neon-cyan flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-display">
            {characterName}
          </h3>
          <p className="text-xs text-white/50">Persona & Memory</p>
        </div>
      </div>

      {/* Character Persona (Read-only by default) */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <Lock className="w-3 h-3" />
            Character Persona
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              className="text-xs text-white/50 hover:text-white flex items-center gap-1"
            >
              {showPrompt ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showPrompt ? 'Hide' : 'View'}
            </button>
            <button
              onClick={() => setIsPromptEditable(!isPromptEditable)}
              className="text-xs text-white/50 hover:text-neon-cyan flex items-center gap-1"
            >
              {isPromptEditable ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              {isPromptEditable ? 'Lock' : 'Edit'}
            </button>
          </div>
        </div>

        {showPrompt && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <textarea
              value={systemPrompt}
              onChange={(e) => isPromptEditable && setSystemPrompt(e.target.value)}
              readOnly={!isPromptEditable}
              className={`input h-32 custom-scrollbar text-xs ${
                !isPromptEditable ? 'bg-white/5 cursor-not-allowed opacity-70' : ''
              }`}
            />
            {!isPromptEditable && (
              <p className="text-xs text-white/40 mt-1">
                Persona is fixed. Click "Edit" to modify (advanced).
              </p>
            )}
          </motion.div>
        )}

        {!showPrompt && (
          <div className="text-xs text-white/40 bg-white/5 rounded-lg p-3">
            Character persona loaded. Click "View" to see details.
          </div>
        )}
      </div>

      {/* Memory Notes (Always Editable) */}
      <div className="flex-1 flex flex-col min-h-0">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          Memory Notes
          <span className="text-xs text-white/40 ml-2 font-normal">
            (persists between chats)
          </span>
        </label>
        <textarea
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          placeholder="Add facts about your relationship, story arcs, preferences...

Example:
- We met at a coffee shop
- They like being called pet names
- Current scene: romantic dinner"
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
          Save Memory
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="btn-secondary flex items-center justify-center px-4 shadow-lg"
          title="Export context"
        >
          <Download className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClearMemory}
          className="btn-secondary flex items-center justify-center px-4 text-red-400 hover:text-red-300 shadow-lg"
          title="Clear memory"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ContextPanel;
