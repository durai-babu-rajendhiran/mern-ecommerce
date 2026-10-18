import { Routes, Route } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import UserRoute from "./components/routes/UserRoute";
import AdminRoute from "./components/routes/AdminRoute";
import { getCurrentUser } from "./utils/ApiRoute";
import { onAuthStateChanged } from 'firebase/auth';
import 'react-loading-skeleton/dist/skeleton.css';

import Header from "./components/nav/Header";
import SideDrawer from "./components/drawer/SideDrawer";
import AiChatDrawer from "./components/ai/AiChatDrawer";
import MobileBottomNav from "./components/nav/MobileBottomNav";

const Home = React.lazy(() => import("./screens/Home"));
const Shop = React.lazy(() => import("./screens/Shop"));
const Cart = React.lazy(() => import("./screens/Cart"));
const Checkout = React.lazy(() => import("./screens/Checkout"));
const Product = React.lazy(() => import("./screens/product/Product"));
const Login = React.lazy(() => import("./screens/auth/Login"));
const Register = React.lazy(() => import("./screens/auth/Register"));
const RegisterComplete = React.lazy(() => import("./screens/auth/RegisterComplete"));
const ForgotPassword = React.lazy(() => import("./screens/auth/ForgotPassword"));
const History = React.lazy(() => import("./screens/user/History"));
const Password = React.lazy(() => import("./screens/user/Password"));
const Wishlist = React.lazy(() => import("./screens/user/Wishlist"));
const AdminDashboard = React.lazy(() => import("./screens/admin/AdminDashboard"));
const Category = React.lazy(() => import("./screens/admin/category/CategoryCreate"));
const Subcategory = React.lazy(() => import("./screens/admin/sub/SubCreate"));
const ProductCreate = React.lazy(() => import("./screens/admin/product/ProductCreate"));
const CreateCouponPage = React.lazy(() => import("./screens/admin/coupon/CreateCouponPage"));
const AiAssistantPage = React.lazy(() => import("./screens/ai/AiAssistantPage"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const res = await getCurrentUser(idTokenResult.token);
          const userItem = res?.data || res;
          if (userItem) {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: userItem.name || user.displayName || user.email.split('@')[0],
                email: userItem.email || user.email,
                token: idTokenResult.token,
                role: userItem.role || "subscriber",
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

  return (
    <Suspense
      fallback={
        <div className="d-flex flex-column align-items-center justify-content-center vh-100">
          <div className="spinner-border text-crimson" role="status"></div>
          <div className="mt-3 fw-bold text-crimson">DBStore</div>
        </div>
      }
    >
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <SideDrawer />
      <AiChatDrawer />
      <MobileBottomNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/ai-assistant" element={<AiAssistantPage />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/category/:slug" element={<Product />} />
        <Route path="/sub/:slug" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/complete" element={<RegisterComplete />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />

        {/* User Protected Routes */}
        <Route path="/checkout" element={<UserRoute Component={Checkout} />} />
        <Route path="/payment" element={<UserRoute Component={History} />} />
        <Route path="/user/history" element={<UserRoute Component={History} />} />
        <Route path="/user/password" element={<UserRoute Component={Password} />} />
        <Route path="/user/wishlist" element={<UserRoute Component={Wishlist} />} />

        {/* Admin Protected Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute Component={AdminDashboard} />} />
        <Route path="/admin/category" element={<AdminRoute Component={Category} />} />
        <Route path="/admin/sub" element={<AdminRoute Component={Subcategory} />} />
        <Route path="/admin/products" element={<AdminRoute Component={ProductCreate} />} />
        <Route path="/admin/coupon" element={<AdminRoute Component={CreateCouponPage} />} />
      </Routes>
    </Suspense>
  );
}

export default App;
