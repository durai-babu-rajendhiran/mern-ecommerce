import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import { getWishlist, removeWishlist } from "../../utils/ApiRoute";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () =>
    getWishlist(user.token).then((res) => {
      // console.log(res);
      setWishlist(res.data?.wishlist);
    });

  const handleRemove = (productId) =>
    removeWishlist(productId, user.token).then((res) => {
      loadWishlist();
    });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlist</h4>
          {Array.isArray(wishlist) && wishlist.map((p) => (
  <div key={p._id} className="alert alert-light d-flex justify-content-between align-items-center mb-3 p-3 shadow-sm rounded">
    <div>
      <Link to={`/product/${p.slug}`} className="h5 text-decoration-none text-dark">{p.title}</Link>
      <p className="mb-0 text-muted">{p.description}</p>
      <span className="badge badge-info">{p.price} USD</span>
    </div>
    <div className="d-flex align-items-center">
      <button 
        onClick={() => handleRemove(p._id)} 
        className="btn btn-danger btn-sm ms-2" 
        title="Remove from wishlist"
      >
        <i className="fas fa-trash-alt"></i>
      </button>
    </div>
  </div>
))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
