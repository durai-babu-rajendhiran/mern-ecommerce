import React,{useState} from 'react'
// import firebase from "firebase";
import {auth} from "../../firebase"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const { signOut } = require("firebase/auth");

const Header = () => {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let { user } = useSelector((state) => ({ ...state }));
  const [current, setCurrent] = useState("home");


  const logout = () => {
    signOut(auth).then(() => {
      dispatch({
        type: "LOGOUT",
        payload: null,
      });
      navigate("/login");
    }).catch((error) => {
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
          <a className="navbar-brand" href="#">
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
              {!user && (
                <li className="nav-item" key="register">
                <a className="nav-link" href="/register">
                  Register
                </a>
              </li>
              )}
              {!user && (
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  Login
                </a>
              </li>)
              }
                {user && (
              <li className="nav-item dropdown float-right">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Profile
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Option 1
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Option 2
                    </a>
                  </li>
                  <li>
                    <a 
                    onClick={logout}
                    className="dropdown-item" href="#">
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
}

export default Header