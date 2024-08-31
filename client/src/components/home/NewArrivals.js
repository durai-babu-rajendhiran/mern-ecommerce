import React, { useEffect, useState } from "react";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import {
  GET_PRODUCTS
} from "../../utils/ApiRoute";
import FetchData from "../../utils/FetchApi";
const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const [sort,
        order,
        limit,]=["createdAt", "desc", 3]
      const res = await FetchData(GET_PRODUCTS, "POST",JSON.stringify({
        sort,
        order,
        limit,
      }),null);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="container">
        {loading ? (
          <LoadingCard count={3} />
        ) : (
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NewArrivals;
