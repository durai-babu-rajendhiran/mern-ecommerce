import React from "react";

export const showAverage = (p) => {
  if (p && p.ratings) {
    let ratingsArray = p && p.ratings;
    let total = [];
    let length = ratingsArray.length;

    ratingsArray.map((r) => total.push(r.star));
    let totalReduced = total.reduce((p, n) => p + n, 0);

    let highest = length * 5;
    let result = (totalReduced * 5) / highest;

    const roundedRating = Math.round(result);

    return (
      <div className="text-center pt-1 pb-3">
        <div className="d-flex align-items-center justify-content-center">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`mx-1 ${
                i < roundedRating ? "text-warning" : "text-muted"
              }`}
            >
              &#9733;
            </span>
          ))}
          <span className="ms-2 text-muted">({length} Reviews)</span>
        </div>
      </div>
    );
  }
  return null;
};
