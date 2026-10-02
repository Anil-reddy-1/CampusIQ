import { useState, useEffect, useRef } from 'react';
import { StudentLayout } from '../../components/layout';
import { Card, Button } from '../../components/ui';
import { Send, Sparkles, FileText, ExternalLink, Plus } from 'lucide-react';
import { chatApi } from '../../services/api';
import { toast } from 'react-toastify';
import type { ChatMessage, Citation } from '../../types';

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Load chat history
    loadHistory();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const loadHistory = async () => {
    try {
      const history = await chatApi.getHistory({ limit: 50 });
      setMessages(history.messages);
    } catch (error: any) {
      // Start with empty conversation
      console.error('Failed to load history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message optimistically
    const tempUserMessage: ChatMessage = {
      id: Date.now().toString(),
      conversationId: conversationId || 'temp',
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      setLoading(true);
      const response = await chatApi.sendMessage({
        message: userMessage,
        conversationId: conversationId || undefined,
      });

      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + '-assistant',
        conversationId: response.conversationId,
        role: 'assistant',
        content: response.response,
        citations: response.citations,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    'Explain process scheduling in Operating Systems',
    'Create a quiz on Database Normalization',
    'Generate a study plan for my upcoming exams',
    'What are my weak topics based on recent quizzes?',
  ];

  return (
    <StudentLayout showSearch={false}>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-headline-lg text-on-surface">AI Academic Chat</h1>
            <p className="text-body-sm text-on-surface-variant">
              Ask questions about your study materials, schedule, and more
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setMessages([]);
              setConversationId('');
              setInput('');
            }}
          >
            <Plus size={18} />
            New Chat
          </Button>
        </div>

        {/* Messages Container */}
        <Card className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={32} className="text-primary" />
                </div>
                <h2 className="font-headline-md text-on-surface mb-2">
                  Your AI Study Assistant
                </h2>
                <p className="text-body-md text-on-surface-variant mb-6">
                  Ask me anything about your uploaded materials, schedule, or academic topics
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(prompt)}
                      className="p-4 text-left rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer"
                    >
                      <p className="text-body-sm text-on-surface">{prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-4 rounded-2xl bg-surface-container-low">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-outline rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-outline rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-outline rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-outline-variant/20 p-4">
            <div className="flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question or describe what you need help with..."
                className="flex-1 resize-none min-h-[48px] max-h-[200px] px-4 py-3 bg-surface-container-low border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/15 text-sm"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                size="lg"
                className="h-12 w-12 p-0"
              >
                <Send size={20} />
              </Button>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </Card>
      </div>
    </StudentLayout>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-primary text-on-primary'
            : 'bg-primary-container/20 text-primary'
        }`}
      >
        {isUser ? (
          <span className="text-sm font-bold">U</span>
        ) : (
          <Sparkles size={16} />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`inline-block max-w-[85%] p-4 rounded-2xl ${
            isUser
              ? 'bg-primary text-on-primary rounded-tr-sm'
              : 'bg-surface-container-low text-on-surface rounded-tl-sm'
          }`}
        >
          <div className="prose prose-sm max-w-none">
            <MessageContent content={message.content} />
          </div>

          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-outline-variant/30 space-y-2">
              <p className="text-xs font-semibold text-on-surface-variant mb-2">
                Sources:
              </p>
              {message.citations.map((citation, index) => (
                <CitationChip key={index} citation={citation} />
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-on-surface-variant mt-1 px-2">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  // Simple markdown-like rendering
  const renderContent = () => {
    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);
    
    return parts.map((part, index) => {
      // Code block
      if (part.startsWith('```')) {
        const code = part.replace(/```[\w]*\n?/g, '').replace(/```$/g, '');
        return (
          <pre key={index} className="bg-surface-dim p-3 rounded-lg overflow-x-auto my-2">
            <code className="text-sm font-mono">{code}</code>
          </pre>
        );
      }
      // Inline code
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="bg-surface-dim px-1.5 py-0.5 rounded text-sm font-mono"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      // Regular text with line breaks
      return (
        <span key={index}>
          {part.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < part.split('\n').length - 1 && <br />}
            </span>
          ))}
        </span>
      );
    });
  };

  return <div>{renderContent()}</div>;
}

function CitationChip({ citation }: { citation: Citation }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-variant/50 hover:bg-surface-variant rounded-lg transition-colors text-left">
      <FileText size={14} className="text-primary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-on-surface truncate">
          {citation.documentTitle}
        </p>
        {citation.pageReference && (
          <p className="text-xs text-on-surface-variant">Page {citation.pageReference}</p>
        )}
      </div>
      <ExternalLink size={12} className="text-on-surface-variant flex-shrink-0" />
    </button>
  );
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
