import React from "react";
import { Link } from "react-router-dom";


const SingleProduct = ({ product }) => {
  const { title, description, images, slug } = product;

  return (
    <>
      <div className="col-md-7">image carousel</div>
      <div className="col-md-5">
        <div className="card">
            <>
              <i class="fa-solid fa-cart-shopping"/> <br />
              Add to Cart
            </>,
            <Link to="/">
             <i class="fa-regular fa-heart"/><br /> Add to Wishlist
            </Link>,
       
            <div className="card-title">{title}</div>
            <div className="card-text mb-1">
              {description}
            </div>
          <p>
            price/category/subs/shipping/color/brand/quantity available/sold
          </p>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
