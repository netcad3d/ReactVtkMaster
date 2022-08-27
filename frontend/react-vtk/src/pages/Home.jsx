import React, { useState } from "react";
import { useSelector } from "react-redux";

import Upload from "../components/Upload";
import Preview from "../components/Preview";
import FetchFiles from "../components/FetchFiles";
import LandingPage from "./LandingPage";

const Home = () => {
  const [files, setFiles] = useState([]);
  const onSuccess = (savedFiles) => {
    setFiles(savedFiles);
  };
  const authProps = useSelector((state) => state.auth);
  console.log(authProps);

  // remove canvas element after displaying it
  const els=document.getElementsByTagName("canvas")
  //console.log(els)
  if(els.length>0){

	els.item('0').remove();

} 
  
 

  return (
    <>
      {authProps._id && authProps.verified === true ? (
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
                    Yüklenenen Dosya
                  </h1>
                </div>
                <div className="flex flex-col mt-3 justify-center items-center">
                  <Preview files={files} />
                </div>
              </div>
            </div>
          </div>
          <div className=" border-t-2 border-secondary w-[90%]">
            <h1 className="text-2xl text-white font-semibold tracking-wide text-center mt-3 mb-5">
              Serverdaki Dosyalar
            </h1>
            <FetchFiles />
          </div>
        </div>
      ) : (
        <LandingPage />
      )}
    </>
  );
};

export default Home;
