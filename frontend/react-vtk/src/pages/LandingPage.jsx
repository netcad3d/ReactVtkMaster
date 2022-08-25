import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import Swal from "sweetalert2";
import HeroImage from "/NETPROMine.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (auth.registerStatus === "success" && !auth.verified) {
      Swal.fire({
        title: `${auth.email} adresine onay maili gönderildik. Devam edebilmek için lütfen mailinize gelen linki onaylayın.`,
        icon: "info",
        confirmButtonText: "Tamam",
      });
    }
  }, [auth.registerStatus]);

  return (
    <div className="flex flex-col justify-center items-center bg-primary h-[100vh]">
      <div className="flex justify-center items-center md:mt-0 md:w-[80%]">
        <div className="flex justify-center items-center md:h-[100%] md:w-[100%] flex-col md:flex-row">
          <div className="flex flex-[1.5] justify-center items-center text-white p-5">
            <img
              src={HeroImage}
              alt="Hero Image"
              className="bg-cover mb-[30px] md:mb-0 md:mr-[80px] md:w-full rounded-lg border-2 border-secondary"
            />
          </div>
          <div
            className="flex flex-[1] justify-center items-center border-t-2 md:border-l-2 md:border-t-0 border-secondary h-[100%] w-[90%] p-3"
            style={{ fontFamily: '"Exo-2", sans-serif' }}
          >
            <div className="flex p-4 text-center flex-col md:ml-[30px]">
              <h1 className="text-white text-3xl md:text-4xl capitalize font-semibold">
                VTK dosyalarını artık webde görüntelemek çok kolay !
              </h1>
              <div className="mt-3">
                <p className="text-white text-lg">
                  Hemen başlamak için{" "}
                  <span
                    className="text-secondary cursor-pointer hover:text-secondaryDark transition-all duration-100 ease-in-out"
                    onClick={() => navigate("/signup")}
                  >
                    Kaydol
                  </span>{" "}
                </p>
                <p className="text-white text-lg">
                  Hesabın var mı?{" "}
                  <span
                    className="text-secondary cursor-pointer hover:text-secondaryDark transition-all duration-100 ease-in-out"
                    onClick={() => navigate("/login")}
                  >
                    Giriş Yap
                  </span>{" "}
                </p>
                <div
                  className="h-[3px] w-[100%] md:w-full bg-secondary rounded-md mt-6 mb-3"
                  style={{
                    boxShadow: "0px 0px 20px 2px rgba(0, 188, 239, 1)",
                  }}
                />
                <div className="flex justify-start">
                  <p className="text-white text-xl mt-4">
                    Desteklenen Formatlar{" "}
                    <span className="text-secondary">
                      <a
                        href="https://kitware.github.io/vtk-examples/site/VTKFileFormats/#legacy-file-examples"
                        target="blank"
                        className="hover:text-secondaryDark transition-all duration-100 ease-in-out"
                      >
                        .vtk{" "}
                      </a>
                      |{" "}
                      <a
                        href="https://kitware.github.io/vtk-examples/site/VTKFileFormats/#polydata"
                        target="blank"
                        className="hover:text-secondaryDark transition-all duration-100 ease-in-out"
                      >
                        .vtp{" "}
                      </a>{" "}
                      |{" "}
                      <a
                        href="https://kitware.github.io/vtk-examples/site/VTKFileFormats/#imagedata"
                        target="blank"
                        className="hover:text-secondaryDark transition-all duration-100 ease-in-out"
                      >
                        .vti{" "}
                      </a>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
