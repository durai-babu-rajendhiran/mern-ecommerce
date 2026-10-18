import React from "react";
import { Link } from "react-router-dom";
import Jumbotron from "../components/cards/Jumbotron";
import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Showcase Section */}
      <div className="container">
        <div className="hero-crimson my-4">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="hero-badge">
                <i className="fas fa-sparkles"></i> AI-Powered E-Commerce Store
              </span>
              <h1 className="hero-title mb-3">
                Experience the Future of Shopping
              </h1>
              <div className="h3 mb-4" style={{ minHeight: '44px' }}>
                <span className="text-light me-2">Explore:</span>
                <Jumbotron
                  text={[
                    "Apple M3 Max MacBooks",
                    "Samsung Galaxy S24 Ultra",
                    "ASUS ROG Gaming Laptops",
                    "Premium Noise-Cancelling Audio",
                    "24/7 AI Shopping Concierge",
                  ]}
                />
              </div>
              <p className="lead mb-4" style={{ opacity: 0.9, fontSize: '16px' }}>
                Browse our curated collection of elite tech, flagship smartphones, and audio gear.
                Chat with our real-time AI Agent for instant tailored recommendations.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/shop" className="btn btn-crimson btn-lg px-4 py-3">
                  <i className="fas fa-shopping-bag me-2"></i> Shop Products
                </Link>
                <Link to="/ai-assistant" className="btn btn-outline-light btn-lg px-4 py-3 rounded-3 fw-semibold">
                  <i className="fas fa-robot me-2 text-crimson"></i> Chat with AI Agent
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '28px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
                  alt="Flagship Tech"
                  className="img-fluid rounded-4 shadow-lg mb-3"
                  style={{ maxHeight: '240px', objectFit: 'cover', width: '100%' }}
                />
                <div className="d-flex justify-content-between align-items-center text-start">
                  <div>
                    <div className="fw-bold fs-5 text-white">MacBook Pro 16 M3 Max</div>
                    <div className="text-crimson fw-bold fs-6">$2,499.00</div>
                  </div>
                  <Link to="/shop" className="btn btn-sm btn-crimson px-3 py-2">
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Strip */}
        <div className="row g-3 my-4">
          <div className="col-6 col-md-3">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <i className="fas fa-truck-fast"></i>
              </div>
              <div>
                <div className="fw-bold small">Fast Shipping</div>
                <div className="text-muted" style={{ fontSize: '12px' }}>On all orders</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <div className="fw-bold small">AI Agent Ready</div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Llama 3.2:1b support</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <i className="fas fa-shield-halved"></i>
              </div>
              <div>
                <div className="fw-bold small">Secure Payments</div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Encrypted checkout</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <i className="fas fa-rotate-left"></i>
              </div>
              <div>
                <div className="fw-bold small">30-Day Returns</div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Hassle-free refunds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="my-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Browse Categories</h4>
            <Link to="/shop" className="text-crimson fw-semibold text-decoration-none small">
              View All <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {[
              { name: 'Laptops', icon: 'fa-laptop' },
              { name: 'Smartphones', icon: 'fa-mobile-screen' },
              { name: 'Tablets', icon: 'fa-tablet-screen-button' },
              { name: 'Audio', icon: 'fa-headphones' },
              { name: 'Accessories', icon: 'fa-keyboard' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to="/shop"
                className="btn btn-outline-secondary px-3 py-2 rounded-pill d-flex align-items-center gap-2 text-decoration-none"
                style={{ fontSize: '13.5px' }}
              >
                <i className={`fas ${cat.icon} text-crimson`}></i>
                <span className="fw-semibold">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* New Arrivals Section */}
        <div className="my-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <span className="badge-crimson mb-2 d-inline-block">Just In</span>
              <h3 className="fw-bold mb-0">New Arrivals</h3>
            </div>
            <Link to="/shop" className="btn btn-outline-crimson btn-sm">
              View All <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>
          <NewArrivals />
        </div>

        {/* AI Promo Banner */}
        <div
          className="my-5 p-4 rounded-4"
          style={{
            background: 'linear-gradient(135deg, #FFF0F3 0%, #FFE4E8 100%)',
            border: '1.5px solid rgba(220, 20, 60, 0.25)',
          }}
        >
          <div className="row align-items-center">
            <div className="col-md-8">
              <span className="badge bg-crimson text-white px-3 py-1 rounded-pill mb-2">
                Need Help Choosing?
              </span>
              <h3 className="fw-bold text-dark mb-2">Ask our AI Shopping Assistant</h3>
              <p className="text-muted mb-3">
                Not sure which laptop fits your budget or which flagship phone has the best camera?
                Our LangChain + Llama 3.2:1b agent searches our live inventory in seconds.
              </p>
              <Link to="/ai-assistant" className="btn btn-crimson">
                <i className="fas fa-robot me-2"></i> Launch AI Shopping Agent
              </Link>
            </div>
            <div className="col-md-4 text-center mt-3 mt-md-0">
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'var(--crimson-gradient)',
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  boxShadow: '0 8px 24px rgba(220, 20, 60, 0.4)',
                }}
              >
                <i className="fas fa-comments"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="my-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <span className="badge-crimson mb-2 d-inline-block">Top Rated</span>
              <h3 className="fw-bold mb-0">Best Sellers</h3>
            </div>
            <Link to="/shop" className="btn btn-outline-crimson btn-sm">
              View All <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>
          <BestSellers />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white pt-5 pb-4 mt-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h5 className="fw-bold text-crimson mb-3">
                <i className="fas fa-gem me-2"></i>DBStore
              </h5>
              <p className="text-muted small">
                Modern MERN Stack E-Commerce platform equipped with conversational AI shopping agents powered by LangChain and Ollama Llama 3.2:1b.
              </p>
            </div>
            <div className="col-6 col-lg-2">
              <h6 className="fw-bold mb-3">Shop</h6>
              <ul className="list-unstyled small text-muted">
                <li className="mb-2"><Link to="/shop" className="text-muted text-decoration-none">All Products</Link></li>
                <li className="mb-2"><Link to="/shop" className="text-muted text-decoration-none">Laptops</Link></li>
                <li className="mb-2"><Link to="/shop" className="text-muted text-decoration-none">Smartphones</Link></li>
                <li className="mb-2"><Link to="/shop" className="text-muted text-decoration-none">Audio & Gear</Link></li>
              </ul>
            </div>
            <div className="col-6 col-lg-2">
              <h6 className="fw-bold mb-3">AI Agent</h6>
              <ul className="list-unstyled small text-muted">
                <li className="mb-2"><Link to="/ai-assistant" className="text-muted text-decoration-none">AI Shopping Concierge</Link></li>
                <li className="mb-2"><Link to="/ai-assistant" className="text-muted text-decoration-none">Product Finder</Link></li>
                <li className="mb-2"><Link to="/ai-assistant" className="text-muted text-decoration-none">Price Range Tool</Link></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h6 className="fw-bold mb-3">Stay Updated</h6>
              <p className="text-muted small">Subscribe for early access to product launches and AI deals.</p>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Enter email..." />
                <button className="btn btn-crimson">Join</button>
              </div>
            </div>
          </div>
          <hr className="my-4 border-secondary" />
          <div className="text-center small text-muted">
            © {new Date().getFullYear()} DBStore Inc. All rights reserved. MERN + LangChain + Ollama.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;