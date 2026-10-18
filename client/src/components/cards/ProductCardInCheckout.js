import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { BASEURL } from "../../utils/ApiRoute";

const ProductCardInCheckout = ({ p }) => {
  const colors = ["Black", "Brown", "Silver", "White", "Blue"];
  const dispatch = useDispatch();

  const getImageSrc = () => {
    if (!p.images || !p.images.length) return "/assets/images/laptop.png";
    const img = p.images[0];
    if (typeof img === "string") {
      if (img.startsWith("http://") || img.startsWith("https://")) return img;
      return `${BASEURL}${img.startsWith("/") ? img.slice(1) : img}`;
    }
    if (img?.url) {
      if (img.url.startsWith("http")) return img.url;
      return `${BASEURL}${img.url}`;
    }
    return "/assets/images/laptop.png";
  };

  const handleColorChange = (e) => {
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.forEach((product, i) => {
        if (product._id === p._id) {
          cart[i].color = e.target.value;
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleQuantityChange = (e) => {
    let count = Number(e.target.value) < 1 ? 1 : Number(e.target.value);
    const maxQty = p.quantity || 100;

    if (count > maxQty) {
      toast.error(`Max available stock: ${maxQty}`);
      return;
    }

    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.forEach((product, i) => {
        if (product._id === p._id) {
          cart[i].count = count;
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleRemove = () => {
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      const updated = cart.filter((item) => item._id !== p._id);
      localStorage.setItem("cart", JSON.stringify(updated));
      dispatch({
        type: "ADD_TO_CART",
        payload: updated,
      });
      toast.info("Item removed from cart");
    }
  };

  return (
    <tr>
      <td>
        <div style={{ width: "70px", height: "70px" }}>
          <img
            src={getImageSrc()}
            alt={p.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
          />
        </div>
      </td>
      <td className="fw-semibold align-middle">{p.title}</td>
      <td className="align-middle fw-bold text-crimson">${p.price}</td>
      <td className="align-middle">{p.brand}</td>
      <td className="align-middle">
        <select
          onChange={handleColorChange}
          name="color"
          className="form-select form-select-sm"
          value={p.color || "Black"}
        >
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </td>
      <td className="align-middle text-center" style={{ width: "90px" }}>
        <input
          type="number"
          min="1"
          max={p.quantity || 99}
          className="form-control form-control-sm text-center"
          value={p.count}
          onChange={handleQuantityChange}
        />
      </td>
      <td className="align-middle text-center">
        {p.shipping === "Yes" ? (
          <span className="badge bg-success-subtle text-success">Express</span>
        ) : (
          <span className="badge bg-secondary-subtle text-muted">Standard</span>
        )}
      </td>
      <td className="align-middle text-center">
        <button
          onClick={handleRemove}
          className="btn btn-outline-danger btn-sm rounded-circle p-2"
          title="Remove Item"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  );
};

export default ProductCardInCheckout;
