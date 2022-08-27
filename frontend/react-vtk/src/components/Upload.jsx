import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReactTooltip from "react-tooltip";
import { useSelector } from "react-redux";

import axios from "axios";
import Swal from "sweetalert2";

const Upload = ({ onSuccess }) => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const { token } = auth;

  const onInputChange = (e) => {
    setFiles(e.target.files);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    const config = { headers: { Authorization: `Bearer ${token}` } };

    for (let i = 0; i < files.length; i++) {
      data.append("file", files[i]);
    }

    if (files.length === 0) {
      Swal.fire({
        title: "Hata",
        text: "Lütfen bir dosya seçiniz!",
        icon: "error",
      });
    } else {
      axios
        .post("http://localhost:3000/uploads", data, config)
        .then((res) => {
          res.status === 200
            ? toast.success("Başarıyla Yüklendi.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              })
            : toast.error("Yüklerken Hata Oluştu", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
          const fileArray = [];
          fileArray.push(res.data);
          onSuccess(fileArray);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="flex flex-col w-full md:w-[500px] items-center justify-center mb-3 md:mb-0 mt-[100px] md:mt-0">
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
          encType="multipart/form-data"
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
            data-for="upload"
            data-tip="Legacy Poly Data Dosyalarını Görüntüleyin"
          >
            <ReactTooltip
              id="upload"
              effect="solid"
              backgroundColor="#13285d"
              borderColor="#00BCEF"
              border={true}
            />
            NC3 Dosyası Seç
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
        data-for="uploadVTI"
        data-tip="VTI Dosyalarını Clip Fonksiyonu ile Görüntüleyin"
      >
        <ReactTooltip
          id="uploadVTI"
          effect="solid"
          backgroundColor="#13285d"
          borderColor="#00BCEF"
          border={true}
          place="right"
        />
        VTI Dosyası Görüntüle
      </button>
      <button
        className="btn-primary w-[90%] mt-4"
        onClick={() => navigate("/GeometryViewer")}
        data-for="uploadVTP"
        data-tip=".VTP ve .Web3D Dosyalarını Görüntüleyin"
      >
        <ReactTooltip
          id="uploadVTP"
          effect="solid"
          backgroundColor="#13285d"
          borderColor="#00BCEF"
          border={true}
          place="bottom"
        />
        VTP Dosyası Görüntüle
      </button>
    </div>
  );
};

export default Upload;
