import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { signInWithEmailLink, updatePassword, getIdTokenResult } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {CREATE_UPDATE_USER} from "../../functions/ApiRoute";
import FetchData from "../../functions/FetchApi"
const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user } = useSelector((state) => ({ ...state }));
  let dispatch = useDispatch();

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
    // console.log(window.location.href);
    // console.log(window.localStorage.getItem("emailForRegistration"));
  }, []);
  
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      // Sign in with email link
      const result = await signInWithEmailLink(auth, email, window.location.href);

      // Check if email is verified
      if (result.user.emailVerified) {
        window.localStorage.removeItem("emailForRegistration");

        const user = auth.currentUser;
        await updatePassword(user, password);

        // Get user id token
        const idTokenResult = await getIdTokenResult(user);
        console.log("user", user, "idTokenResult", idTokenResult);
        const res = await FetchData(CREATE_UPDATE_USER, "POST", null, idTokenResult.token, false);
       console.log(res)
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            name: res.data.name,
            email: res.data.email,
            token: idTokenResult.token,
            role: res.data.role,
            _id: res.data._id,
          },
        });
        // Redirect to homepage
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-action-code") {
        toast.error("The email verification link is invalid or expired. Please request a new link.");
      } else {
        toast.error(error.message);
      }
    }
  };

  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="my-3">
        <input type="email" className="form-control" value={email} disabled />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
        />
      </div>
      <br />
      <button type="submit" className="btn btn-primary w-100">
        Complete Registration
      </button>
    </form>
  );

  return (
    <div className="container p-5 card my-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register Complete</h4>
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
