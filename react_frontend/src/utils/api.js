/**
 * API utilities for Ollama backend communication
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for model generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

/**
 * Health check
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

/**
 * Send chat message with context and memory
 */
export const sendMessage = async ({
  message,
  characterId,
  systemPrompt,
  memory,
  conversationHistory = [],
  model = 'dolphin-mistral',
  temperature = 0.8,
  maxTokens = 512,
}) => {
  try {
    const response = await api.post('/chat', {
      message,
      character_id: characterId,
      system_prompt: systemPrompt,
      memory,
      conversation_history: conversationHistory,
      model,
      temperature,
      max_tokens: maxTokens,
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 503) {
      throw new Error('Ollama is not running. Start it with: ollama serve');
    }
    throw error;
  }
};

/**
 * Stream chat response (Server-Sent Events)
 */
export const streamMessage = async ({
  message,
  characterId,
  systemPrompt,
  memory,
  conversationHistory = [],
  model = 'dolphin-mistral',
  temperature = 0.8,
  maxTokens = 512,
  onToken,
  onComplete,
  onError,
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        character_id: characterId,
        system_prompt: systemPrompt,
        memory,
        conversation_history: conversationHistory,
        model,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete?.();
        break;
      }

      const text = decoder.decode(value);
      const lines = text.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.error) {
              onError?.(new Error(data.error));
              return;
            }

            if (data.token) {
              onToken?.(data.token);
            }

            if (data.done) {
              onComplete?.();
              return;
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    onError?.(error);
  }
};

/**
 * Get conversation context for a character
 */
export const getContext = async (characterId) => {
  try {
    const response = await api.get(`/context/${characterId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching context:', error);
    return null;
  }
};

/**
 * Clear conversation context for a character
 */
export const clearContext = async (characterId) => {
  try {
    const response = await api.delete(`/context/${characterId}`);
    return response.data;
  } catch (error) {
    console.error('Error clearing context:', error);
    throw error;
  }
};

/**
 * Save full context data
 */
export const saveContext = async (contextData) => {
  try {
    const response = await api.post('/context/save', contextData);
    return response.data;
  } catch (error) {
    console.error('Error saving context:', error);
    throw error;
  }
};

/**
 * List available Ollama models
 */
export const listModels = async () => {
  try {
    const response = await api.get('/models');
    return response.data.models || [];
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
};

export default api;
