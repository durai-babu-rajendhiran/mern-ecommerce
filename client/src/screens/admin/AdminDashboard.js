import React, { useState, useEffect } from "react";
import AdminNav from "../../components/nav/AdminNav";
import { getOrders, changeStatus } from "../../utils/ApiRoute";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Orders from "../../components/order/Orders";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = () => {
    if (!user || !user.token) return;
    setLoading(true);
    getOrders(user.token)
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setOrders(list);
      })
      .catch((err) => console.error("Error loading admin orders:", err))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = (orderId, orderStatus) => {
    if (!user || !user.token) return;
    changeStatus(orderId, orderStatus, user.token).then((res) => {
      toast.success("Order status updated!");
      loadOrders();
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-12 col-md-3 col-lg-2">
          <AdminNav />
        </div>

        <div className="col-12 col-md-9 col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">
              <i className="fas fa-chart-line text-crimson me-2"></i>Admin Dashboard
            </h4>
            <span className="badge-crimson">
              {orders.length} Total Orders
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-crimson" role="status"></div>
              <div className="mt-2 text-muted small">Loading customer orders...</div>
            </div>
          ) : (
            <Orders orders={orders} handleStatusChange={handleStatusChange} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
