import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { sendPasswordResetEmail ,ActionCodeSettings } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate(); 
  useEffect(() => {
    if (user && user.token) navigate("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const actionCodeSettings = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT, // Redirect URL after password reset
      handleCodeInApp: true, // This must be set to true for the URL to be recognized
    };

    await sendPasswordResetEmail(auth,email,actionCodeSettings)
      .then(() => {
        setEmail("");
        setLoading(false);
        toast.success("Check your email for password reset link");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
        console.log("ERROR MSG IN FORGOT PASSWORD", error);
      });
  };

  return (
    <div className="container col-md-6 offset-md-3 p-5 border mx-auto my-4">
      {loading ? (
        <h4 className="text-danger">Loading</h4>
      ) : (
        <h4>Forgot Password</h4>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control m-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Type your email"
          autoFocus />
        <br />
        <button className="btn btn-primary w-100" disabled={!email}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
