import React,{useState} from "react";
import { BASEURL } from "../../utils/ApiRoute"
import { Link } from "react-router-dom";
import { showAverage } from "../../screens/product/Function";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";

const ProductCard = ({ product }) => {
  const [tooltip, setTooltip] = useState("Click to add");

  // redux
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      // if cart is in local storage GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      // save to local storage
      // console.log('unique', unique)
      localStorage.setItem("cart", JSON.stringify(unique));
      // show tooltip
      setTooltip("Added");

      // add to reeux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
      // show cart items in side drawer
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

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
          <button 
          disabled={product.quantity < 1}
          className="btn btn-danger font-btn"   onClick={handleAddToCart}           >
            <i className="fas fa-cart-plus"></i> 
            {product.quantity < 1 ? "Out of stock" : "Add to Cart"}

          </button>
        </div>
      </div>
    </div>
  );

};
export default ProductCard;
