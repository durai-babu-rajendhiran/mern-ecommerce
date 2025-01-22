import React, { useEffect, useState } from "react";
import {
  getUpdateCountProduct
} from "../../utils/ApiRoute";
import { useParams } from 'react-router-dom';
import SingleProduct from "./SingleProduct";
import { useSelector } from "react-redux";

const Product = () => {
  const [product, setProduct] = useState({});
  const { slug } = useParams();
  useEffect(() => {
    loadSingleProduct(slug); // Pass the slug to the function
  }, [slug]);

  const loadSingleProduct = async () => getUpdateCountProduct(slug).then((res) => setProduct(res.data))

  return(
    <div className="container-fluid">
    <div className="row pt-4">
      <SingleProduct 
      product={product}
      loadSingleProduct={loadSingleProduct}
      />
    </div>
    <div className="text-center d-flex justify-content-center">
      <div>Related products</div>
    </div>
  </div>
  );
};

export default Product;
