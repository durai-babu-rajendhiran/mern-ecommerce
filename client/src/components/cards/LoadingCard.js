import React from "react";
import Skeleton from "react-loading-skeleton";
const LoadingCard = ({ count }) => {
  const cards = () => {
    let totalCards = [];

    for (let i = 0; i < count; i++) {
      totalCards.push(
        <div className="col-md-4">
          <Skeleton ></Skeleton>
        </div>
      );
    }

    return totalCards;
  };

  return <div className="row pb-5">{cards()}</div>;
};

export default LoadingCard;
