/**
 * Custom hook for Ollama backend health and status
 */

import { useState, useEffect, useCallback } from 'react';
import { checkHealth, listModels } from '../utils/api';

export const useOllama = () => {
  const [status, setStatus] = useState({
    isHealthy: false,
    isChecking: true,
    message: 'Checking connection...',
    availableModels: [],
  });

  const checkStatus = useCallback(async () => {
    try {
      setStatus((prev) => ({ ...prev, isChecking: true }));

      const healthData = await checkHealth();

      if (healthData.status === 'healthy') {
        setStatus({
          isHealthy: true,
          isChecking: false,
          message: 'Connected to Ollama',
          ollamaStatus: healthData.ollama_status,
          availableModels: healthData.available_models || [],
        });
      } else {
        setStatus({
          isHealthy: false,
          isChecking: false,
          message: healthData.message || 'Backend is degraded',
          error: healthData.error,
          availableModels: [],
        });
      }
    } catch (error) {
      setStatus({
        isHealthy: false,
        isChecking: false,
        message: 'Cannot connect to backend',
        error: error.message,
        availableModels: [],
      });
    }
  }, []);

  const fetchModels = useCallback(async () => {
    try {
      const models = await listModels();
      setStatus((prev) => ({
        ...prev,
        availableModels: models,
      }));
      return models;
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }, []);

  // Check on mount and periodically
  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [checkStatus]);

  return {
    ...status,
    refresh: checkStatus,
    fetchModels,
  };
};

export default useOllama;
