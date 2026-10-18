import React, { useState } from 'react';
import { BASEURL } from '../../utils/ApiRoute';
import { Link } from 'react-router-dom';
import { showAverage } from '../../screens/product/Function';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

const ProductCard = ({ product }) => {
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

  const { images, title, description, slug, price, brand, quantity } = product || {};

  const getImageSrc = () => {
    if (!images || !images.length) return '/assets/images/laptop.png';
    const firstImg = images[0];
    if (typeof firstImg === 'string') {
      if (firstImg.startsWith('http://') || firstImg.startsWith('https://')) return firstImg;
      return `${BASEURL}${firstImg.startsWith('/') ? firstImg.slice(1) : firstImg}`;
    }
    if (firstImg?.url) {
      if (firstImg.url.startsWith('http')) return firstImg.url;
      return `${BASEURL}${firstImg.url}`;
    }
    return '/assets/images/laptop.png';
  };

  const handleAddToCart = () => {
    let cart = [];
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      cart.push({
        ...product,
        count: 1,
      });
      let unique = _.uniqWith(cart, _.isEqual);
      localStorage.setItem('cart', JSON.stringify(unique));

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);

      dispatch({
        type: 'ADD_TO_CART',
        payload: unique,
      });
      dispatch({
        type: 'SET_VISIBLE',
        payload: true,
      });
    }
  };

  return (
    <div className="product-card-modern h-100">
      {/* Image Container with Badges */}
      <div className="product-image-container">
        <img src={getImageSrc()} alt={title || 'Product'} loading="lazy" />
        {brand && <span className="product-badge-brand">{brand}</span>}
        <span
          className={`product-badge-stock ${
            quantity > 0 ? 'bg-success text-white' : 'bg-secondary text-white'
          }`}
        >
          {quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Info Body */}
      <div className="product-info">
        <Link to={`/product/${slug}`} className="product-title" title={title}>
          {title}
        </Link>

        <p className="product-description">
          {description || 'Discover cutting-edge performance with modern design and top reliability.'}
        </p>

        {product && product.ratings && product.ratings.length > 0 && (
          <div className="mb-2 small">
            {showAverage(product)}
          </div>
        )}

        {/* Price & Actions */}
        <div className="product-price-row">
          <div>
            <span className="text-muted small d-block">Price</span>
            <span className="product-price">${price}</span>
          </div>
        </div>

        <div className="product-actions mt-auto">
          <Link
            to={`/product/${slug}`}
            className="btn btn-outline-crimson flex-grow-1"
          >
            <i className="fas fa-eye me-1"></i> View
          </Link>
          <button
            disabled={quantity < 1}
            onClick={handleAddToCart}
            className="btn btn-crimson flex-grow-1"
          >
            <i className={`fas ${added ? 'fa-check' : 'fa-cart-plus'} me-1`}></i>
            {quantity < 1 ? 'Sold Out' : added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
