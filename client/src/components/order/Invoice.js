import React from "react";

const Invoice = ({ order }) => (
  <div className="container my-4">
    <div className="text-center mb-4">
      <h6 className="text-muted">~ {new Date().toLocaleString()} ~</h6>
      <h2 className="fw-bold">Order Invoice</h2>
      <p className="text-muted">React Redux Ecommerce</p>
      <h4 className="mt-4">Order Summary</h4>
    </div>

    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Brand</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item, index) => (
            <tr key={index}>
              <td>{item.product.title}</td>
              <td>${item.product.price}</td>
              <td>{item.count}</td>
              <td>{item.product.brand}</td>
              <td>{item.product.color}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-4">
      <p>
        <strong>Date:</strong> {new Date(order.paymentIntent.created * 1000).toLocaleString()}
      </p>
      <p>
        <strong>Order Id:</strong> {order.paymentIntent.id}
      </p>
      <p>
        <strong>Order Status:</strong> {order.orderStatus}
      </p>
      <p>
        <strong>Total Paid:</strong> ${order.paymentIntent.amount}
      </p>
    </div>

    <div className="text-center mt-5">
      <p className="text-muted">~ Thank you for shopping with us ~</p>
    </div>
  </div>
);

export default Invoice;
