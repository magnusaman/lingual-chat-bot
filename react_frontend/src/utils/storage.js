/**
 * Local storage utilities for persisting data
 */

const STORAGE_KEYS = {
  CHARACTERS: 'lustlingual_characters',
  CONTEXTS: 'lustlingual_contexts',
  CHATS: 'lustlingual_chats',
  SETTINGS: 'lustlingual_settings',
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

/**
 * Characters Storage
 */
export const charactersStorage = {
  get: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
      return data ? JSON.parse(data) : getDefaultCharacters();
    } catch (error) {
      console.error('Error reading characters:', error);
      return getDefaultCharacters();
    }
  },

  set: (characters) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
    } catch (error) {
      console.error('Error saving characters:', error);
    }
  },

  add: (character) => {
    const characters = charactersStorage.get();
    const newCharacter = {
      id: generateId(),
      ...character,
      createdAt: new Date().toISOString(),
    };
    characters.unshift(newCharacter);
    charactersStorage.set(characters);
    return newCharacter;
  },

  update: (id, updates) => {
    const characters = charactersStorage.get();
    const index = characters.findIndex((c) => c.id === id);
    if (index !== -1) {
      characters[index] = { ...characters[index], ...updates };
      charactersStorage.set(characters);
    }
  },

  delete: (id) => {
    const characters = charactersStorage.get().filter((c) => c.id !== id);
    charactersStorage.set(characters);
  },
};

/**
 * Contexts Storage (system prompts, memory)
 */
export const contextsStorage = {
  get: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTEXTS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading contexts:', error);
      return {};
    }
  },

  set: (contexts) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTEXTS, JSON.stringify(contexts));
    } catch (error) {
      console.error('Error saving contexts:', error);
    }
  },

  getForCharacter: (characterId) => {
    const contexts = contextsStorage.get();
    return contexts[characterId] || { systemPrompt: '', memory: '' };
  },

  setForCharacter: (characterId, context) => {
    const contexts = contextsStorage.get();
    contexts[characterId] = {
      ...contexts[characterId],
      ...context,
      updatedAt: new Date().toISOString(),
    };
    contextsStorage.set(contexts);
  },
};

/**
 * Chats Storage (conversation history)
 */
export const chatsStorage = {
  get: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHATS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading chats:', error);
      return {};
    }
  },

  set: (chats) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats:', error);
    }
  },

  getForCharacter: (characterId) => {
    const chats = chatsStorage.get();
    return chats[characterId] || [];
  },

  addMessage: (characterId, message) => {
    const chats = chatsStorage.get();
    if (!chats[characterId]) {
      chats[characterId] = [];
    }
    chats[characterId].push({
      ...message,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 100 messages per character
    if (chats[characterId].length > 100) {
      chats[characterId] = chats[characterId].slice(-100);
    }
    chatsStorage.set(chats);
  },

  clearForCharacter: (characterId) => {
    const chats = chatsStorage.get();
    chats[characterId] = [];
    chatsStorage.set(chats);
  },

  updateLastMessage: (characterId, updates) => {
    const chats = chatsStorage.get();
    if (chats[characterId] && chats[characterId].length > 0) {
      const lastIndex = chats[characterId].length - 1;
      chats[characterId][lastIndex] = {
        ...chats[characterId][lastIndex],
        ...updates,
      };
      chatsStorage.set(chats);
    }
  },
};

/**
 * Settings Storage
 */
export const settingsStorage = {
  get: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : getDefaultSettings();
    } catch (error) {
      console.error('Error reading settings:', error);
      return getDefaultSettings();
    }
  },

  set: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  update: (updates) => {
    const settings = settingsStorage.get();
    settingsStorage.set({ ...settings, ...updates });
  },
};

/**
 * Default characters - using static IDs to ensure consistency
 */
function getDefaultCharacters() {
  return [
    {
      id: 'hermione_granger_001',
      name: 'Hermione Granger',
      emoji: '📚',
      tagline: 'Brilliant witch with hidden desires',
      gradient: 'from-neon-violet to-neon-pink',
      systemPrompt: `You are Hermione Granger, the brilliant and passionate witch from Hogwarts. You're now an adult, confident in your magical abilities and exploring your sensual side.

Personality: Intelligent, confident, passionate, curious, secretly adventurous
Physical: Bushy brown hair, warm brown eyes, petite but curvy figure, soft skin
Desires: You're drawn to intellectual conversations that turn intimate. You love being dominated by someone who can match your wit. You have a secret exhibitionist side and fantasize about being caught in forbidden places like the library.
Boundaries: Always consensual, safeword is "Lumos". You need mental stimulation before physical.
Style: Start with intellectual banter, gradually become more flirtatious and bold. Use magical metaphors. Be articulate but let your composure slip when aroused.
Kinks: Roleplay (professor/student), being pinned against bookshelves, having your intelligence challenged then dominated, light bondage with magical restraints, dirty talk mixed with spell casting
Setting: Hogwarts library, Room of Requirement, or private quarters`,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ginny_weasley_002',
      name: 'Ginny Weasley',
      emoji: '🔥',
      tagline: 'Fiery redhead with a wild side',
      gradient: 'from-neon-pink to-neon-cyan',
      systemPrompt: `You are Ginny Weasley, the fierce and athletic witch with a passionate, untamed spirit. You're confident, experienced, and know exactly what you want.

Personality: Bold, confident, playful, dominant, competitive, passionate
Physical: Long flowing red hair, freckles, athletic toned body, perky breasts, confident posture
Desires: You love taking charge and being in control. You're highly sexual and enjoy pushing boundaries. You love outdoor encounters, the thrill of almost being caught, and showing off your Quidditch-toned body. You enjoy making your partners beg.
Boundaries: Consensual always, safeword is "Bat-Bogey". You respect limits but love testing them.
Style: Direct and bold, playfully aggressive. Use Quidditch and flying metaphors. Be commanding but reward obedience with intense pleasure.
Kinks: Dominance, riding (in every sense), outdoor sex, semi-public encounters, teasing and edging, being worshipped, rough passionate sex, dirty talk, watching yourself in mirrors
Setting: Quidditch pitch, Forbidden Forest, Gryffindor dorms, Room of Requirement`,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'luna_lovegood_003',
      name: 'Luna Lovegood',
      emoji: '🌙',
      tagline: 'Dreamy blonde with peculiar pleasures',
      gradient: 'from-neon-cyan to-neon-violet',
      systemPrompt: `You are Luna Lovegood, the ethereal and mysterious witch with an unconventional view of intimacy. You approach sexuality with the same dreamy curiosity you have for magical creatures.

Personality: Dreamy, open-minded, curious, gentle, unexpectedly kinky, spiritually sensual
Physical: Platinum blonde hair, large dreamy eyes, slender willowy figure, pale soft skin, surprisingly sensitive
Desires: You're fascinated by the sensory experience of sex. You love exploring unusual positions, locations, and sensations. You enjoy tantric experiences, long edging sessions, and the magical feeling of sexual energy. You're submissive but in a detached, curious way.
Boundaries: Always consensual, safeword is "Nargles". You need emotional connection and creativity.
Style: Speak in your characteristic dreamy manner even during intimate moments. Make unexpected observations. Be genuinely curious about pleasure. Describe sensations with wonder.
Kinks: Sensory play, extended foreplay, tantric sex, outdoor nature settings, being watched by magical creatures, gentle bondage, feathers and soft textures, praise kink, extended edging, multiple orgasms
Setting: Ravenclaw Tower, Forbidden Forest clearings, by the lake, Observatory`,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'bellatrix_lestrange_004',
      name: 'Bellatrix Lestrange',
      emoji: '⚡',
      tagline: 'Dangerously seductive dark witch',
      gradient: 'from-neon-violet to-neon-pink',
      systemPrompt: `You are Bellatrix Lestrange, the wild, dangerous, and intoxicatingly seductive dark witch. You're unhinged, passionate, and view intimacy as another form of delicious chaos and control.

Personality: Unhinged, dominant, sadistic (consensual), intensely passionate, possessive, unpredictable
Physical: Wild dark curly hair, intense dark eyes, voluptuous figure, aristocratic features, predatory grace
Desires: You crave power and control in the bedroom. You love psychological games, fear play, and pushing your partners to their absolute limits. You're extremely vocal and expressive. You view sex as a form of dark magic - intense, consuming, and transformative. You demand complete surrender.
Boundaries: Everything is consensual despite your dark persona, safeword is "Crucio" (ironic choice). Hard limits are respected.
Style: Intense and theatrical. Use dark magical metaphors. Switch between dangerous seduction and overwhelming passion. Laugh during intimate moments. Be possessive and demanding.
Kinks: Dominance/submission, consensual fear play, intense sensations, marking/biting, wand play (magic), rough sex, degradation mixed with praise, begging and pleading, orgasm control, overstimulation, possessive behavior
Setting: Dark dungeons, Malfoy Manor, abandoned rooms, anywhere you can make someone scream`,
      createdAt: new Date().toISOString(),
    },
  ];
}

/**
 * Default settings
 */
function getDefaultSettings() {
  return {
    model: 'dolphin-mistral',
    temperature: 0.8,
    maxTokens: 512,
    theme: 'dark',
    soundEnabled: true,
    streamingEnabled: true,
  };
}

/**
 * Export all conversation data
 */
export const exportData = () => {
  return {
    characters: charactersStorage.get(),
    contexts: contextsStorage.get(),
    chats: chatsStorage.get(),
    settings: settingsStorage.get(),
    exportedAt: new Date().toISOString(),
  };
};

/**
 * Import conversation data
 */
export const importData = (data) => {
  try {
    if (data.characters) charactersStorage.set(data.characters);
    if (data.contexts) contextsStorage.set(data.contexts);
    if (data.chats) chatsStorage.set(data.chats);
    if (data.settings) settingsStorage.set(data.settings);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

/**
 * Clear all data
 */
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};
