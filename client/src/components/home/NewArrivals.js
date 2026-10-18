import React, { useEffect, useState } from "react";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import { getProducts } from "../../utils/ApiRoute";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const [sort, order, limit] = ["createdAt", "desc", 4];
      const res = await getProducts({
        sort,
        order,
        limit,
      });
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      setProducts(list);
    } catch (error) {
      console.error("Failed to load new arrivals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      {loading ? (
        <LoadingCard count={4} />
      ) : (
        <div className="row g-3">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="col-12 col-sm-6 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="text-center text-muted py-4">No products found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
