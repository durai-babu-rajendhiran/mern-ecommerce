import React,{useState,useMemo} from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BASEURL,addToWishlist } from '../../utils/ApiRoute';
import ProductListItems from './ProductListItems';
import RatingModal from '../../components/modal/RatingModal';
import { showAverage } from './Function';
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ImageCarousel = ({ images }) => (
  <Carousel showArrows autoPlay infiniteLoop>
    {images.map((image, index) => (
      <img src={`${BASEURL}${image}`} alt={`Product Image ${index}`} key={index} />
    ))}
  </Carousel>
);

const NoImagePlaceholder = () => (
  <div className="card mb-3">
    <img src="/assets/images/laptop.png" className="card-img-top" alt="Placeholder" />
  </div>
);

const TabLinks = () => (
  <ul className="nav nav-tabs" id="myTab" role="tablist">
    <li className="nav-item" role="presentation">
      <a
        className="nav-link active"
        id="description-tab"
        data-bs-toggle="tab"
        href="#description"
        role="tab"
        aria-controls="description"
        aria-selected="true"
      >
        Description
      </a>
    </li>
    <li className="nav-item" role="presentation">
      <a
        className="nav-link"
        id="more-tab"
        data-bs-toggle="tab"
        href="#more"
        role="tab"
        aria-controls="more"
        aria-selected="false"
      >
        More
      </a>
    </li>
  </ul>
);

const TabContent = ({ description }) => (
  <div className="tab-content" id="myTabContent">
    <div
      className="tab-pane fade show active"
      id="description"
      role="tabpanel"
      aria-labelledby="description-tab"
    >
      <div className="container mt-3">
        <p>{description}</p>
      </div>
    </div>
    <div className="tab-pane fade" id="more" role="tabpanel" aria-labelledby="more-tab">
      <div className="container mt-3">
        Call us on xxxx xxx xxx to learn more about this product.
      </div>
    </div>
  </div>
);


const SingleProduct = ({ product = {}, loadSingleProduct }) => {
  const [tooltip, setTooltip] = useState("Click to add");
  const navigate = useNavigate();
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);   // Hover state for highlighting

  const averageRating = useMemo(() => {
    return product.ratings && product.ratings.length > 0 ? showAverage(product) : "No rating yet";
  }, [product]);
  if (!product) {
    return <div>Loading...</div>;  // Still valid since hooks are initialized above
  }

  const { title, images, description, _id } = product;

  const handleAddToCart = () => {
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.push({ ...product, count: 1 });
      let unique = _.uniqWith(cart, _.isEqual);
      localStorage.setItem("cart", JSON.stringify(unique));
      setTooltip("Added");

      dispatch({ type: "ADD_TO_CART", payload: unique });
      dispatch({ type: "SET_VISIBLE", payload: true });
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token).then((res) => {
      console.log("ADDED TO WISHLIST", res.data);
      toast.success("Added to wishlist");
      navigate("/user/wishlist");
    });
  };

  const handleModal = () => {
    if (user && user.token) {
      setModalShow(true);
    } else {
      navigate("/login", {  });
    }
  };
  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <ImageCarousel images={images} />
        ) : (
          <NoImagePlaceholder />
        )}
        <TabLinks />
        <TabContent description={description} />
      </div>
      <div className="col-md-5">
        <div className="card-body d-flex flex-column align-items-center">
          <div className="icon-wrapper mb-3">
            <div className="card-title fw-bolder h2">{title}</div>
          </div>
          <ProductListItems product={product} />
          {averageRating}
 
          <div onClick={handleModal} className="btn btn-outline-danger mt-3 p-1">
            <span>&#9733;</span> {user ? "Leave Rating" : "Login to leave Rating"}
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
        <div className="action-buttons d-flex justify-content-around my-3">
            <a
              href="#"
              onClick={handleAddToCart}
              disabled={product.quantity < 1}
              className="btn btn-outline-primary btn-sm my-2 mx-2"
            >
              <i className="fa-solid fa-cart-shopping" /> Add to Cart
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary btn-sm my-2 mx-2"
              onClick={handleAddToWishlist}
            >
              <i className="fa-regular fa-heart" /> Add to Wishlist
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
