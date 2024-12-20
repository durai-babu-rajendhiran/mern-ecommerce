import React, { useEffect, useState } from "react";
import {
  getRemoveOrUpdateCountProduct,getUpdateCountProduct
} from "../../utils/ApiRoute";
import { useParams } from 'react-router-dom';
import SingleProduct from "./SingleProduct";

const Product = () => {

  const [product, setProduct] = useState({});
  const { slug } = useParams();

  useEffect(() => {
    loadSingleProduct(slug); // Pass the slug to the function
  }, [slug]);

  const loadSingleProduct = async (slug) => {
    try {
    const res = await getUpdateCountProduct(slug);
    if(res){
      setProduct(res);
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
    <div className="text-center d-flex justify-content-center">
      <div>Related products</div>
    </div>
  </div>
  );
};

export default Product;
