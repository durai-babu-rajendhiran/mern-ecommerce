import React, { useState, useEffect,useRef } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import {GET_CATEGORIES,GET_CREATE_SUBS,GET_REMOVE_UPDATE_SUB } from "../../../utils/ApiRoute";
import FetchData from "../../../utils/FetchApi";
import ModalPopup from "../../../components/forms/ModalPopup";

const SubCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subs, setSubs] = useState([]);
  // step 1
  const [keyword, setKeyword] = useState("");
  const [editItem, setEditItem] = useState({});
  const btnRef = useRef(null);
  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await FetchData(GET_CATEGORIES, "GET",null, user.token);
      if (res) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const loadSubs = async () => {
    try {
      const res = await FetchData(GET_CREATE_SUBS, "GET",null, user.token);
      if (res) {
        setSubs(res.data);
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await FetchData(GET_CREATE_SUBS, "POST", JSON.stringify({ name, parent: category }), user.token);
      if (res) {
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created`);
        loadCategories();
        loadSubs()
      }
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 400) {
        toast.error(err.response.data);
      }
    }
  };

  const handleRemove = async (slug) => {
    // let answer = window.confirm("Delete?");
    // console.log(answer, slug);
    if (window.confirm("Delete?")) {
      setLoading(true);
      try {
        const res = await FetchData(GET_REMOVE_UPDATE_SUB + slug, "DELETE", null, user.token);
        if (res) {
          setLoading(false);
          toast.error(`${res.data.name} deleted`);
          loadCategories();
          loadSubs();
        }
      } catch (err) {
        setLoading(false);
        if (err.response?.status === 400) {
          toast.error(err.response.data);
        }
      }
    }
  };

  // step 4
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);


  const handleEdit = (item)=>{
    setEditItem(item)
  }

  const handleUpdate =async()=>{
    setLoading(true);
    try {
      const res = await FetchData(
        GET_REMOVE_UPDATE_SUB + editItem.slug,
        "PUT",
        JSON.stringify(editItem),
        user.token
      );
      if (res) {
        setLoading(false);
        btnRef.current.click();
        toast.success(`"${res.data.name}" is updated`);
        loadCategories();
        loadSubs()
      }
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 400) {
        toast.error(err.response.data);
      }
  }
}
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
            <h4>Create sub category</h4>
          )}

          <div className="form-group">
          <div className="col-6 container d-flex mb-4">
            <select
              name="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>select Category</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          </div>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />

          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {/* step 5 */}
       
          <div className="container mt-4">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {subs.filter(searched(keyword)).map((s,index) => (
                  <tr key={s._id}>
                    <td>{index + 1}</td>
                    <td>{s.name}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(s)}
                        className="btn btn-info btn-sm me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemove(s.slug)}
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
            <select
              name="category"
              className="form-control mb-2"
              onChange={(e) => setEditItem({ ...editItem, parent: e.target.value })}
              value={editItem.parent}
            >
              <option>select Category</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
              <input
                type="text"
                placeholder="Enter SubCategory"
                className="form-control"
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                value={editItem.name}
                autoFocus
                required
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" onClick={handleUpdate} className="btn btn-primary">
                Save changes
              </button>
            </div>
        </ModalPopup>
      </div>
    </div>
  );
};

export default SubCreate;
