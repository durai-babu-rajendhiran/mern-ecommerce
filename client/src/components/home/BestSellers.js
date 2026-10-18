import React, { useEffect, useState } from "react";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import { getProducts } from "../../utils/ApiRoute";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState(null);

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const [sort, order, limit] = ["sold", "desc", 4];
      const res = await getProducts({
        sort,
        order,
        page,
        limit,
      });
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      setProducts(list);
      setPaginationInfo(res?.pagination || res?.data?.pagination || null);
    } catch (error) {
      console.error("Failed to load best sellers:", error);
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
            <div className="text-center text-muted py-4">No best sellers yet.</div>
          )}
        </div>
      )}

      {/* Pagination */}
      {paginationInfo && paginationInfo.totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage(page - 1)}>
                  Previous
                </button>
              </li>
              {[...Array(paginationInfo.totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                  <button
                    className={`page-link ${page === i + 1 ? 'bg-crimson border-crimson text-white' : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === paginationInfo.totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BestSellers;
