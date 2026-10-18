import React, { useEffect, useState } from "react";
import { getUpdateCountProduct, getRelated } from "../../utils/ApiRoute";
import { useParams } from 'react-router-dom';
import SingleProduct from "./SingleProduct";
import ProductCard from "../../components/cards/ProductCard";

const Product = () => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    loadSingleProduct(slug);
  }, [slug]);

  const loadSingleProduct = async (productSlug) => {
    setLoading(true);
    try {
      const res = await getUpdateCountProduct(productSlug);
      if (res?.data) {
        setProduct(res.data);
        if (res.data._id) {
          getRelated(res.data._id)
            .then((relRes) => {
              const list = Array.isArray(relRes?.data) ? relRes.data : (Array.isArray(relRes) ? relRes : []);
              setRelated(list);
            })
            .catch(() => {});
        }
      }
    } catch (err) {
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-crimson" role="status"></div>
          <p className="mt-2 text-muted">Loading product details...</p>
        </div>
      ) : (
        <>
          <div className="row pt-2 mb-5">
            <SingleProduct 
              product={product}
              loadSingleProduct={() => loadSingleProduct(slug)}
            />
          </div>

          {/* Related Products Section */}
          <div className="my-5 pt-4 border-top">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <span className="badge-crimson mb-2 d-inline-block">You May Also Like</span>
                <h3 className="fw-bold mb-0">Related Products</h3>
              </div>
            </div>

            {related && related.length > 0 ? (
              <div className="row g-3">
                {related.map((p) => (
                  <div key={p._id} className="col-12 col-sm-6 col-lg-3">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted text-center py-4 bg-light rounded-4">
                No related products found in this category.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
