/**
 * Custom hook for chat functionality with context and memory
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { sendMessage, streamMessage } from '../utils/api';
import { chatsStorage, contextsStorage, settingsStorage } from '../utils/storage';
import toast from 'react-hot-toast';

export const useChat = (characterId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Load messages from storage on mount
  useEffect(() => {
    if (characterId) {
      const savedMessages = chatsStorage.getForCharacter(characterId);
      setMessages(savedMessages);
    }
  }, [characterId]);

  /**
   * Send a message and get response
   */
  const send = useCallback(
    async (content, options = {}) => {
      if (!content.trim() || isLoading) return;

      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage = {
        role: 'user',
        content: content.trim(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      chatsStorage.addMessage(characterId, userMessage);

      // Get context and settings
      const context = contextsStorage.getForCharacter(characterId);
      const settings = settingsStorage.get();

      // Prepare conversation history (last 20 messages)
      const conversationHistory = newMessages.slice(-20).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      try {
        if (settings.streamingEnabled && !options.noStreaming) {
          // Use streaming
          setIsStreaming(true);
          let assistantMessage = {
            role: 'assistant',
            content: '',
          };

          const updatedMessages = [...newMessages, assistantMessage];
          setMessages(updatedMessages);

          await streamMessage({
            message: content,
            characterId,
            systemPrompt: context.systemPrompt || options.systemPrompt,
            memory: context.memory,
            conversationHistory: conversationHistory.slice(0, -1), // Exclude current message
            model: options.model || settings.model,
            temperature: options.temperature ?? settings.temperature,
            maxTokens: options.maxTokens ?? settings.maxTokens,
            onToken: (token) => {
              assistantMessage.content += token;
              setMessages([...newMessages, { ...assistantMessage }]);
            },
            onComplete: () => {
              chatsStorage.addMessage(characterId, assistantMessage);
              setIsStreaming(false);
              setIsLoading(false);
            },
            onError: (err) => {
              console.error('Streaming error:', err);
              setError(err.message);
              toast.error(err.message || 'Failed to stream response');
              setIsStreaming(false);
              setIsLoading(false);
            },
          });
        } else {
          // Use regular request
          const response = await sendMessage({
            message: content,
            characterId,
            systemPrompt: context.systemPrompt || options.systemPrompt,
            memory: context.memory,
            conversationHistory: conversationHistory.slice(0, -1),
            model: options.model || settings.model,
            temperature: options.temperature ?? settings.temperature,
            maxTokens: options.maxTokens ?? settings.maxTokens,
          });

          const assistantMessage = {
            role: 'assistant',
            content: response.response,
            modelUsed: response.model_used,
          };

          const finalMessages = [...newMessages, assistantMessage];
          setMessages(finalMessages);
          chatsStorage.addMessage(characterId, assistantMessage);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Chat error:', err);
        setError(err.message);
        toast.error(err.message || 'Failed to get response');
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [characterId, messages, isLoading]
  );

  /**
   * Clear conversation
   */
  const clear = useCallback(() => {
    setMessages([]);
    chatsStorage.clearForCharacter(characterId);
    toast.success('Conversation cleared');
  }, [characterId]);

  /**
   * Regenerate last response
   */
  const regenerate = useCallback(async () => {
    if (messages.length < 2) return;

    // Find last user message
    const userMessages = messages.filter((m) => m.role === 'user');
    if (userMessages.length === 0) return;

    const lastUserMessage = userMessages[userMessages.length - 1];

    // Remove messages after last user message
    const indexOfLastUser = messages.lastIndexOf(lastUserMessage);
    const messagesBeforeRegenerate = messages.slice(0, indexOfLastUser);

    setMessages(messagesBeforeRegenerate);

    // Send again
    await send(lastUserMessage.content);
  }, [messages, send]);

  /**
   * Stop generation
   */
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setIsStreaming(false);
    toast('Generation stopped', { icon: '⏸️' });
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    send,
    clear,
    regenerate,
    stop,
  };
};

export default useChat;
