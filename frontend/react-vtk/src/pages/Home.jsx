import React, { useState } from "react";

import Upload from "../components/Upload";
import Preview from "../components/Preview";
import FetchFiles from "../components/FetchFiles";
import Clip from "../components/Clip";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const onSuccess = (savedFiles) => {
    setFiles(savedFiles);
  };

  return (
    <div className="flex flex-col justify-center items-center bg-primary">
      <div className="flex w-full h-[70vh] justify-center items-center md:flex-row sm:flex-col">
        <div
          className="flex h-[500px] justify-center items-center"
          style={{ flex: 1 }}
        >
          <Upload onSuccess={onSuccess} />
        </div>
        <div
          className="flex h-[500px] justify-center border-l-2 border-secondary"
          style={{ flex: 1 }}
        >
          <div className="flex flex-col w-full">
            <div>
              <h1
                className="text-2xl text-white font-semibold tracking-wide text-center"
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
      <div className=" border-t-2 border-secondary w-[70%]">
        <div className="p-[40px]">
          <h1 className="text-2xl text-white font-semibold tracking-wide text-center">
            Serverdaki Dosyalar
          </h1>

        </div>
		<button
				className="text-lg font-semibold text-white border-2 rounded-lg p-3 w-[200px] cursor-pointer hover:bg-white hover:text-secondary hover:border-secondary transition-all duration-200 ease-in tracking-wide"
				onClick={() => navigate("/ManyRenderers")}
			>
				Tümünü Görüntüle
		</button>
        <FetchFiles />
	
      </div>
    </div>
  );
};

export default Home;
