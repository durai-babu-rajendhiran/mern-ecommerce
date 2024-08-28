import React, { useState } from "react";
import { useSelector } from "react-redux";
import FetchData from "../../functions/FetchApi";
import {UPLOAD_IMAGE,REMOVE_IMAGE,BASEURL} from "../../functions/ApiRoute"
const FileUpload = ({ values, setValues, setLoading }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = () => {
        img.src = reader.result;
      };
      reader.onerror = (error) => reject(error);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };
      reader.readAsDataURL(file);
    });
  };

  const fileUploadAndResize = async (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
  
    try {
      const formData = new FormData();
        await Promise.all(files.map(async (selectedFile) => {
          const resizedBlob = await resizeImage(selectedFile, 720, 720);
          formData.append("mediaUrls", resizedBlob, selectedFile.name); // Ensure proper naming
      }));
      // const res = await FetchData(UPLOAD_IMAGE, "POST", formData, user.token, true);
      const res = await FetchData(UPLOAD_IMAGE, "POST", formData, user.token, true);
      if (res) {
        const images = Array.isArray(res.url) ? res.url : [res.url];

        // Update the state with the new image URLs
        setValues((prevValues) => ({
          ...prevValues,
          images: [
            ...(prevValues.images || []), // Spread existing URLs, default to empty array if undefined
            ...images // Add new URLs
          ] // Adjust as needed if images is the correct key
        }));     
      }
    } catch (error) {
      console.error("IMAGE UPLOAD ERR", error);
    }
  };

  const handleImageRemove = async (image) => {
    setLoading(true);
    try {
      const res = await FetchData(REMOVE_IMAGE, "POST", JSON.stringify({image}), user.token, false);
      if (res) {
        const filteredImages = values.images.filter((item) => item != image);
        setValues({ ...values, images: filteredImages });  
      }
    } catch (error) {
      console.error("REMOVE IMAGE ERR", error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <div className="col-3 mb-3" key={image}>
              <div className="position-relative">        
                <img
                  src={BASEURL+image}
                  alt="Uploaded"
                  className="img-fluid"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleImageRemove(image)}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                  onClick={() => handleImageRemove(image)}
                >
                  X
                </button>
              </div>
            </div>
          ))}
      </div>
      <div className="row">
        <label className="btn btn-primary">
          Choose File
          <input
            type="file"
            multiple
            hidden
            accept="image/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;