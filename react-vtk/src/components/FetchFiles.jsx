import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Swal from "sweetalert2";

const FetchFiles = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const { token } = auth;

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
	fetchFromAPI('fetchFiles',token)
	.then(data=> {
		setFiles(data);
	})
	
 /*   axios
      .get("http://localhost:3000/fetchFiles", config)
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });*/
  }, []);

  const fetchButton = (e) => {
    e.preventDefault();

	fetchFromAPI('fetchFiles',token)
	.then(data=> {
		setFiles(data);
	})
	
  };

  const deleteFile = (e, fileId) => {
    e.preventDefault();

    Swal.fire({
      title: "Emin misin?",
      text: "Bu işlem geri döndürülemez!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Vazgeç!",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Evet, sil!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Başarıyla silindi!", "Silindi", "success");

        axios
          .delete(`https://netcad-vtk.herokuapp.com/deleteFile/${fileId}`, config)
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

  const viewFileHandler = (fileId) => {
    navigate(`/poly`, { state: { fileId } });
  };

  const viewAllAVtkFiles = (e, files) => {
    e.preventDefault();

    if (files.length === 0) {
      Swal.fire({
        title: "Hata",
        text: "Henüz bir dosya yüklemediniz!",
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
        title: "Emin misin?",
        text: "Bu işlem geri döndürülemez ve tüm dosyalar silinecektir!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Vazgeç",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Evet, sil!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Başarıyla silindi!", "", "success");
          axios
            .delete(`http://localhost:3000/deleteAllFiles`, config)
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
                : toast.error("Silerken hata oluştu.", {
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
          className="btn-primary md:w-[220px] mt-3 w-full md:mr-3"
          onClick={(e) => viewAllAVtkFiles(e, files)}
          style={{ fontFamily: '"Exo-2", sans-serif' }}
        >
          Tümünü Görüntüle
        </button>
        <button
          className="btn-primary md:w-[200px] mt-3 w-full md:mr-3"
          onClick={fetchButton}
          style={{ fontFamily: '"Exo-2", sans-serif' }}
        >
          Dosyaları Getir
        </button>
        <button
          className="btn-primary md:w-[220px] mt-3 w-full"
          onClick={() => deleteAll(files)}
          style={{ fontFamily: '"Exo-2", sans-serif' }}
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
                {file.originalName}
              </p>
              <p className="text-white text-lg">
                <span className="text-secondary">File Extension: </span>{" "}
                {file.originalName.split(".")[1]}
              </p>
              <p className="text-white text-lg">
                <span className="text-secondary">File Size: </span>{" "}
                {file.size / 1000000} mb
              </p>
              <p className="text-white text-lg hidden md:block">
                <span className="text-secondary ">File Upload Date: </span>{" "}
                {file.uploadDate}
              </p>
              <p className="text-white text-lg hidden md:block">
                <span className="text-secondary ">File Id: </span> {file.fileId}
              </p>
            </div>
            <div className="flex justify-end mt-3 md:mt-0 flex-col md:flex-row w-full">
              <button
                className="text-lg md:text-xl font-semibold btn-primary mr-2 w-full md:w-[200px]"
                onClick={(e) => deleteFile(e, file.fileId)}
              >
                Dosyayı Sil
              </button>
              <button
                onClick={(e) => viewFileHandler(file.fileId)}
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
