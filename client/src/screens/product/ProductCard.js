import React from "react";
import { BASEURL } from "../../utils/ApiRoute"
import { Link } from "react-router-dom";
import { showAverage } from "./Function";

const ProductCard = ({ product }) => {
  const { images, title, description, slug } = product;
  return (
    <div className="card mb-4 shadow-sm" style={{ width: '18rem' }}>
      <img
        src={images && images.length ? BASEURL + images[0] : "/assets/images/laptop.png"}
        style={{ height: "200px", objectFit: "cover" }}
        className="card-img-top"
      />
      <div className="card-body pb-2">
        <div className="px-1 py-1">{title}</div>
        <div className="mb-1">
          {description && description.length > 40 ? `${description.substring(0, 40)}...` : description}
        </div>
      {product && product.ratings && product.ratings.length > 0 && (
          showAverage(product)
        )}
        <div className="d-flex justify-content-between">
          <Link to={`/product/${slug}`} className="btn btn-warning font-btn">
            <i className="fas fa-eye"></i> View Product
          </Link>
          <button className="btn btn-danger font-btn">
            <i className="fas fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

};
export default ProductCard;
