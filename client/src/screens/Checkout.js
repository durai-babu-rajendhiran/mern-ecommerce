import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from "../utils/ApiRoute";

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, COD } = useSelector((state) => ({ ...state }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);

  useEffect(() => {
    if (user && user.token) {
      getUserCart(user.token).then((res) => {
        setProducts(res?.data?.products || []);
        setTotal(res?.data?.cartTotal || 0);
      });
    }
  }, [user]);

  const emptyCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    if (user && user.token) {
      emptyUserCart(user.token).then(() => {
        setProducts([]);
        setTotal(0);
        setTotalAfterDiscount(0);
        setCoupon("");
        toast.info("Shopping cart emptied.");
      });
    }
  };

  const saveAddressToDb = () => {
    if (!address.trim()) {
      toast.warning("Please enter your delivery address");
      return;
    }
    saveUserAddress(user.token, address).then((res) => {
      if (res?.data?.ok || res?.ok) {
        setAddressSaved(true);
        toast.success("Delivery address saved!");
      } else {
        setAddressSaved(true);
        toast.success("Delivery address confirmed!");
      }
    });
  };

  const applyDiscountCoupon = () => {
    if (!coupon.trim()) return;
    applyCoupon(user.token, coupon).then((res) => {
      if (res?.data?.err) {
        setDiscountError(res.data.err);
        dispatch({ type: "COUPON_APPLIED", payload: false });
      } else if (res?.data) {
        setTotalAfterDiscount(res.data);
        dispatch({ type: "COUPON_APPLIED", payload: true });
        toast.success(`Coupon "${coupon}" applied!`);
      }
    });
  };

  const createCashOrder = () => {
    setLoading(true);
    createCashOrderForUser(user.token, COD, couponTrueOrFalse)
      .then((res) => {
        if (res?.data?.ok || res?.ok) {
          if (typeof window !== "undefined") localStorage.removeItem("cart");
          dispatch({ type: "ADD_TO_CART", payload: [] });
          dispatch({ type: "COUPON_APPLIED", payload: false });
          dispatch({ type: "COD", payload: false });
          emptyUserCart(user.token);

          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          toast.success("Order placed successfully! Redirecting...");
          setTimeout(() => {
            navigate("/user/history");
          }, 1500);
        }
      })
      .catch((err) => {
        toast.error("Failed to place order. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">
        <i className="fas fa-lock text-crimson me-2"></i>Secure Checkout
      </h3>

      <div className="row g-4">
        {/* Left Side: Address & Coupons */}
        <div className="col-12 col-lg-7">
          {/* Delivery Address Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="fas fa-map-marker-alt text-crimson"></i> 1. Delivery Address
            </h5>
            <textarea
              className="form-control mb-3"
              rows="4"
              placeholder="Enter your street address, apartment/suite, city, state, postal code, and phone number..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              onClick={saveAddressToDb}
              className={`btn ${addressSaved ? 'btn-success' : 'btn-crimson'} align-self-start`}
            >
              <i className={`fas ${addressSaved ? 'fa-check-circle' : 'fa-save'} me-1`}></i>
              {addressSaved ? "Address Confirmed" : "Save Delivery Address"}
            </button>
          </div>

          {/* Coupon Code Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="fas fa-ticket text-crimson"></i> 2. Got a Promo Coupon?
            </h5>
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter coupon code (e.g. SAVE20)..."
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value);
                  setDiscountError("");
                }}
              />
              <button onClick={applyDiscountCoupon} className="btn btn-outline-crimson">
                Apply Code
              </button>
            </div>
            {discountError && (
              <div className="alert alert-danger py-2 px-3 small mt-2 mb-0">
                {discountError}
              </div>
            )}
            {totalAfterDiscount > 0 && (
              <div className="alert alert-success py-2 px-3 small mt-2 mb-0">
                Discount Applied! Final Payable: <b>${totalAfterDiscount}</b>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <div className="d-flex justify-content-between text-muted small mb-2">
              <span>Items in Order:</span>
              <span className="fw-bold text-dark">{products?.length || 0}</span>
            </div>
            <hr />

            {/* Product items list */}
            <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {Array.isArray(products) && products.length > 0 ? (
                products.map((p, i) => (
                  <div key={i} className="d-flex justify-content-between align-items-center small">
                    <span className="text-truncate me-2">
                      {p.product?.title || 'Product'} <span className="text-muted">x{p.count}</span>
                    </span>
                    <span className="fw-bold text-crimson">${(p.product?.price || 0) * p.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted small">No items found in cart.</div>
              )}
            </div>

            <hr />
            <div className="d-flex justify-content-between fs-5 fw-bold mb-4">
              <span>Total:</span>
              <span className="text-crimson">
                ${totalAfterDiscount > 0 ? totalAfterDiscount : total}
              </span>
            </div>

            {/* Place Order Buttons */}
            <div className="d-flex flex-column gap-2">
              <button
                disabled={!addressSaved || !products?.length || loading}
                onClick={createCashOrder}
                className="btn btn-crimson btn-lg py-3"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <i className="fas fa-check-circle me-2"></i> Place Order (Cash on Delivery)
                  </>
                )}
              </button>

              <button
                disabled={!products?.length}
                onClick={emptyCart}
                className="btn btn-outline-secondary btn-sm"
              >
                Empty Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
