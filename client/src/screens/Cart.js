import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import { userCart } from "../utils/ApiRoute";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const saveOrderToDb = () => {
    if (!user || !user.token) {
      toast.info("Please login to proceed to checkout");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    userCart(cart, user.token)
      .then((res) => {
        navigate("/checkout");
      })
      .catch((err) => {
        console.error("cart save err", err);
        navigate("/checkout");
      });
  };

  const saveCashOrderToDb = () => {
    if (!user || !user.token) {
      toast.info("Please login to proceed to checkout");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    dispatch({
      type: "COD",
      payload: true,
    });

    userCart(cart, user.token)
      .then((res) => {
        navigate("/checkout");
      })
      .catch((err) => {
        console.error("cart save err", err);
        navigate("/checkout");
      });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">
          <i className="fas fa-shopping-bag text-crimson me-2"></i>Shopping Cart
        </h3>
        <span className="badge-crimson">
          {cart.length} {cart.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="row g-4">
        {/* Cart Items Table */}
        <div className="col-12 col-lg-8">
          {!cart.length ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
              <i className="fas fa-cart-arrow-down text-muted fs-1 mb-3"></i>
              <h5>Your shopping cart is empty</h5>
              <p className="text-muted small">Browse our store or ask the AI Shopping Assistant for ideas!</p>
              <div className="d-flex justify-content-center gap-2 mt-2">
                <Link to="/shop" className="btn btn-crimson btn-sm">
                  Explore Products
                </Link>
                <Link to="/ai-assistant" className="btn btn-outline-crimson btn-sm">
                  Ask AI Assistant
                </Link>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden p-3">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">Title</th>
                      <th scope="col">Price</th>
                      <th scope="col">Brand</th>
                      <th scope="col">Color</th>
                      <th scope="col" className="text-center">Qty</th>
                      <th scope="col" className="text-center">Shipping</th>
                      <th scope="col" className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((p) => (
                      <ProductCardInCheckout key={p._id} p={p} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Box */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: "160px", overflowY: "auto" }}>
              {cart.map((c, i) => (
                <div key={i} className="d-flex justify-content-between small">
                  <span className="text-truncate me-2">
                    {c.title} <span className="text-muted">x{c.count}</span>
                  </span>
                  <span className="fw-semibold">${c.price * c.count}</span>
                </div>
              ))}
            </div>

            <hr />
            <div className="d-flex justify-content-between align-items-baseline mb-4">
              <span className="text-muted">Subtotal</span>
              <span className="fs-4 fw-bold text-crimson">${getTotal()}</span>
            </div>

            <div className="d-flex flex-column gap-2">
              <button
                onClick={saveOrderToDb}
                className="btn btn-crimson btn-lg py-3"
                disabled={!cart.length}
              >
                <i className="fas fa-credit-card me-2"></i> Checkout with Card
              </button>

              <button
                onClick={saveCashOrderToDb}
                className="btn btn-outline-crimson py-2"
                disabled={!cart.length}
              >
                <i className="fas fa-money-bill-wave me-2"></i> Cash on Delivery (COD)
              </button>

              <Link to="/shop" className="btn btn-link text-muted small text-decoration-none mt-2 text-center">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
