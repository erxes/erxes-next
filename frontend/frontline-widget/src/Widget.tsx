import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface ConversationStarter {
  id: string;
  text: string;
  icon: string;
}

export function Widget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const conversationStarters: ConversationStarter[] = [
    { id: '1', text: 'I need help with my account', icon: '👤' },
    { id: '2', text: 'I have a question about pricing', icon: '💰' },
    { id: '3', text: 'I want to schedule a demo', icon: '📅' },
    { id: '4', text: 'Technical support needed', icon: '🔧' },
  ];

  const botResponses = [
    "Thanks for reaching out! I'm here to help. What can I assist you with today?",
    'Great question! Let me connect you with the right person who can help.',
    "I'd be happy to help you with that. Can you tell me a bit more about what you're looking for?",
    'Thanks for your message! Our team typically responds within a few minutes during business hours.',
    "That's a great point! Let me get you the information you need.",
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when widget opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Initialize welcome message
  useEffect(() => {
    if (open && !hasInteracted && messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: 'welcome',
          text: "Hi there! I'm here to help. How can I assist you today?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }, 500);
    }
  }, [open, hasInteracted, messages.length]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || message.trim();
    if (!messageText) return;

    setHasInteracted(true);
    setShowWelcome(false);

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response with typing delay
    setTimeout(() => {
      setIsTyping(false);
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5s
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStarterClick = (starter: ConversationStarter) => {
    handleSendMessage(starter.text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (open) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Window */}
        <div className="w-80 h-[500px] flex flex-col bg-white rounded-xl shadow-2xl border-0 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                  ES
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Erxes Support</h3>
                <p className="text-xs text-blue-100">
                  We typically reply in a few minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-gray-50 overflow-hidden">
            <div
              ref={scrollAreaRef}
              className="h-full overflow-y-auto p-4 space-y-4"
            >
              {/* Welcome Message & Starters */}
              {showWelcome && messages.length <= 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    {conversationStarters.map((starter) => (
                      <button
                        key={starter.id}
                        onClick={() => handleStarterClick(starter)}
                        className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left text-sm conversation-starter"
                      >
                        <span className="text-lg">{starter.icon}</span>
                        <span className="text-gray-700">{starter.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1 message-bubble">
                  <div
                    className={`flex items-end gap-2 ${
                      msg.isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {!msg.isUser && (
                      <div className="w-8 h-8 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mb-1">
                        ES
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                        msg.isUser
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  <div
                    className={`text-xs text-gray-500 px-1 ${
                      msg.isUser ? 'text-right' : 'text-left ml-10'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mb-1">
                    ES
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce typing-dot"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce typing-dot"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce typing-dot"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
            <div className="flex gap-2 w-full">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pr-12 px-4 py-2 border border-gray-300 rounded-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!message.trim() || isTyping}
                  className="absolute right-1 top-1 h-6 w-6 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Powered by Erxes
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      <button
        onClick={() => setOpen(true)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-2xl border-0 transition-all duration-300 hover:scale-110 group flex items-center justify-center"
      >
        <svg
          className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Notification Badge */}
      {!hasInteracted && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse notification-badge">
          1
        </div>
      )}

      {/* Welcome Tooltip */}
      {!hasInteracted && !open && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 max-w-xs animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
              ES
            </div>
            <div>
              <p className="text-sm text-gray-800 font-medium">
                <span role="img" aria-label="waving hand">
                  👋
                </span>{' '}
                Need help?
              </p>
              <p className="text-xs text-gray-600 mt-1">
                We're here to assist you!
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200"></div>
        </div>
      )}
    </div>
  );
}
