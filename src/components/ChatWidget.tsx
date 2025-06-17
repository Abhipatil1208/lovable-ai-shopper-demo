
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';
import { useShopping } from '../contexts/ShoppingContext';
import { AIShoppingAssistant } from '../utils/aiAssistant';
import { ChatMessage } from '../contexts/ShoppingContext';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { state, dispatch } = useShopping();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiAssistant = new AIShoppingAssistant(state.products);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    setMessage('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const result = aiAssistant.processQuery(message.trim());
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: result.message,
        sender: 'assistant',
        timestamp: new Date(),
        products: result.products.length > 0 ? result.products.slice(0, 3) : undefined,
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: assistantMessage });
      dispatch({ type: 'FILTER_PRODUCTS', payload: result.products });
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const suggestedQueries = [
    "Show me party dresses under ₹1000",
    "I want minimal elegant styles",
    "Find me cozy winter sweaters",
    "Show professional work clothes"
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <div className="relative">
          <MessageCircle className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </button>

      {/* Chat Widget */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <div>
              <h3 className="font-medium">AI Shopping Assistant</h3>
              <p className="text-xs opacity-90">Ask me anything about our products!</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 h-[340px] space-y-3">
          {state.chatHistory.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-purple-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Hi! I'm your AI shopping assistant. Try asking me:</p>
              <div className="space-y-2">
                {suggestedQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(query)}
                    className="block w-full text-left p-2 text-sm bg-gray-50 hover:bg-purple-50 rounded border transition-colors"
                  >
                    "{query}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            state.chatHistory.map((msg) => (
              <div key={msg.id}>
                <div
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Product suggestions */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.products.slice(0, 2).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-2 p-2 bg-purple-50 rounded border"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-purple-600 font-medium">
                            ₹{product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about products..."
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
