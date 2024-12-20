import React, { useEffect, useState } from "react";
import ProductCard from "../../screens/product/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import {
  getProducts
} from "../../utils/ApiRoute";
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
      const res = await getProducts({
        sort,
        order,
        limit,
      });
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
