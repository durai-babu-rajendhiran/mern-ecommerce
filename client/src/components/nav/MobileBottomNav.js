import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MobileBottomNav = () => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  const location = useLocation();

  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
        <i className="fas fa-home"></i>
        <span>Home</span>
      </NavLink>

      <NavLink to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>
        <i className="fas fa-store"></i>
        <span>Shop</span>
      </NavLink>

      <NavLink
        to="/ai-assistant"
        className={location.pathname === '/ai-assistant' ? 'active' : ''}
        style={{
          marginTop: '-18px',
          background: 'var(--crimson-gradient)',
          color: '#ffffff',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          boxShadow: '0 4px 15px rgba(220, 20, 60, 0.4)',
        }}
      >
        <i className="fas fa-robot" style={{ fontSize: '18px' }}></i>
        <span style={{ fontSize: '9px', fontWeight: '700' }}>AI CHAT</span>
      </NavLink>

      <NavLink to="/cart" className={location.pathname === '/cart' ? 'active' : ''} style={{ position: 'relative' }}>
        <i className="fas fa-shopping-bag"></i>
        {cart?.length > 0 && (
          <span
            className="badge rounded-pill bg-danger"
            style={{
              position: 'absolute',
              top: '2px',
              right: '20px',
              fontSize: '10px',
              padding: '2px 5px',
            }}
          >
            {cart.length}
          </span>
        )}
        <span>Cart</span>
      </NavLink>

      {user ? (
        <NavLink
          to={user.role === 'admin' ? '/admin/dashboard' : '/user/history'}
          className={location.pathname.startsWith('/user') || location.pathname.startsWith('/admin') ? 'active' : ''}
        >
          <i className="fas fa-user-circle"></i>
          <span>Account</span>
        </NavLink>
      ) : (
        <NavLink to="/login" className={location.pathname === '/login' ? 'active' : ''}>
          <i className="fas fa-sign-in-alt"></i>
          <span>Login</span>
        </NavLink>
      )}
    </nav>
  );
};

export default MobileBottomNav;
