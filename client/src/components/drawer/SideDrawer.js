import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));

  const imageStyle = {
    width: "100%",
    height: "50px",
    objectFit: "cover",
  };

  return (
    <div
      className={`sidebar ${drawer ? "sidebar-open" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        width: "300px",
        backgroundColor: "#fff",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease-in-out",
        transform: drawer ? "translateX(0)" : "translateX(100%)",
        zIndex: 9999,
      }}
    >
      <div className="text-center mt-4">
        <h4>{`Cart / ${cart.length} Product`}</h4>
      </div>

      {cart.map((p) => (
        <div key={p._id} className="row mb-3">
          <div className="col-12">
            {p.images[0] ? (
              <>
                <img src={p.images[0].url} style={imageStyle} alt={p.title} />
                <p className="text-center bg-secondary text-light py-2">
                  {p.title} x {p.count}
                </p>
              </>
            ) : (
              <>
                <img src={"assets/images/laptop.png"} style={imageStyle} alt={p.title} />
                <p className="text-center bg-secondary text-light py-2">
                  {p.title} x {p.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}

      <Link to="/cart">
        <button
          onClick={() =>
            dispatch({
              type: "SET_VISIBLE",
              payload: false,
            })
          }
          className="btn btn-primary btn-lg btn-block"
        >
          Go To Cart
        </button>
      </Link>

      <button
        onClick={() =>
          dispatch({
            type: "SET_VISIBLE",
            payload: false,
          })
        }
        className="btn btn-danger btn-sm d-block mx-auto mt-3"
        style={{ width: "100px" }}
      >
        Close
      </button>
    </div>
  );
};

export default SideDrawer;
