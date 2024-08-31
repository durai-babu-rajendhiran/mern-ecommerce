import React from "react";
import {BASEURL} from "../../utils/ApiRoute"
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    const { images, title, description, slug } = product;

    return (
        <div className="card mb-4 shadow-sm" style={{ width: '18rem' }}>
          <img
            src={images && images.length ? BASEURL+images[0] : "assets/images/laptop.png"}
            style={{ height: "150px", objectFit: "cover" }}
            className="card-img-top"
          />
          <div className="card-body">
            <div className="card-title">{title}</div>
            <div className="card-text mb-1">
              {description && description.length > 40 ? `${description.substring(0, 40)}...` : description}
            </div>
            <div className="d-flex justify-content-between">
              <Link to={`/product/${slug}`} className="btn btn-warning">
                <i className="fas fa-eye"></i> View Product
              </Link>
              <button className="btn btn-danger">
                <i className="fas fa-cart-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      );

  };
export default ProductCard;
