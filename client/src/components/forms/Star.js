import React, { useState } from "react";

const Star = ({ starClick, numberOfStars }) => {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);

  const handleClick = (starValue) => {
    setRating(starValue);
    starClick(starValue); // Call parent function to handle rating selection
  };

  return (
    <div className="rating-container">
      {Array.from({ length: numberOfStars }, (_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`star ${starValue <= (hover || rating) ? "active" : ""}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: starValue <= (hover || rating) ? "red" : "gray",
              marginRight: "5px",
            }}
          >
            &#9733; {/* Unicode star character */}
          </span>
        );
      })}
    </div>
  );
};

export default Star;
