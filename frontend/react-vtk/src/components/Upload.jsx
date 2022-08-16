import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

const Upload = ({ onSuccess }) => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    setFiles(e.target.files);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("file", files[i]);
    }

    axios
      .post("http://localhost:3000/upload", data)
      .then((res) => {
        res.status === 200
          ? toast.success("File Uploaded Succesfully", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            })
          : toast.error("Error Uploading Files", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
        onSuccess(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col w-full md:w-[500px] items-center justify-center mb-3 md:mb-0">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="border-2 p-10 flex items-center border-secondary rounded-lg w-[90%] xs:mt-30">
        <form
          action="#"
          method="post"
          id="#"
          onSubmit={onSubmit}
          className="flex flex-col w-full"
        >
          <input
            type="file"
            id="file-input"
            className="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
            onChange={onInputChange}
            multiple
          />
          <label
            htmlFor="file-input"
            className="btn-secondary w-full text-center"
            style={{ fontFamily: '"Exo-2", sans-serif' }}
          >
            VTK Dosyası Seç
          </label>
          <button
            className="btn-primary w-full text-center mt-5"
            style={{ fontFamily: '"Exo-2", sans-serif' }}
          >
            Yükle
          </button>
        </form>
      </div>
      <button
        className="btn-primary w-[90%] mt-4"
        onClick={() => navigate("/VolumeClip")}
      >
        VTI Dosyası Görüntüle
      </button>
      <button
        className="btn-primary w-[90%] mt-4"
        onClick={() => navigate("/GeometryViewer")}
      >
        VTP Dosyası Görüntüle
      </button>
    </div>
  );
};

export default Upload;
