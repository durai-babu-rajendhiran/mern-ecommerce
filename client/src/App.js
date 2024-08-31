import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import UserRoute from "./components/routes/UserRoute";
import AdminRoute from "./components/routes/AdminRoute";
import {CURRENT_USER} from "./utils/ApiRoute";
import FetchData from "./utils/FetchApi"
import { onAuthStateChanged } from 'firebase/auth';
import 'react-loading-skeleton/dist/skeleton.css';
const Login = React.lazy(() => import("./screens/auth/Login"));
const Register = React.lazy(() => import("./screens/auth/Register"));
const ForgotPassword = React.lazy(() => import("./screens/auth/ForgotPassword"));
const Home = React.lazy(() => import("./screens/Home"));
const Header = React.lazy(() => import("./components/nav/Header"));
const RegisterComplete = React.lazy(() =>import("./screens/auth/RegisterComplete"));
const History = React.lazy(() => import("./screens/user/History")) ;
const Password = React.lazy(() => import("./screens/user/Password")) ;
const Wishlist = React.lazy(() => import("./screens/user/Wishlist")) ;
const AdminDashboard = React.lazy(() => import("./screens/admin/AdminDashboard")) ;
const Category = React.lazy(() => import("./screens/admin/category/CategoryCreate")) ;
const Subcategory = React.lazy(() => import("./screens/admin/sub/SubCreate"));
const ProductCreate = React.lazy(() => import("./screens/admin/product/ProductCreate"));
const Product = React.lazy(() => import("./screens/Product"));


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const res = await FetchData(CURRENT_USER, "POST", null, idTokenResult.token, false);
          if (res) {
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
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const routes = [
      { path:"/" , element:<Home />},
      { path:"/login" , element:<Login />},
      { path:"/register" , element:<Register />},
      { path:"/register/complete" , element:<RegisterComplete />},
      { path:"/forgot/password", element:ForgotPassword},
      { path:"/user/history", element:UserRoute(History)},
      { path:"/user/password", element:UserRoute(Password)},
      { path:"/user/wishlist", element:UserRoute(Wishlist)},
      { path:"/product/:slug", element:UserRoute(Product)},
      { path:"/admin/dashboard", element:AdminRoute(AdminDashboard)},
      { path:"/admin/category", element:AdminRoute(Category)},
      { path:"/admin/sub", element:AdminRoute(Subcategory)},
      { path:"/admin/products", element:AdminRoute(ProductCreate)},
     ]

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <ToastContainer />
      <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
      </Routes>
    </Suspense>
  );
}

export default App;
