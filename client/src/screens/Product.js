import React, { useEffect, useState } from "react";
import {
  GET_REMOVE_UPDATE_COUNT_PRODUCT,
} from "../utils/ApiRoute";
import { useParams } from 'react-router-dom';
import FetchData from "../utils/FetchApi";
import SingleProduct from "../components/cards/SingleProduct";

const Product = () => {

  const [product, setProduct] = useState({});
  const { slug } = useParams();

  useEffect(() => {
    loadSingleProduct(slug); // Pass the slug to the function
  }, [slug]);

  const loadSingleProduct = async (slug) => {
    try {
    const res = await FetchData(GET_REMOVE_UPDATE_COUNT_PRODUCT + slug, "GET", null, null);
    if(res.data){
      setProduct(res.data);
    }
    }catch (err) {
      console.error("Failed to load product details:", err);
    }
  };

  return(
    <div className="container-fluid">
    <div className="row pt-4">
      <SingleProduct product={product} />
    </div>

    <div className="row">
      <div>Related products</div>
    </div>
  </div>
  );
};

export default Product;
