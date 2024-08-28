import React, { useState, useEffect, useRef } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import FileUpload from "../../../components/forms/FileUpload";
import { CREATE_PRODUCT, GET_CATEGORIES, GET_CREATE_SUBS,GET_REMOVE_UPDATE_COUNT_PRODUCT,GET_PRODUCT_BY_COUNT,BASEURL } from "../../../functions/ApiRoute";
import FetchData from "../../../functions/FetchApi";
import ModalPopup from "../../../components/forms/ModalPopup";

const initialState = {
  title: "Macbook Pro",
  description: "This is the best Apple product",
  price: "45000",
  categories: [],
  category: "",
  subs: [],
  shipping: "Yes",
  quantity: "50",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
  color: "White",
  brand: "Apple",
};


const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef(null);
  const [products, setProducts] = useState([]);
  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
    loadAllProducts()
  }, []);


  const loadAllProducts = async() => {
    setLoading(true);
    const res = await FetchData(GET_PRODUCT_BY_COUNT+"100", "GET");
      if(res){
        setProducts(res.data);
        setLoading(false);
      }
  };

  const loadCategories = async () => {
    try {
      const res = await FetchData(GET_CATEGORIES, "GET");
      if (res) {
        setValues({ ...values, categories: res.data })
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await FetchData(CREATE_PRODUCT, "POST", JSON.stringify(values), user.token);
      if (res) {
        console.log(res);
        loadAllProducts()
        window.alert(`"${res.data.title}" is created`);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.err);
    }

  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCatagoryChange = async (e) => {
    e.preventDefault();
    setValues({ ...values, subs: [], category: e.target.value });
    const res = await FetchData(GET_CREATE_SUBS + "/" + e.target.value, "GET", null, user.token);
    if (res) {
      setSubOptions(res.data);
      setShowSub(true);
    }
  };

  const handleRemove =async(slug)=>{
    if (window.confirm("Delete?")) {
      setLoading(true);
      try {
        const res = await FetchData(GET_REMOVE_UPDATE_COUNT_PRODUCT + slug, "DELETE", null, user.token);
        if (res) {
          setLoading(false);
          toast.error(`${res.data.title} deleted`);
          loadAllProducts()
        }
      } catch (err) {
        setLoading(false);
        if (err.response?.status === 400) {
          toast.error(err.response.data);
        }
      }
    }
  }
  const handleEdit =()=>{

  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product create</h4>
          <hr />
          <div className="p-3">
            <button className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >Add Products</button>
          </div>


  
          
<div className="container mt-4">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>title</th>
                  <th>category</th>
                  <th>description</th>
                  <th>price</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {products.map((product,index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.title}</td>
                    <td>{product.category.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.images.map(item=>(<img src={BASEURL+item} width="40px" className="mx-1" />))}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(product.slug)}
                        className="btn btn-info btn-sm me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemove(product.slug)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ModalPopup>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit sub category
              </h1>
              <button
                type="button"
                className="btn-close"
                ref={btnRef}
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="p-3">
                <FileUpload
                  values={values}
                  setValues={setValues}
                  setLoading={setLoading}
                />
              </div>
              <ProductCreateForm
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                setValues={setValues}
                values={values}
                handleCatagoryChange={handleCatagoryChange}
                subOptions={subOptions}
                showSub={showSub}
              />
            </div>
          </ModalPopup>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
