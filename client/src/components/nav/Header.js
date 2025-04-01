import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Assuming you're importing your Firebase config
const { signOut } = require("firebase/auth");

const Header = () => {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let { user, cart } = useSelector((state) => ({ ...state }));
  const [current, setCurrent] = useState("home");

  const logout = () => {
    signOut(auth)
      .then(() => {
        dispatch({
          type: "LOGOUT",
          payload: null,
        });
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClick = (e) => {
    setCurrent(e.target.href);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            RDB
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item" key="home">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/"
                  onClick={handleClick}
                >
                  Home
                </a>
              </li>
              <li className="nav-item" key="shop">
                <a className="nav-link" href="/shop" onClick={handleClick}>
                  Shop
                </a>
              </li>

              <li className="nav-item" key="cart">
                <a className="nav-link" href="/cart" onClick={handleClick}>
                  Cart
                  {cart.length > 0 && (
                    <span className="badge bg-danger ms-2">{cart.length}</span>
                  )}
                </a>
              </li>

              {!user && (
                <li className="nav-item" key="register">
                  <a className="nav-link" href="/register">
                    Register
                  </a>
                </li>
              )}

              {!user && (
                <li className="nav-item" key="login">
                  <a className="nav-link" href="/login">
                    Login
                  </a>
                </li>
              )}

              {user && (
                <li className="nav-item dropdown float-right">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.email && user.email.split('@')[0]}
                  </a>
                  <ul className="dropdown-menu">
                    {user.role === "subscriber" && (
                      <li>
                        <a className="dropdown-item" href="/user/history">
                          Dashboard
                        </a>
                      </li>
                    )}
                    {user.role === "admin" && (
                      <li>
                        <a className="dropdown-item" href="/admin/dashboard">
                          Admin Dashboard
                        </a>
                      </li>
                    )}
                    <li>
                      <a className="dropdown-item" onClick={logout} href="#">
                        LogOut
                      </a>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
