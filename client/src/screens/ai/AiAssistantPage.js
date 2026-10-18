import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { sendAiMessage, getAiSuggestions, getAiHealth } from '../../utils/ApiRoute';
import _ from 'lodash';

const AiAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Welcome to the DB AI Shopping Concierge! I'm powered by local Llama 3.2:1b with LangChain tools directly connected to our live store database.\n\nAsk me anything: search for products, filter by price range, compare specs, or ask for gift recommendations!",
      products: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState('Checking AI engine...');
  const [suggestions, setSuggestions] = useState([
    { label: 'MacBook Pro & Air', query: 'Show me all Apple MacBook laptops in stock' },
    { label: 'Under $1200 Budget', query: 'What great laptops or phones can I buy under $1200?' },
    { label: 'Gaming Beasts', query: 'What gaming laptops do you have with RTX graphics?' },
    { label: 'Best Flagship Phones', query: 'Show me flagship phones from Apple and Samsung' },
    { label: 'Headphones & Audio', query: 'Do you have noise-cancelling headphones?' },
  ]);

  const dispatch = useDispatch();
  const chatEndRef = useRef(null);

  useEffect(() => {
    getAiHealth()
      .then((res) => {
        if (res?.success) setHealthStatus('Online • Llama 3.2:1b Connected');
        else setHealthStatus('Degraded • Database fallback active');
      })
      .catch(() => setHealthStatus('Local Agent Ready'));

    getAiSuggestions()
      .then((res) => {
        if (res?.suggestions) setSuggestions(res.suggestions);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
          text: res.reply || "Here's what I found for you in the store:",
          products: res.products || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(res?.error || 'Failed');
      }
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "I'm experiencing a brief pause connecting to Ollama. Please ensure Ollama is running, or browse directly in the Shop page!",
        products: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
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
        text: "Conversation cleared. How can I help you find what you need?",
        products: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="container py-4">
      {/* Hero Banner */}
      <div className="hero-crimson text-white mb-4">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="hero-badge">
              <i className="fas fa-sparkles"></i> AI Commerce Engine
            </span>
            <h1 className="hero-title mb-2">DB AI Shopping Assistant</h1>
            <p className="lead mb-3" style={{ opacity: 0.9 }}>
              Experience conversational product discovery powered by LangChain, LangGraph, and Ollama Llama 3.2:1b.
            </p>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                <i className="fas fa-check-circle text-success me-1"></i> {healthStatus}
              </span>
              <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                <i className="fas fa-database text-primary me-1"></i> Real-time MongoDB Inventory
              </span>
            </div>
          </div>
          <div className="col-lg-4 text-center mt-4 mt-lg-0">
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                border: '2px solid rgba(255,255,255,0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '54px',
                boxShadow: '0 0 35px rgba(220, 20, 60, 0.6)',
              }}
            >
              <i className="fas fa-robot"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="row">
        {/* Left Side: Quick Query Guides */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="fas fa-lightbulb text-warning"></i> Instant Prompt Starters
            </h5>
            <p className="text-muted small mb-3">
              Click any question below to test live LangChain tool execution against our database:
            </p>
            <div className="d-flex flex-column gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s.query)}
                  className="btn btn-outline-crimson text-start w-100 py-2 px-3 rounded-3"
                  style={{ fontSize: '13px' }}
                >
                  <i className="fas fa-comment-dots me-2 text-crimson"></i>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-3">
            <h6 className="fw-bold mb-2">
              <i className="fas fa-microchip text-crimson me-1"></i> Technical Architecture
            </h6>
            <ul className="small text-muted mb-0 ps-3">
              <li>Framework: <b>LangGraph createReactAgent</b></li>
              <li>LLM: <b>Ollama llama3.2:1b (Local)</b></li>
              <li>Tools: <b>search_products</b> & <b>search_by_price_range</b></li>
              <li>Database: <b>MongoDB Mongoose Lean Queries</b></li>
              <li>Cart Sync: <b>Redux Toolkit & LocalStorage</b></li>
            </ul>
          </div>
        </div>

        {/* Right Side: Chat Console */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ height: '620px', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div className="bg-crimson-gradient text-white p-3 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-terminal"></i>
                <span className="fw-bold">AI Assistant Console</span>
              </div>
              <button onClick={clearChat} className="btn btn-sm btn-outline-light rounded-pill px-3">
                <i className="fas fa-trash-alt me-1"></i> Clear
              </button>
            </div>

            {/* Chat Flow */}
            <div className="p-3 flex-grow-1 overflow-auto bg-light d-flex flex-column gap-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`ai-msg ${msg.sender} w-100`}>
                  {msg.sender === 'bot' && (
                    <div className="ai-avatar">
                      <i className="fas fa-robot"></i>
                    </div>
                  )}
                  <div style={{ maxWidth: '85%' }}>
                    <div className="ai-bubble">
                      <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

                      {/* Interactive Product Grid in Message */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="mt-3">
                          <div className="fw-bold small text-muted mb-2">
                            MATCHING PRODUCTS FOUND ({msg.products.length}):
                          </div>
                          <div className="row g-2">
                            {msg.products.map((p) => (
                              <div key={p._id || p.slug} className="col-md-6">
                                <div className="card h-100 border p-2 rounded-3 shadow-none">
                                  <div className="d-flex gap-2 align-items-center">
                                    <img
                                      src={Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.image || '/assets/images/laptop.png')}
                                      alt={p.title}
                                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                    <div className="flex-grow-1 min-width-0">
                                      <div className="fw-bold small text-truncate" title={p.title}>{p.title}</div>
                                      <div className="text-crimson fw-bold">${p.price}</div>
                                      <span className="badge bg-light text-muted border" style={{ fontSize: '10px' }}>{p.category}</span>
                                    </div>
                                  </div>
                                  <div className="d-flex gap-2 mt-2">
                                    <Link to={`/product/${p.slug}`} className="btn btn-outline-crimson btn-sm flex-fill py-1">
                                      View
                                    </Link>
                                    <button onClick={() => handleAddToCart(p)} className="btn btn-crimson btn-sm flex-fill py-1">
                                      + Add
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="small text-muted mt-1 px-1" style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

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
                    <span className="small text-muted ms-2">Running LangChain tool queries...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-top">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control rounded-pill-start ps-3"
                  placeholder="Ask a question (e.g. 'Show me laptops under $1500')..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={loading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={loading || !input.trim()}
                  className="btn btn-crimson rounded-pill-end px-4"
                >
                  <i className="fas fa-paper-plane me-1"></i> Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;
