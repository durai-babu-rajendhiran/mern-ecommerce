import React, { useState, useEffect, useRef } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { CREATE_CATEGORY, GET_CATEGORIES, REMOVE_UPDATE_CATEGORY } from "../../../functions/ApiRoute";
import FetchData from "../../../functions/FetchApi";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import ModalPopup from "../../../components/forms/ModalPopup";

const CategoryCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editItem, setEditItem] = useState({});
  const btnRef = useRef(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await FetchData(GET_CATEGORIES, "GET");
      if (res) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleEdit = (item) => setEditItem(item);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await FetchData(CREATE_CATEGORY, "POST", JSON.stringify({ name }), user.token);
      if (res) {
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is created`);
        loadCategories();
      }
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 400) {
        toast.error(err.response.data);
      }
    }
  };
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await FetchData(
        REMOVE_UPDATE_CATEGORY + editItem.slug,
        "PUT",
        JSON.stringify({ name: editItem.name }),
        user.token
      );
      if (res) {
        setLoading(false);
        btnRef.current.click();
        toast.success(`"${res.data.name}" is updated`);
        loadCategories();
      }
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 400) {
        toast.error(err.response.data);
      }
    }
  };

  const handleRemove = async (slug) => {
    if (window.confirm("Delete?")) {
      setLoading(true);

      try {
        const res = await FetchData(REMOVE_UPDATE_CATEGORY + slug, "DELETE", null, user.token);
        if (res) {
          setLoading(false);
          toast.error(`${res.data.name} deleted`);
          loadCategories();
        }
      } catch (err) {
        setLoading(false);
        if (err.response?.status === 400) {
          toast.error(err.response.data);
        }
      }
    }
  };



  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Create category</h4>
          )}
          <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />
          <hr />
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />      
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
                {categories.filter(searched(keyword)).map((c, index) => (
                  <tr key={c._id}>
                    <td>{index + 1}</td>
                    <td>{c.name}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(c)}
                        className="btn btn-info btn-sm me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemove(c.slug)}
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
      </div>
      <ModalPopup>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Category
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
              <input
                type="text"
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
  );
};

export default CategoryCreate;
