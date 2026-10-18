import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import Star from "../components/forms/Star";
import { getProductByCount, fetchProductsByFilter, getCategories, getCreateSub } from "../utils/ApiRoute";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 5000]);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState("");
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState("");
  const [brands] = useState(["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"]);
  const [brand, setBrand] = useState("");
  const [colors] = useState(["Black", "Brown", "Silver", "White", "Blue"]);
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  useEffect(() => {
    loadAllProducts();
    getCategories().then((res) => {
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      setCategories(list);
    }).catch(() => {});

    getCreateSub().then((res) => {
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      setSubs(list);
    }).catch(() => {});
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductByCount(24)
      .then((p) => {
        const list = Array.isArray(p?.data) ? p.data : (Array.isArray(p) ? p : []);
        setProducts(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchProducts = (arg) => {
    setLoading(true);
    fetchProductsByFilter(arg)
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setProducts(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const delayed = setTimeout(() => {
      if (text) {
        fetchProducts({ query: text });
      } else {
        loadAllProducts();
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  const resetFilters = () => {
    dispatch({ type: "SEARCH_QUERY", payload: { text: "" } });
    setPrice([0, 5000]);
    setCategoryIds([]);
    setStar("");
    setSub("");
    setBrand("");
    setColor("");
    setShipping("");
    loadAllProducts();
  };

  const handlePriceChange = (e) => {
    const maxVal = Number(e.target.value);
    setPrice([0, maxVal]);
    dispatch({ type: "SEARCH_QUERY", payload: { text: "" } });
    fetchProducts({ price: [0, maxVal] });
  };

  const handleCategoryCheck = (e) => {
    dispatch({ type: "SEARCH_QUERY", payload: { text: "" } });
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked);
    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }
    setCategoryIds(inTheState);
    if (inTheState.length) {
      fetchProducts({ category: inTheState });
    } else {
      loadAllProducts();
    }
  };

  const handleStarClick = (num) => {
    setStar(num);
    dispatch({ type: "SEARCH_QUERY", payload: { text: "" } });
    fetchProducts({ stars: num });
  };

  const handleSubClick = (s) => {
    setSub(s._id);
    dispatch({ type: "SEARCH_QUERY", payload: { text: "" } });
    fetchProducts({ sub: s._id });
  };

  const handleBrandClick = (b) => {
    const nextBrand = brand === b ? "" : b;
    setBrand(nextBrand);
    dispatch({ type: "SEARCH_QUERY", payload: { text: "" } });
    if (nextBrand) {
      fetchProducts({ brand: nextBrand });
    } else {
      loadAllProducts();
    }
  };

  const handleColorClick = (c) => {
    const nextColor = color === c ? "" : c;
    setColor(nextColor);
    dispatch({ type: "SEARCH_QUERY", payload: { text: "" } });
    if (nextColor) {
      fetchProducts({ color: nextColor });
    } else {
      loadAllProducts();
    }
  };

  const handleShippingChange = (s) => {
    const nextShipping = shipping === s ? "" : s;
    setShipping(nextShipping);
    dispatch({ type: "SEARCH_QUERY", payload: { text: "" } });
    if (nextShipping) {
      fetchProducts({ shipping: nextShipping });
    } else {
      loadAllProducts();
    }
  };

  const filterContent = (
    <div className="filter-sidebar p-3 bg-white rounded-4 border">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">
          <i className="fas fa-filter text-crimson me-2"></i>Filters
        </h5>
        <button onClick={resetFilters} className="btn btn-sm btn-outline-secondary py-1 px-2" style={{ fontSize: '11px' }}>
          Reset All
        </button>
      </div>
      <hr />

      {/* Price Range Filter */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="fw-bold small mb-0">Price Ceiling</label>
          <span className="badge bg-crimson">${price[1]}</span>
        </div>
        <input
          type="range"
          min="100"
          max="5000"
          step="50"
          value={price[1]}
          onChange={handlePriceChange}
          className="form-range"
        />
        <div className="d-flex justify-content-between text-muted" style={{ fontSize: '11px' }}>
          <span>$100</span>
          <span>$5,000</span>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <label className="fw-bold small mb-2 d-block">Categories</label>
        <div className="d-flex flex-column gap-1" style={{ maxHeight: '180px', overflowY: 'auto' }}>
          {categories.map((c) => (
            <div key={c._id} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`cat-${c._id}`}
                value={c._id}
                checked={categoryIds.includes(c._id)}
                onChange={handleCategoryCheck}
              />
              <label className="form-check-label small" htmlFor={`cat-${c._id}`}>
                {c.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sub Categories */}
      {subs && subs.length > 0 && (
        <div className="mb-4">
          <label className="fw-bold small mb-2 d-block">Sub Categories</label>
          <div className="d-flex flex-wrap gap-1">
            {subs.map((s) => (
              <button
                key={s._id}
                type="button"
                onClick={() => handleSubClick(s)}
                className={`btn btn-sm ${
                  sub === s._id ? 'btn-crimson' : 'btn-outline-secondary'
                } rounded-pill py-1 px-2`}
                style={{ fontSize: '12px' }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      <div className="mb-4">
        <label className="fw-bold small mb-2 d-block">Brand</label>
        <div className="d-flex flex-wrap gap-1">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => handleBrandClick(b)}
              className={`btn btn-sm ${
                brand === b ? 'btn-crimson' : 'btn-outline-secondary'
              } rounded-pill py-1 px-2`}
              style={{ fontSize: '12px' }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-4">
        <label className="fw-bold small mb-2 d-block">Color</label>
        <div className="d-flex flex-wrap gap-1">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => handleColorClick(c)}
              className={`btn btn-sm ${
                color === c ? 'btn-crimson' : 'btn-outline-secondary'
              } rounded-pill py-1 px-2`}
              style={{ fontSize: '12px' }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="mb-4">
        <label className="fw-bold small mb-2 d-block">Minimum Rating</label>
        <div className="d-flex flex-column gap-1">
          {[5, 4, 3, 2, 1].map((n) => (
            <div
              key={n}
              onClick={() => handleStarClick(n)}
              className={`p-1 px-2 rounded-2 ${star === n ? 'bg-crimson-soft' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <Star starClick={() => handleStarClick(n)} numberOfStars={n} />
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="mb-2">
        <label className="fw-bold small mb-2 d-block">Fast Shipping</label>
        <div className="d-flex gap-2">
          {['Yes', 'No'].map((s) => (
            <button
              key={s}
              onClick={() => handleShippingChange(s)}
              className={`btn btn-sm ${
                shipping === s ? 'btn-crimson' : 'btn-outline-secondary'
              } flex-fill py-1`}
              style={{ fontSize: '12px' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      {/* Top Banner / Breadcrumb */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h3 className="fw-bold mb-1">
            <i className="fas fa-boxes-stacked text-crimson me-2"></i>Product Catalog
          </h3>
          <p className="text-muted small mb-0">
            Found {products.length} matching products
            {text && <span> for keyword "<b>{text}</b>"</span>}
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="btn btn-outline-crimson d-lg-none"
        >
          <i className="fas fa-sliders me-1"></i> {showMobileFilter ? 'Hide Filters' : 'Filters'}
        </button>
      </div>

      <div className="row g-4">
        {/* Desktop Sidebar Filters */}
        <div className="col-lg-3 d-none d-lg-block">
          {filterContent}
        </div>

        {/* Mobile Collapsible Filters */}
        {showMobileFilter && (
          <div className="col-12 d-lg-none">
            {filterContent}
          </div>
        )}

        {/* Product Grid */}
        <div className="col-12 col-lg-9">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-crimson" role="status"></div>
              <div className="mt-2 text-muted">Updating products...</div>
            </div>
          ) : products.length > 0 ? (
            <div className="row g-3">
              {products.map((p) => (
                <div key={p._id} className="col-12 col-sm-6 col-md-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-4 border">
              <i className="fas fa-box-open text-muted fs-1 mb-3"></i>
              <h5>No products match your filter</h5>
              <p className="text-muted small">Try broadening your search or resetting filters.</p>
              <button onClick={resetFilters} className="btn btn-crimson btn-sm">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
