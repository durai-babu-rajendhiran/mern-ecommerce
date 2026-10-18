import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { sendAiMessage, getAiSuggestions } from '../../utils/ApiRoute';
import _ from 'lodash';

const AiChatDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi! I'm your DB AI Shopping Assistant powered by Llama 3.2:1b. How can I help you find the perfect product today?",
      products: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    { label: 'MacBook Laptops', query: 'Show me all Apple MacBook laptops and prices' },
    { label: 'Laptops under $1500', query: 'What laptops do you have under $1500?' },
    { label: 'Gaming Powerhouses', query: 'Do you have any ASUS or Lenovo gaming laptops?' },
    { label: 'Top Smartphones', query: 'Show me flagship phones from Apple and Samsung' },
  ]);

  const dispatch = useDispatch();
  const chatEndRef = useRef(null);

  useEffect(() => {
    getAiSuggestions()
      .then((res) => {
        if (res?.suggestions) setSuggestions(res.suggestions);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (queryText) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendAiMessage(textToSend);
      if (res?.success) {
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: res.reply || "Here's what I found for you:",
          products: res.products || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(res?.error || 'Failed to get response');
      }
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "I'm having a brief issue reaching our local AI server. But feel free to browse our Shop or check your connection to Ollama!",
        products: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddToCart = (product) => {
    let currentCart = [];
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        currentCart = JSON.parse(localStorage.getItem('cart'));
      }
      currentCart.push({
        ...product,
        count: 1,
      });
      let unique = _.uniqWith(currentCart, _.isEqual);
      localStorage.setItem('cart', JSON.stringify(unique));

      dispatch({
        type: 'ADD_TO_CART',
        payload: unique,
      });
      dispatch({
        type: 'SET_VISIBLE',
        payload: true,
      });
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: "Chat cleared! How can I assist you today?",
        products: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ai-launcher-btn"
        aria-label="Open AI Shopping Assistant"
        title="DB AI Assistant"
      >
        <i className={isOpen ? 'fas fa-times' : 'fas fa-robot'}></i>
        <span className="ai-launcher-badge" title="AI Agent Online"></span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                <i className="fas fa-sparkles"></i>
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px', lineHeight: '1.2' }}>
                  DB AI Assistant
                </div>
                <div style={{ fontSize: '11px', opacity: 0.85 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '7px',
                      height: '7px',
                      backgroundColor: '#10B981',
                      borderRadius: '50%',
                      marginRight: '5px',
                    }}
                  ></span>
                  Llama 3.2:1b • Live Assistant
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={clearChat}
                className="btn btn-sm text-white"
                style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px' }}
                title="Clear Conversation"
              >
                <i className="fas fa-trash-alt me-1"></i> Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-sm text-white"
                style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '6px', padding: '3px 8px' }}
                title="Close Window"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="ai-chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-msg ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div className="ai-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                )}
                <div style={{ maxWidth: '100%' }}>
                  <div className="ai-bubble">
                    <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

                    {/* Interactive Product Cards inside Chat */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>
                          RECOMMENDED PRODUCTS ({msg.products.length}):
                        </div>
                        {msg.products.map((prod) => (
                          <div
                            key={prod._id || prod.slug}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #E2E8F0',
                              borderRadius: '10px',
                              padding: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                            }}
                          >
                            <img
                              src={
                                Array.isArray(prod.images) && prod.images.length > 0
                                  ? prod.images[0]
                                  : prod.image || '/assets/images/laptop.png'
                              }
                              alt={prod.title}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                flexShrink: 0,
                              }}
                            />
                            <div style={{ flexGrow: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  color: '#0F172A',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {prod.title || prod.name}
                              </div>
                              <div style={{ fontSize: '13px', fontWeight: '800', color: '#DC143C' }}>
                                ${prod.price}
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                              <Link
                                to={`/product/${prod.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="btn btn-outline-crimson"
                                style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '6px' }}
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleAddToCart(prod)}
                                className="btn btn-crimson"
                                style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '6px' }}
                              >
                                + Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#94A3B8',
                      marginTop: '3px',
                      textAlign: msg.sender === 'user' ? 'right' : 'left',
                    }}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="ai-msg bot">
                <div className="ai-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="ai-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '6px' }}>
                    Consulting store database...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div
            style={{
              padding: '8px 14px',
              background: '#F1F5F9',
              borderTop: '1px solid #E2E8F0',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              display: 'flex',
              gap: '6px',
            }}
          >
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s.query)}
                className="ai-suggestion-chip"
              >
                <i className="fas fa-bolt me-1" style={{ fontSize: '10px' }}></i>
                {s.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="ai-chat-input-bar">
            <input
              type="text"
              placeholder="Ask about products, prices, advice..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="ai-input"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="btn btn-crimson"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Send Message"
            >
              <i className="fas fa-paper-plane" style={{ fontSize: '14px' }}></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChatDrawer;
