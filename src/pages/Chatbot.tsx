import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { apiService } from '../services/apiService';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Loader } from '../components/ui/Loader';

// Error message type for displaying errors with retry option
interface ErrorState {
  message: string;
  canRetry: boolean;
  lastMessage?: string;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent, retryMessage?: string) => {
    e.preventDefault();
    const messageToSend = retryMessage || input.trim();
    if (!messageToSend || isLoading) return;

    // Clear any previous error
    setError(null);

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toISOString(),
    };

    // Only add user message if it's not a retry (retry already has the message in history)
    if (!retryMessage) {
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
    }
    
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage(messageToSend);
      setMessages((prev) => [...prev, response.data]);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      
      // Determine if the error is retryable
      const isNetworkError = errorMessage.includes('connect') || errorMessage.includes('network');
      const isRateLimitError = errorMessage.includes('Too many requests');
      const isAuthError = errorMessage.includes('Authentication') || errorMessage.includes('Session expired');
      
      setError({
        message: errorMessage,
        canRetry: isNetworkError || isRateLimitError,
        lastMessage: messageToSend,
      });

      // Add error message to chat for non-auth errors
      if (!isAuthError) {
        const errorChatMessage: ChatMessage = {
          id: `msg_error_${Date.now()}`,
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorChatMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (e: React.FormEvent) => {
    if (error?.lastMessage) {
      handleSend(e, error.lastMessage);
    }
  };

  // Show authentication warning if not logged in
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-olive-dark dark:text-dark-text">AI Chatbot</h1>
          <p className="text-text-light dark:text-dark-text-muted mt-2">
            Ask questions about DSA concepts and get AI-powered answers
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-olive dark:text-dark-accent" />
              <h2 className="text-xl font-semibold text-olive-dark dark:text-dark-text mb-2">
                Authentication Required
              </h2>
              <p className="text-text-muted dark:text-dark-text-muted">
                Please log in to use the AI chatbot.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-olive-dark dark:text-dark-text">AI Chatbot</h1>
        <p className="text-text-light dark:text-dark-text-muted mt-2">
          Ask questions about DSA concepts and get AI-powered answers
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-text-muted dark:text-dark-text-muted">
                <div className="text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-olive-light dark:text-dark-text-muted" />
                  <p>Start a conversation by asking a question</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-olive-light dark:bg-dark-surface-hover flex items-center justify-center">
                      <Bot className="h-5 w-5 text-olive-dark dark:text-dark-accent" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-olive dark:bg-dark-accent text-white dark:text-dark-bg'
                        : 'bg-olive-light/30 dark:bg-dark-surface text-olive-dark dark:text-dark-text'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-olive-light dark:bg-dark-surface-hover flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-olive-dark dark:text-dark-text" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-olive-light dark:bg-dark-surface-hover flex items-center justify-center">
                  <Bot className="h-5 w-5 text-olive-dark dark:text-dark-accent" />
                </div>
                <div className="bg-olive-light/30 dark:bg-dark-surface rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader size="sm" />
                    <span className="text-sm text-olive-dark dark:text-dark-text">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* Retry button for retryable errors */}
            {error?.canRetry && !isLoading && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Retry</span>
                </Button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border dark:border-dark-border p-4">
            <form onSubmit={handleSend} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about DSA..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};







