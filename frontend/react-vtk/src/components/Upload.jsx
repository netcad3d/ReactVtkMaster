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
    <div className="flex flex-col">
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
      <div className="border-2 p-10 flex items-center border-secondary rounded-lg">
        <form action="#" method="post" id="#" onSubmit={onSubmit}>
          <input
            type="file"
            id="file-input"
            className="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
            onChange={onInputChange}
            multiple
          />
          <label
            htmlFor="file-input"
            className="text-xl font-semibold text-white bg-secondary inline-block rounded-lg cursor-pointer p-3 border-2 hover:bg-white hover:text-secondary hover:border-secondary transition-all duration-200 ease-in tracking-wide mr-[100px]"
            style={{ fontFamily: '"Exo-2", sans-serif' }}
          >
            VTK Dosyası Seç
          </label>
          <button
            className="text-xl font-semibold text-white border-2 rounded-lg p-3 w-[100px] cursor-pointer hover:bg-white hover:text-secondary hover:border-secondary transition-all duration-200 ease-in tracking-wide"
            style={{ fontFamily: '"Exo-2", sans-serif' }}
          >
            Yükle
          </button>
        </form>
      </div>
      <button
        className="text-xl font-semibold text-white border-2 rounded-lg p-3 cursor-pointer hover:bg-white hover:text-secondary hover:border-secondary transition-all duration-200 ease-in tracking-wide mt-4"
        onClick={() => navigate("/VolumeClip")}
      >
        VTI Dosyası Görüntüle
      </button>
      <button
        className="text-xl font-semibold text-white border-2 rounded-lg p-3 cursor-pointer hover:bg-white hover:text-secondary hover:border-secondary transition-all duration-200 ease-in tracking-wide mt-4"
        onClick={() => navigate("/GeometryViewer")}
      >
        VTP Dosyası Görüntüle
      </button>
    </div>
  );
};

export default Upload;
