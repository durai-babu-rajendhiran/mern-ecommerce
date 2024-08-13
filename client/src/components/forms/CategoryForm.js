import React from "react";

const CategoryForm = ({ handleSubmit, name, setName }) => (
  <form onSubmit={handleSubmit} className="row">
  <div className="col-6 container d-flex mb-4">
    <input
      type="text"
      placeholder="Enter Text"
      className="form-control mx-2"
      onChange={(e) => setName(e.target.value)}
      value={name}
      autoFocus
      required
    />
    <button type="submit" className="btn btn-outline-primary">
      Save
    </button>
  </div>
</form>
);

export default CategoryForm;
