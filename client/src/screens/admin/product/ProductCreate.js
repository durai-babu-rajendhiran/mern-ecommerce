import React, { useState, useEffect, useRef } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import FileUpload from "../../../components/forms/FileUpload";
import {
  CREATE_PRODUCT,
  GET_CATEGORIES,
  GET_CREATE_SUBS,
  GET_REMOVE_UPDATE_COUNT_PRODUCT,
  GET_PRODUCT_BY_COUNT,
  BASEURL,
} from "../../../functions/ApiRoute";
import FetchData from "../../../functions/FetchApi";
import ModalPopup from "../../../components/forms/ModalPopup";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";

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
  const [arrayOfSubs, setArrayOfSubs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const btnRef = useRef(null);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const res = await FetchData(GET_PRODUCT_BY_COUNT + "100", "GET");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await FetchData(GET_CATEGORIES, "GET");
      setValues((prevValues) => ({ ...prevValues, categories: res.data }));
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await FetchData(
        CREATE_PRODUCT,
        "POST",
        JSON.stringify(values),
        user.token
      );
      window.alert(`"${res.data.title}" is created`);
      loadAllProducts();
      window.location.reload();
    } catch (err) {
      console.error("Failed to create product:", err);
      toast.error(err.response.data.err);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = async (e, isEditMode = false) => {
    const categoryId = isEditMode ? e : e.target.value;
    setValues({ ...values, subs: [], category: categoryId });
    setSelectedCategory(categoryId);

    try {
      const res = await FetchData(GET_CREATE_SUBS + "/" + categoryId, "GET", null, user.token);
      setSubOptions(res.data);
      setShowSub(true);
    } catch (error) {
      console.error("Failed to load subcategories:", error);
    }
  };

  const handleRemove = async (slug) => {
    if (window.confirm("Delete?")) {
      try {
        setLoading(true);
        const res = await FetchData(GET_REMOVE_UPDATE_COUNT_PRODUCT + slug, "DELETE", null, user.token);
        toast.error(`${res.data.title} deleted`);
        loadAllProducts();
      } catch (err) {
        console.error("Failed to delete product:", err);
        toast.error(err.response?.data || "Failed to delete product");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (slug) => {
    try {
      setEditMode(true);
      const res = await FetchData(GET_REMOVE_UPDATE_COUNT_PRODUCT + slug, "GET", null, user.token);
      setValues(res.data);
  
      handleCategoryChange(res.data.category._id, true);
      const subIds = res.data.subs.map((sub) => sub._id);
      setArrayOfSubs(subIds);
    } catch (err) {
      console.error("Failed to load product details:", err);
      toast.error(err.response?.data || "Failed to load product details");
    }
  };

  const handleUpdate = async () => {
    // Implement update functionality here
  };

  const resetForm = () => {
    setValues(initialState);
    setEditMode(false);
    setShowSub(false)
    loadCategories();
    loadAllProducts();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product</h4>
          <hr />
          <div className="p-3">
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={resetForm}
            >
              Add Products
            </button>
          </div>

          <div className="container mt-4">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.title}</td>
                    <td>{product.category.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.images.map((image) => (
                        <img
                          key={image}
                          src={BASEURL + image}
                          width="40px"
                          className="mx-1"
                          alt={product.title}
                        />
                      ))}
                    </td>
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
                {editMode ? "Product Update" : "Create Product"}
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
              {editMode ? (
                <ProductUpdateForm
                  handleSubmit={handleUpdate}
                  handleChange={handleChange}
                  setValues={setValues}
                  values={values}
                  handleCategoryChange={handleCategoryChange}
                  categories={categories}
                  subOptions={subOptions}
                  arrayOfSubs={arrayOfSubs}
                  setArrayOfSubs={setArrayOfSubs}
                  selectedCategory={selectedCategory}
                />
              ) : (
                <ProductCreateForm
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  setValues={setValues}
                  values={values}
                  handleCategoryChange={handleCategoryChange}
                  subOptions={subOptions}
                  showSub={showSub}
                />
              )}
            </div>
          </ModalPopup>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
