import React, { useEffect, useState } from "react";
import axios from "axios";
import Poly from "./Poly";

import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SphereClip from "./SphereClip";

const FetchFiles = ({ handleUrl }) => {
  const [files, setFiles] = useState([]);
  const [urlTo, seturlTo] = useState("");
  const [htmlPart, setHtmlPart] = useState(null);
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

  const deleteFile = (e, name) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:3000/deleteFile/${name}`)
      .then((res) => {
        res.status === 200
          ? toast.success("File Deleted Succesfully", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            })
          : toast.error("Error Deleting File", {
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
  };

  // function onVisualize(url) {
  //   setHtmlPart(
  //     <div>
  //       <Routes>
  //         <Route path="*" element={<Poly url={url} />} />
  //       </Routes>
  //     </div>
  //   );
  // }

  const viewFileHandler = (e, url) => {
    e.preventDefault();
    navigate(`/poly`, { state: { url } });
  };

  return (
    <>
      <button
        className="text-xl font-semibold text-white border-2 rounded-lg p-3 w-[200px] cursor-pointer hover:bg-white hover:text-secondary hover:border-secondary transition-all duration-200 ease-in tracking-wide"
        onClick={fetchButton}
      >
        Dosyaları Getir
      </button>
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
            className="w-full p-3 mt-5 rounded-lg border-2 border-secondary flex justify-between items-center"
          >
            <div className="flex flex-col">
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
              <p className="text-white text-lg">
                <span className="text-secondary">File Url: </span> {file.url}
              </p>
            </div>
            <div className="justify-end">
              <button
                className="text-xl font-semibold text-white border-2 rounded-lg p-3 w-[200px] cursor-pointer hover:bg-white hover:text-secondary hover:border-secondary transition-all duration-200 ease-in tracking-wide mr-2"
                onClick={(e) => deleteFile(e, file.name)}
              >
                Dosyayı Sil
              </button>
              <button
                onClick={(e) => viewFileHandler(e, file.url)}
                // onClick={() => onVisualize(file.url)}
                className="text-xl font-semibold text-white border-2 rounded-lg p-3 w-[200px] cursor-pointer hover:bg-white hover:text-secondary hover:border-secondary transition-all duration-200 ease-in tracking-wide"
              >
                Görüntüle
              </button>
              {/* <div>{htmlPart ? htmlPart : ""}</div> */}
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default FetchFiles;
