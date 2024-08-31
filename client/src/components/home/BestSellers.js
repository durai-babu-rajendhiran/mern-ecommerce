import React, { useEffect, useState } from "react";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import {
  GET_PRODUCTS,
  BASEURL,
} from "../../utils/ApiRoute";
import FetchData from "../../utils/FetchApi";

const BestSellers = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState(null);

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const [sort, order, limit] = ["sold", "desc", 3];
      const res = await FetchData(GET_PRODUCTS, "POST",JSON.stringify({
        sort,
        order,
        limit,
      }),null);
      setProducts(res.data);
      setPaginationInfo(res.pagination || null);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }


  const paginationNumbers = () => {
    const totalPages = paginationInfo?.totalPages || 0;
    const currentPage = page;
    const paginationRange = 10;
    const maxPagesToShow = Math.min(totalPages, paginationRange);
    const paginationStart = Math.max(1, currentPage - Math.floor(paginationRange / 2));
    const paginationEnd = Math.min(totalPages, paginationStart + paginationRange - 1);
    const numbersToShow = [];
    for (let i = paginationStart; i <= paginationEnd; i++) {
      numbersToShow.push(i);
    }
    return numbersToShow;
  };

  const NextPage = () => {
    setPage(page + 1);
  };

  const PreviousPage = () => {
    setPage(page - 1);
  };

  const PageCompanent = ()=>{
    return(
      <div>
      <nav aria-label="Page navigation example">
      <ul className="pagination" style={{ marginLeft: "10px" }}>
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={PreviousPage}>Previous</button>
        </li>
        {paginationNumbers().map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${page === pageNumber ? 'active' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
        <li className={`page-item ${page === paginationInfo?.totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={NextPage}>Next</button>
        </li>
      </ul>
    </nav>
    <div className='pagination' style={{ marginLeft: "17px" }}>
      <p>Total Records: {paginationInfo?.totalItems}</p>
      <p style={{ paddingLeft: '10px' }}>Total Pages: {paginationInfo?.totalPages}</p>
    </div>
    </div>
    )
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
<PageCompanent/>
      </div>
    </>
  );
};

export default BestSellers;
