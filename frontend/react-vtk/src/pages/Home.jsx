import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


import Upload from "../components/Upload";
import Preview from "../components/Preview";
import FetchFiles from "../components/FetchFiles";


const Home = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const onSuccess = (savedFiles) => {
    setFiles(savedFiles);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-primary ">
      <div className="flex flex-col w-full h-[100vh] md:h-[90vh] justify-center items-center md:flex-row ">
        <div
          className="flex  justify-center items-center w-full"
          style={{ flex: 1 }}
        >
          <Upload onSuccess={onSuccess} />
        </div>
        <div
          className="flex justify-center border-secondary border-t-2 md:border-l-2 md:border-t-0 w-[90%] md:h-[500px] md:mt-3"
          style={{ flex: 1 }}
        >
          <div className="flex flex-col w-full">
            <div>
              <h1
                className="text-2xl text-white font-semibold tracking-wide text-center mt-3"
                style={{ fontFamily: '"Exo-2", sans-serif' }}
              >
                Yüklenenen Dosyalar
              </h1>
            </div>
            <div className="flex flex-col mt-3 justify-center items-center">
              <Preview files={files} />
            </div>
          </div>
        </div>
      </div>
      <div className=" border-t-2 border-secondary w-[90%]">
        <h1 className="text-2xl text-white font-semibold tracking-wide text-center mt-3">
          Serverdaki Dosyalar
        </h1>
        <FetchFiles />
      </div>
    </div>
  );
};

export default Home;
