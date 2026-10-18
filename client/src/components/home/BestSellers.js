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
   {paginationInfo && paginationInfo.totalPages > 1 && (() => {
  const totalPages = paginationInfo.totalPages;
  
  // Helper function to generate smart page numbers with ellipsis (...)
  const getPageNumbers = () => {
    const delta = 1; // Number of pages to show before and after current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="d-flex flex-column align-items-center mt-4">
      <nav aria-label="Page navigation">
        <ul className="pagination shadow-sm mb-2">
          {/* Previous Button */}
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link px-3" 
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              &laquo; Prev
            </button>
          </li>

          {/* Page Numbers with Ellipsis */}
          {getPageNumbers().map((pageNum, idx) => {
            if (pageNum === '...') {
              return (
                <li key={`dots-${idx}`} className="page-item disabled">
                  <span className="page-link border-0 text-muted">...</span>
                </li>
              );
            }

            const isActive = page === pageNum;
            return (
              <li key={pageNum} className={`page-item ${isActive ? 'active' : ''}`}>
                <button
                  className={`page-link ${isActive ? 'bg-crimson border-crimson text-white fw-bold shadow-none' : 'text-dark'}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              </li>
            );
          })}

          {/* Next Button */}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link px-3" 
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next &raquo;
            </button>
          </li>
        </ul>
      </nav>
      
      {/* Optional: Results indicator for clarity */}
      <small className="text-muted">
        Page {page} of {totalPages}
      </small>
    </div>
  );
})()}
    </div>
  );
};

export default BestSellers;
