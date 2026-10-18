import React, { useState, useMemo } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BASEURL, addToWishlist } from '../../utils/ApiRoute';
import ProductListItems from './ProductListItems';
import RatingModal from '../../components/modal/RatingModal';
import { showAverage } from './Function';
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const resolveImageSrc = (img) => {
  if (!img) return '/assets/images/laptop.png';
  if (typeof img === 'string') {
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `${BASEURL}${img.startsWith('/') ? img.slice(1) : img}`;
  }
  if (img.url) {
    if (img.url.startsWith('http')) return img.url;
    return `${BASEURL}${img.url}`;
  }
  return '/assets/images/laptop.png';
};

const ImageCarousel = ({ images }) => (
  <Carousel showArrows autoPlay infiniteLoop className="rounded-4 overflow-hidden shadow-sm">
    {images.map((image, index) => (
      <div key={index} style={{ maxHeight: '420px', background: '#F8FAFC' }}>
        <img
          src={resolveImageSrc(image)}
          alt={`Product view ${index}`}
          style={{ maxHeight: '420px', width: '100%', objectFit: 'contain' }}
        />
      </div>
    ))}
  </Carousel>
);

const NoImagePlaceholder = () => (
  <div className="card mb-3 border-0 bg-light rounded-4 overflow-hidden">
    <img
      src="/assets/images/laptop.png"
      className="card-img-top"
      alt="Placeholder"
      style={{ maxHeight: '350px', objectFit: 'contain' }}
    />
  </div>
);

const SingleProduct = ({ product = {}, loadSingleProduct }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  const [modalShow, setModalShow] = useState(false);
  const [added, setAdded] = useState(false);

  const averageRating = useMemo(() => {
    return product.ratings && product.ratings.length > 0 ? showAverage(product) : (
      <span className="text-muted small">No customer ratings yet</span>
    );
  }, [product]);

  if (!product || !product.title) {
    return <div className="text-center py-5">Loading product...</div>;
  }

  const { title, images, description, price, quantity, brand } = product;

  const handleAddToCart = () => {
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.push({ ...product, count: 1 });
      let unique = _.uniqWith(cart, _.isEqual);
      localStorage.setItem("cart", JSON.stringify(unique));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);

      dispatch({ type: "ADD_TO_CART", payload: unique });
      dispatch({ type: "SET_VISIBLE", payload: true });
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      toast.info("Please login to save this item to your wishlist");
      navigate("/login");
      return;
    }
    addToWishlist(product._id, user.token)
      .then((res) => {
        toast.success("Added to your wishlist!");
        navigate("/user/wishlist");
      })
      .catch((err) => {
        toast.error("Could not add to wishlist");
      });
  };

  const handleModal = () => {
    if (user && user.token) {
      setModalShow(true);
    } else {
      toast.info("Please login to submit a review");
      navigate("/login");
    }
  };

  return (
    <>
      {/* Product Image Carousel */}
      <div className="col-12 col-lg-7 mb-4">
        {images && images.length ? (
          <ImageCarousel images={images} />
        ) : (
          <NoImagePlaceholder />
        )}

        {/* Tab Links */}
        <div className="card border-0 shadow-sm rounded-4 mt-4 p-3">
          <ul className="nav nav-pills mb-3" id="productTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active bg-crimson"
                id="desc-tab"
                data-bs-toggle="pill"
                data-bs-target="#desc-content"
                type="button"
                role="tab"
              >
                Description
              </button>
            </li>
            <li className="nav-item ms-2" role="presentation">
              <button
                className="nav-link text-dark"
                id="shipping-tab"
                data-bs-toggle="pill"
                data-bs-target="#shipping-content"
                type="button"
                role="tab"
              >
                Shipping & Returns
              </button>
            </li>
          </ul>
          <div className="tab-content" id="productTabContent">
            <div className="tab-pane fade show active p-2" id="desc-content" role="tabpanel">
              <p className="text-secondary" style={{ lineHeight: '1.7' }}>
                {description}
              </p>
            </div>
            <div className="tab-pane fade p-2" id="shipping-content" role="tabpanel">
              <p className="text-secondary small mb-1">
                • <b>Fast Shipping:</b> Express delivery within 2-4 business days.
              </p>
              <p className="text-secondary small mb-1">
                • <b>Warranty:</b> 1-year official brand warranty and technical support.
              </p>
              <p className="text-secondary small">
                • <b>Hassle-Free Returns:</b> 30-day money-back guarantee if unopened.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info & Actions */}
      <div className="col-12 col-lg-5">
        <div className="card border-0 shadow-sm rounded-4 p-4">
          {brand && (
            <span className="badge-crimson align-self-start mb-2">
              {brand}
            </span>
          )}

          <h2 className="fw-bold text-dark mb-2">{title}</h2>

          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="fs-2 fw-bold text-crimson">${price}</div>
            <span
              className={`badge ${
                quantity > 0 ? 'bg-success' : 'bg-danger'
              } rounded-pill px-3 py-2`}
            >
              {quantity > 0 ? `In Stock (${quantity})` : 'Out of Stock'}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
            {averageRating}
            <button
              onClick={handleModal}
              className="btn btn-sm btn-outline-crimson ms-auto py-1 px-3"
            >
              ★ Leave Rating
            </button>
          </div>

          <ProductListItems product={product} />

          {/* Action Buttons */}
          <div className="d-flex flex-column gap-2 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={quantity < 1}
              className="btn btn-crimson btn-lg w-100 py-3"
            >
              <i className={`fas ${added ? 'fa-check' : 'fa-cart-shopping'} me-2`}></i>
              {quantity < 1 ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Shopping Cart'}
            </button>

            <button
              onClick={handleAddToWishlist}
              className="btn btn-outline-secondary w-100 py-2"
            >
              <i className="far fa-heart me-2 text-crimson"></i> Save to Wishlist
            </button>
          </div>

          {modalShow && (
            <RatingModal
              name={product._id}
              modalShow={modalShow}
              setModalShow={setModalShow}
              loadSingleProduct={loadSingleProduct}
              product={product}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
