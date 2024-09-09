import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BASEURL } from '../../utils/ApiRoute';
import ProductListItems from './ProductListItems';

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

const ActionButtons = () => (
  <div className="action-buttons d-flex justify-content-around my-3">
    <a href="#" className="btn btn-outline-primary btn-sm">
      <i className="fa-solid fa-cart-shopping" /> Add to Cart
    </a>
    <a href="#" className="btn btn-outline-secondary btn-sm">
      <i className="fa-regular fa-heart" /> Add to Wishlist
    </a>
  </div>
);

const SingleProduct = ({ product }) => {
  const { title, description, images } = product;

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
        <div className="card">
          <div className="card-body d-flex flex-column align-items-center">
            <div className="icon-wrapper mb-3">
              <div className="card-title fw-bolder h2">{title}</div>
            </div>
            <ProductListItems product={product} />
            <ActionButtons />
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
