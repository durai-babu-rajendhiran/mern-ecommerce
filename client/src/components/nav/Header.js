import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, cart } = useSelector((state) => ({ ...state }));
  const [searchQuery, setSearchQuery] = useState('');

  const logout = () => {
    signOut(auth)
      .then(() => {
        dispatch({
          type: 'LOGOUT',
          payload: null,
        });
        navigate('/login');
      })
      .catch((error) => {
        // Fallback demo logout
        dispatch({
          type: 'LOGOUT',
          payload: null,
        });
        navigate('/login');
      });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch({
        type: 'SEARCH_QUERY',
        payload: { text: searchQuery.trim() },
      });
      navigate(`/shop`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid px-lg-4">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand-crimson">
          <div className="logo-icon">
            <i className="fas fa-gem"></i>
          </div>
          <span>DB<span style={{ color: '#0F172A' }}>Store</span></span>
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars text-crimson fs-4"></i>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarMain">
          {/* Main Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}
              >
                <i className="fas fa-home me-1"></i> Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/shop"
                className={`nav-link-custom ${location.pathname === '/shop' ? 'active' : ''}`}
              >
                <i className="fas fa-store me-1"></i> Shop
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/ai-assistant"
                className="ai-nav-pill"
              >
                <i className="fas fa-sparkles"></i> AI Assistant
              </Link>
            </li>
          </ul>

          {/* Quick Header Search Bar */}
          <form onSubmit={handleSearchSubmit} className="d-flex my-2 my-lg-0 me-lg-3 flex-grow-1" style={{ maxWidth: '380px' }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control rounded-pill-start ps-3"
                placeholder="Search products, brands, tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '13.5px', border: '1.5px solid #E2E8F0', borderRight: 'none' }}
              />
              <button
                type="submit"
                className="btn btn-outline-secondary rounded-pill-end pe-3"
                style={{ border: '1.5px solid #E2E8F0', borderLeft: 'none', background: '#ffffff', color: '#DC143C' }}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          {/* Right Action Icons & User Menu */}
          <ul className="navbar-nav align-items-lg-center gap-2">
            {/* Cart Link */}
            <li className="nav-item">
              <Link to="/cart" className="btn btn-outline-crimson position-relative">
                <i className="fas fa-shopping-bag me-1"></i> Cart
                {cart && cart.length > 0 && (
                  <span className="badge bg-danger rounded-pill ms-2">
                    {cart.length}
                  </span>
                )}
              </Link>
            </li>

            {/* Auth Links */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link to="/login" className="btn btn-sm btn-outline-secondary px-3 py-2 fw-semibold">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-sm btn-crimson px-3 py-2">
                    Register
                  </Link>
                </li>
              </>
            )}

            {user && (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-outline-dark dropdown-toggle d-flex align-items-center gap-2 py-1 px-3 rounded-pill"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--crimson-gradient)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}
                  >
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                  <span className="small fw-semibold">
                    {user.email ? user.email.split('@')[0] : 'Account'}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-2">
                  <li>
                    <h6 className="dropdown-header text-muted small">{user.email}</h6>
                  </li>
                  {user.role === 'subscriber' && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/user/history">
                          <i className="fas fa-box-open me-2 text-crimson"></i> My Orders
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/user/wishlist">
                          <i className="fas fa-heart me-2 text-crimson"></i> Wishlist
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/user/password">
                          <i className="fas fa-key me-2 text-crimson"></i> Password
                        </Link>
                      </li>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/admin/dashboard">
                          <i className="fas fa-chart-line me-2 text-crimson"></i> Admin Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/products">
                          <i className="fas fa-boxes me-2 text-crimson"></i> Manage Products
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/category">
                          <i className="fas fa-tags me-2 text-crimson"></i> Categories
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger fw-semibold" onClick={logout}>
                      <i className="fas fa-sign-out-alt me-2"></i> Log Out
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
