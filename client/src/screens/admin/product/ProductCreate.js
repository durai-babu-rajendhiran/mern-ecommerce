import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import FileUpload from "../../../components/forms/FileUpload";
import { CREATE_PRODUCT,GET_CATEGORIES,GET_CREATE_SUBS} from "../../../functions/ApiRoute";
import FetchData from "../../../functions/FetchApi";

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

  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
  }, []);

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


  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const res = await FetchData(CREATE_PRODUCT, "POST", JSON.stringify(values), user.token);
      if (res) {
        console.log(res);
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
    // console.log(e.target.name, " ----- ", e.target.value);
  };

  const handleCatagoryChange = async(e) => {
    e.preventDefault();
    console.log("CLICKED CATEGORY", e.target.value);
    setValues({ ...values, subs: [], category: e.target.value });
    const res = await FetchData(GET_CREATE_SUBS+"/"+e.target.value, "GET",null, user.token);
    if (res) {
        console.log("SUB OPTIONS ON CATGORY CLICK", res);
        setSubOptions(res.data);
        setShowSub(true);
    }
  };

  useEffect(()=>{
console.log("data",values)
  },[values.subs])

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
      </div>
    </div>
  );
};

export default ProductCreate;
