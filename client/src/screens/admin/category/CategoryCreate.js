import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {CREATE_CATEGORY,GET_CATEGORIES,REMOVE_UPDATE_CATEGORY} from "../../../functions/ApiRoute";
import FetchData from "../../../functions/FetchApi"

const CategoryCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async() =>{

    const res = await FetchData(GET_CATEGORIES, "GET",null, null, false);
    if(res){
      setCategories(res.data)
    }else{
     console.log(err.response.data);
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    const res = await FetchData(CREATE_CATEGORY, "POST", { name }, user.token, false);
    if(res){
      setLoading(false);
      setName("");
      toast.success(`"${res.data.name}" is created`);
    }else{
      setLoading(false);
      if (err.response.status === 400) toast.error(err.response.data);
    }

  };

  const categoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          value={name}
          autoFocus
          required
        />
        <br />
        <button className="btn btn-outline-primary">Save</button>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Create category</h4>
          )}
          {categoryForm()}
          <hr />
          {JSON.stringify(categories)}
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
