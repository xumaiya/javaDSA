import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  AlertCircle, 
  RefreshCw, 
  Trash2,
  MessageSquare,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage } from '../types';
import { apiService } from '../services/apiService';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';

const SUGGESTED_QUESTIONS = [
  "What is a binary search tree?",
  "Explain Big O notation",
  "How does quicksort work?",
  "What's the difference between stack and queue?",
];

const renderMessageContent = (content: string) => {
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('```')) {
      const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
      if (match) {
        const [, lang, code] = match;
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden bg-gray-900">
            {lang && (
              <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400 font-mono">{lang}</div>
            )}
            <pre className="p-4 overflow-x-auto text-sm">
              <code className="text-gray-100 font-mono whitespace-pre">{code.trim()}</code>
            </pre>
          </div>
        );
      }
    }
    
    const inlineCodeParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={index}>
        {inlineCodeParts.map((inlinePart, i) => {
          if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
            return (
              <code key={i} className="px-1.5 py-0.5 rounded bg-olive-light/50 dark:bg-dark-surface-hover text-olive-dark dark:text-dark-accent font-mono text-sm">
                {inlinePart.slice(1, -1)}
              </code>
            );
          }
          return inlinePart;
        })}
      </span>
    );
  });
};


const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} group`}>
      <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
        isUser ? 'bg-olive dark:bg-dark-accent' : 'bg-gradient-to-br from-olive-light to-olive dark:from-dark-surface-hover dark:to-dark-surface'
      }`}>
        {isUser ? (
          <UserIcon className="h-5 w-5 text-white dark:text-dark-bg" />
        ) : (
          <Bot className="h-5 w-5 text-white dark:text-dark-accent" />
        )}
      </div>

      <div className={`relative max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-olive dark:bg-dark-accent text-white dark:text-dark-bg rounded-tr-sm'
            : 'bg-white dark:bg-dark-surface text-olive-dark dark:text-dark-text rounded-tl-sm border border-olive-light/30 dark:border-dark-border'
        }`}>
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {isUser ? message.content : renderMessageContent(message.content)}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-text-muted dark:text-dark-text-muted">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-olive-light/30 dark:hover:bg-dark-surface-hover rounded"
              title="Copy message"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-text-muted dark:text-dark-text-muted" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ onSuggestionClick }: { onSuggestionClick: (q: string) => void }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-olive via-olive-dark to-olive dark:from-dark-accent dark:via-green-500 dark:to-dark-accent flex items-center justify-center mb-6 shadow-2xl animate-float-slow">
      <Sparkles className="h-12 w-12 text-white animate-pulse" />
    </div>
    <h3 className="text-2xl font-bold bg-gradient-to-r from-olive-dark to-olive dark:from-dark-text dark:to-dark-accent bg-clip-text text-transparent mb-2">
      DSA Learning Assistant
    </h3>
    <p className="text-text-muted dark:text-dark-text-muted mb-8 max-w-md">
      Ask me anything about Data Structures and Algorithms. I can explain concepts, help with code, and guide your learning journey.
    </p>
    
    <div className="w-full max-w-lg">
      <p className="text-sm text-text-muted dark:text-dark-text-muted mb-4 font-medium">Try asking:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUGGESTED_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(question)}
            className="text-left px-4 py-3 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-dark-surface/50 border border-olive-light/50 dark:border-dark-border hover:bg-white/80 dark:hover:bg-dark-surface/80 hover:border-olive dark:hover:border-dark-accent hover:scale-105 hover:shadow-lg transition-all duration-300 text-sm text-olive-dark dark:text-dark-text group"
          >
            <MessageSquare className="h-4 w-4 inline-block mr-2 text-olive dark:text-dark-accent group-hover:scale-110 transition-transform" />
            {question}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const AuthRequired = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-4">
    <div className="w-16 h-16 rounded-full bg-olive-light/30 dark:bg-dark-surface flex items-center justify-center mb-4">
      <AlertCircle className="h-8 w-8 text-olive dark:text-dark-accent" />
    </div>
    <h3 className="text-xl font-semibold text-olive-dark dark:text-dark-text mb-2">Authentication Required</h3>
    <p className="text-text-muted dark:text-dark-text-muted max-w-sm">
      Please log in to use the AI chatbot and get personalized help with DSA concepts.
    </p>
  </div>
);


export const Chatbot = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isAuthenticated, user } = useAuthStore();
  const { messages, addMessage, clearMessages, isLoading, setLoading, getConversationHistory } = useChatStore();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSend = async (e?: React.FormEvent, suggestedMessage?: string) => {
    e?.preventDefault();
    const messageToSend = suggestedMessage || input.trim();
    if (!messageToSend || isLoading) return;

    setError(null);

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const history = getConversationHistory();
      const response = await apiService.sendChatMessage(messageToSend, history);
      addMessage(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
      
      const errorChatMessage: ChatMessage = {
        id: `msg_error_${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date().toISOString(),
      };
      addMessage(errorChatMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      clearMessages();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-[calc(100vh-12rem)] flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-olive-dark dark:text-dark-text">AI Chatbot</h1>
          <p className="text-text-muted dark:text-dark-text-muted mt-1">Your personal DSA learning assistant</p>
        </div>
        <div className="flex-1 bg-white dark:bg-dark-bg rounded-2xl shadow-sm border border-olive-light/30 dark:border-dark-border">
          <AuthRequired />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Header with Glass Morphism */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-dark-surface/50 border border-olive-light/30 dark:border-dark-border/50 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-olive-dark to-olive dark:from-dark-text dark:to-dark-accent bg-clip-text text-transparent">
            AI Chatbot
          </h1>
          <p className="text-text-muted dark:text-dark-text-muted text-sm mt-0.5">
            {user?.username ? `Hi ${user.username}! ` : ''}Ask me anything about DSA
          </p>
        </div>
        {messages.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearChat} 
            className="text-text-muted hover:text-red-500 dark:text-dark-text-muted dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 backdrop-blur-sm transition-all duration-300"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />Clear
          </Button>
        )}
      </div>

      {/* Chat Container with Enhanced Glass Morphism */}
      <div className="flex-1 flex flex-col backdrop-blur-2xl bg-gradient-to-br from-white/60 via-olive-pale/20 to-white/60 dark:from-dark-surface/60 dark:via-dark-bg/40 dark:to-dark-surface/60 rounded-3xl shadow-2xl border border-olive-light/30 dark:border-dark-border/50 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <EmptyState onSuggestionClick={(q) => handleSend(undefined, q)} />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-olive-light to-olive dark:from-dark-surface-hover dark:to-dark-surface flex items-center justify-center shadow-sm">
                    <Bot className="h-5 w-5 text-white dark:text-dark-accent" />
                  </div>
                  <div className="bg-white dark:bg-dark-surface rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-olive-light/30 dark:border-dark-border">
                    <div className="flex items-center gap-2">
                      <Loader size="sm" />
                      <span className="text-sm text-olive-dark dark:text-dark-text">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {error && !isLoading && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                      if (lastUserMsg) handleSend(undefined, lastUserMsg.content);
                    }}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />Retry
                  </Button>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area with Glass Morphism */}
        <div className="border-t border-olive-light/30 dark:border-dark-border/50 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 p-4">
          <form onSubmit={handleSend} className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about DSA... (Shift+Enter for new line)"
                className="w-full resize-none rounded-2xl border border-olive-light/50 dark:border-dark-border backdrop-blur-sm bg-white/70 dark:bg-dark-bg/70 px-4 py-3 text-olive-dark dark:text-dark-text placeholder-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-olive/50 dark:focus:ring-dark-accent/50 focus:border-olive dark:focus:border-dark-accent transition-all duration-300 min-h-[48px] max-h-[150px] shadow-sm"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 rounded-2xl bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 shadow-lg"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-xs text-text-muted dark:text-dark-text-muted mt-2 text-center">
            AI responses may not always be accurate. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};
