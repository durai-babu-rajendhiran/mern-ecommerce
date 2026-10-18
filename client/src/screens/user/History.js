import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import { getUserOrders } from "../../utils/ApiRoute";
import { useSelector } from "react-redux";
import ShowPaymentInfo from "../../components/cards/ShowPaymentInfo";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) {
      loadUserOrders();
    }
  }, [user]);

  const loadUserOrders = () => {
    setLoading(true);
    getUserOrders(user.token)
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setOrders(list);
      })
      .catch((err) => console.error("Error loading user orders:", err))
      .finally(() => setLoading(false));
  };

  const showOrderInTable = (order) => (
    <div className="table-responsive">
      <table className="table table-hover table-bordered mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Price</th>
            <th scope="col">Brand</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
            <th scope="col">Shipping</th>
          </tr>
        </thead>
        <tbody>
          {order.products &&
            order.products.map((p, i) => (
              <tr key={i}>
                <td>
                  <b>{p?.product?.title || "Item"}</b>
                </td>
                <td className="text-crimson fw-bold">${p?.product?.price || 0}</td>
                <td>{p?.product?.brand || "Brand"}</td>
                <td>{p?.color || "N/A"}</td>
                <td>{p?.count || 1}</td>
                <td>
                  {p?.product?.shipping === "Yes" ? (
                    <span className="badge bg-success-subtle text-success">
                      <i className="fas fa-check-circle me-1"></i> Express
                    </span>
                  ) : (
                    <span className="badge bg-secondary-subtle text-muted">
                      Standard
                    </span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-12 col-md-3 col-lg-2">
          <UserNav />
        </div>

        <div className="col-12 col-md-9 col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">
              <i className="fas fa-box-open text-crimson me-2"></i>My Order History
            </h4>
            <span className="badge-crimson">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-crimson" role="status"></div>
              <div className="mt-2 text-muted small">Loading order history...</div>
            </div>
          ) : orders.length > 0 ? (
            <div className="d-flex flex-column gap-4">
              {orders.map((order, i) => (
                <div key={i} className="card border-0 shadow-sm rounded-4 p-4">
                  <ShowPaymentInfo order={order} />
                  <div className="mt-3">
                    {showOrderInTable(order)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
              <i className="fas fa-receipt text-muted fs-1 mb-3"></i>
              <h5>No purchase orders yet</h5>
              <p className="text-muted small">Once you checkout, your orders and invoice status will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
