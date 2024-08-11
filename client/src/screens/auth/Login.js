import React,{useState,useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { auth ,googleAuthProvider} from "../../firebase";
import { signInWithEmailAndPassword,signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {CREATE_UPDATE_USER} from "../../functions/ApiRoute";
import FetchData from "../../functions/FetchApi"
const Login = () => {
  const [email, setEmail] = useState("duraibabu200@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  let dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) navigate("/");
  }, [user]);

  const roleBasedRedirect = (res) => {
    if (res.data.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/history");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth,email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
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
      roleBasedRedirect(res);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    
      signInWithPopup(auth,googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        });
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit} >
      <div className="form-group">
        <input
          type="email" 
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          autoFocus
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </div>

      <br />
      <button
        onClick={handleSubmit}
        className="btn btn-primary mb-3"
        block
        shape="round"
        size="large"
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 border p-4">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}
          {loginForm()}

          <button
            onClick={googleLogin}
            className="btn btn-danger mb-3"
            shape="round"
            // icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </button>
           <br />
          <a href="/forgot/password" className="float-right text-danger">
            Forgot Password
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login