import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import UserRoute from "./components/routes/UserRoute";
import AdminRoute from "./components/routes/AdminRoute";
import {getCurrentUser} from "./utils/ApiRoute";
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
const Product = React.lazy(() => import("./screens/product/Product"));
const CategoryHome = React.lazy(() => import("./screens/category/CategoryHome"));
const SideDrawer = React.lazy(() => import("./components/drawer/SideDrawer"));
const Cart = React.lazy(() => import("./screens/Cart"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const res = await getCurrentUser(idTokenResult.token);
          const userItem = res.data
          if (res) {
            dispatch({
              type: "LOGGED_IN_USER",
               payload: {
                name: userItem.name,
                email: userItem.email,
                token: idTokenResult.token,
                role: userItem.role,
                _id: userItem._id,
              },
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const routes = [
      { path:"/" , element:<Home />},
      { path:"/login" , element:<Login />},
      { path:"/register" , element:<Register />},
      { path:"/forgot/password", element:<ForgotPassword/>},
      { path:"/register/complete" , element:<RegisterComplete />},
      { path:"/product/:slug", element:<Product/>},
      { path:"/category/:slug", element:<Product/>},
      { path:"/sub/:slug", element:<Product/>},
      { path:"/shop", element:<Product/>},
      { path:"/cart", element:<Cart />},
      { path:"/checkout", element:UserRoute(History)},
      { path:"/payment", element:UserRoute(History)},
      { path:"/user/history", element:UserRoute(History)},
      { path:"/user/password", element:UserRoute(Password)},
      { path:"/user/wishlist", element:UserRoute(Wishlist)},
      { path:"/admin/dashboard", element:AdminRoute(AdminDashboard)},
      { path:"/admin/category", element:AdminRoute(Category)},
      { path:"/admin/sub", element:AdminRoute(Subcategory)},
      { path:"/admin/products", element:AdminRoute(ProductCreate)},
      { path:"/admin/coupon", element:AdminRoute(ProductCreate)},
     ]

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <ToastContainer />
      <SideDrawer/>
      <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
      </Routes>
    </Suspense>
  );
}

export default App;
