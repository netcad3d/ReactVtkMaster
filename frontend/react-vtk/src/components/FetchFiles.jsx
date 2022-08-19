import React, { useEffect, useState } from "react";
import axios from "axios";
import Poly from "./Poly";

import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

const FetchFiles = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/fetchFiles")
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchButton = (e) => {
    e.preventDefault();

    axios
      .get("http://localhost:3000/fetchFiles")
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteFile = (e, _id) => {
    e.preventDefault();

    Swal.fire({
      title: "Emin misin?",
      text: "Bu işlem geri döndürülemez!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Yoo Silme!",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Evet, sil!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Başarıyla silindi!", "Silindi Babuş", "success");

        axios
          .delete(`http://localhost:3000/deleteFile/${_id}`)
          .then((res) => {
            res.status === 200
              ? toast.success("Başarıyla silindi.", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                })
              : toast.error("Silerken hata oluştu babuş.", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                });
            setFiles(res.data);
          })
          .catch((err) => {
            console.log(err);
          });

        setTimeout(() => {
          fetchButton(e);
        }, 0);
      }
    });
  };

  const viewFileHandler = (e, filesToSend, _id) => {
    e.preventDefault();

    navigate(`/poly`, { state: { filesToSend, _id } });
  };

  const viewAllAVtkFiles = (e, files) => {
    e.preventDefault();

    if (files.length === 0) {
      Swal.fire({
        title: "Hata",
        text: "Lütfen bir dosya seçiniz!",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Tamam",
      });
    } else {
      navigate(`/ManyRenderers`, { state: { files } });
    }
  };

  const deleteAll = (files) => {
    if (files.length === 0) {
      Swal.fire({
        title: "Hata",
        text: "Henüz bir dosya yüklemediniz!",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Tamam",
      });
    } else {
      Swal.fire({
        title: "Emin misin gardaş?",
        text: "Bakhele!! Bu işlem geri döndürülemez ve tüm dosyalar silinecektir!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Yoo Silme!",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Evet, sil gardaş!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Başarıyla silindi!", "Silindi Babuş", "success");
          axios
            .delete(`http://localhost:3000/deleteAllFiles`)
            .then((res) => {
              res.status === 200
                ? toast.success("Başarıyla silindi.", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  })
                : toast.error("Silerken hata oluştu babuş.", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  });
              setFiles([]);
            })
            .catch((err) => {
              console.log(err);
            })
            .then(() => {
              fetchButton(e);
            });
        }
      });
    }
  };

  return (
    <>
      <div className="flex items-center flex-col md:flex-row mb-10 ">
        <button
          className="btn-primary text-lg md:w-[200px] mt-3 w-full md:mr-3"
          onClick={(e) => viewAllAVtkFiles(e, files)}
        >
          Tümünü Görüntüle
        </button>
        <button
          className="btn-primary md:w-[200px] mt-3 w-full md:mr-3"
          onClick={fetchButton}
        >
          Dosyaları Getir
        </button>
        <button
          className="btn-primary md:w-[200px] mt-3 w-full"
          onClick={() => deleteAll(files)}
        >
          Tüm Dosyaları Sil
        </button>
      </div>
      {files.length === 0 ? (
        <div className="w-full p-3 mt-5 rounded-lg border-2 border-secondary flex flex-col">
          <div className="text-white text-2xl font-semibold tracking-wide text-center">
            Dosya Bulunamadı
          </div>
        </div>
      ) : (
        files.map((file, index) => (
          <div
            key={index}
            className="flex w-full p-3 mt-5 rounded-lg border-2 border-secondary justify-between items-center flex-col md:flex-row"
          >
            <div className="flex flex-col w-full">
              <p className="text-white text-lg">
                <span className="text-secondary">File Name: </span>
                {file.name}
              </p>
              <p className="text-white text-lg">
                <span className="text-secondary">File Extension: </span>{" "}
                {file.extension}
              </p>
              <p className="text-white text-lg">
                <span className="text-secondary">File Size: </span>{" "}
                {file.size / 1000000} mb
              </p>
              <p className="text-white text-lg hidden md:block">
                <span className="text-secondary ">File Url: </span> {file.url}
              </p>
              <p className="text-white text-lg hidden md:block">
                <span className="text-secondary ">File Id: </span> {file._id}
              </p>
            </div>
            <div className="flex justify-end mt-3 md:mt-0 flex-col md:flex-row w-full">
              <button
                className="text-lg md:text-xl font-semibold btn-primary mr-2 w-full md:w-[200px]"
                onClick={(e) => deleteFile(e, file._id)}
              >
                Dosyayı Sil
              </button>
              <button
                onClick={(e) => viewFileHandler(e, files, file._id)}
                // onClick={() => onVisualize(file.url)}
                className="text-lg md:text-xl font-semibold btn-primary w-full md:w-[200px] mt-2 md:mt-0"
              >
                Görüntüle
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default FetchFiles;
