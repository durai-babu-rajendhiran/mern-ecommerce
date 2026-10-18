import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, googleAuthProvider } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { createUser } from "../../utils/ApiRoute";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) {
      if (user.role === 'admin') navigate("/admin/dashboard");
      else navigate("/");
    }
  }, [user, navigate]);

  const handleQuickDemo = (role = 'subscriber') => {
    const isCustomer = role === 'subscriber';
    const demoPayload = {
      name: isCustomer ? "John Doe (Customer)" : "Admin User",
      email: isCustomer ? "customer@demo.com" : "admin@demo.com",
      token: isCustomer ? "demo_user_token_12345" : "demo_admin_token_67890",
      role: role,
      _id: isCustomer ? "68f34345ed25418b760773c3" : "68f34345ed25418b760773c2",
    };

    dispatch({
      type: "LOGGED_IN_USER",
      payload: demoPayload,
    });

    toast.success(`Logged in as ${isCustomer ? 'Customer' : 'Admin'}!`);
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/shop');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user: fbUser } = result;
      const idTokenResult = await fbUser.getIdTokenResult();
      const res = await createUser(idTokenResult.token);
      dispatch({
        type: "LOGGED_IN_USER",
        payload: {
          name: res?.name || fbUser.displayName || fbUser.email.split('@')[0],
          email: res?.email || fbUser.email,
          token: idTokenResult.token,
          role: res?.role || "subscriber",
          _id: res?._id,
        },
      });
      toast.success("Welcome back!");
      if (res?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const { user: fbUser } = result;
      const idTokenResult = await fbUser.getIdTokenResult();
      const res = await createUser(idTokenResult.token);
      dispatch({
        type: "LOGGED_IN_USER",
        payload: {
          name: res?.name || fbUser.displayName || fbUser.email.split('@')[0],
          email: res?.email || fbUser.email,
          token: idTokenResult.token,
          role: res?.role || "subscriber",
          _id: res?._id,
        },
      });
      toast.success("Signed in with Google!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'var(--crimson-gradient)',
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '12px',
                  boxShadow: '0 8px 20px rgba(220, 20, 60, 0.3)',
                }}
              >
                <i className="fas fa-lock"></i>
              </div>
              <h3 className="fw-bold mb-1">Welcome Back</h3>
              <p className="text-muted small">Sign in to your DBStore account</p>
            </div>

            {/* Quick Demo Login Banner */}
            <div className="p-3 mb-4 rounded-3" style={{ background: '#FFF0F3', border: '1px solid rgba(220, 20, 60, 0.2)' }}>
              <div className="d-flex align-items-center gap-2 mb-2 text-crimson fw-bold small">
                <i className="fas fa-bolt"></i> Instant 1-Click Demo Login:
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('subscriber')}
                  className="btn btn-crimson btn-sm flex-fill py-1"
                >
                  <i className="fas fa-user me-1"></i> Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="btn btn-outline-crimson btn-sm flex-fill py-1"
                >
                  <i className="fas fa-shield-alt me-1"></i> Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <label className="form-label small fw-semibold">Password</label>
                  <Link to="/forgot/password" className="small text-crimson text-decoration-none">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-crimson w-100 py-2 fw-semibold mb-3"
              >
                {loading ? "Signing in..." : "Sign In with Email"}
              </button>

              <button
                type="button"
                onClick={googleLogin}
                className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-2 small fw-semibold mb-3"
              >
                <i className="fab fa-google text-danger"></i> Sign In with Google
              </button>

              <div className="text-center small text-muted">
                Don't have an account?{" "}
                <Link to="/register" className="text-crimson fw-semibold text-decoration-none">
                  Register here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;