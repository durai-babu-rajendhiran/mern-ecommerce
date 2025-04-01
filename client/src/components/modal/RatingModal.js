import React, { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import "./style/rating.css"
import {
  productStar
} from "../../utils/ApiRoute";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const RatingModal = ({ name, modalShow, setModalShow, loadSingleProduct, product }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [rating, setRating] = useState(0); // Current rating
  const [hover, setHover] = useState(0);   // Hover state for highlighting
  const navigate = useNavigate()
  const handleClick = (rate) => {
    setRating(rate);
    productStar(name, rate, user.token).then((res) => {
      if(res){
        setModalShow(false);
        loadSingleProduct()
        toast.success("Thanks for your review. It will apper soon");
      }
    });
  };
  var totalStars = 5
  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele?.postedBy?.toString() == user?._id?.toString()
      );
      if(existingRatingObject){
        setHover(existingRatingObject.star);
        setRating(existingRatingObject.star); // current user's star
      }
    }
  },[product.ratings]);
  return (
    <>
      <div
        className={`modal fade show ${modalShow?'d-block':'d-none'}`}
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">

          <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Ratings
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={()=>setModalShow(false)}
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
            <div className="rating-container">
      {Array.from({ length: totalStars }, (_, index) => {
        const starValue = index + 1;

        return (
          <span
            key={index}
            className={`star ${starValue <= (hover || rating) ? 'active' : ''}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          >
            &#9733; {/* Unicode star character */}
          </span>
        );
      })}
    </div>
          </div>
          </div>
        </div>
        </div>
    </>
  );
};

export default RatingModal;
