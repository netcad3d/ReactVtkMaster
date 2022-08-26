import React from "react";

import { useSelector } from "react-redux";
import { GoVerified, GoUnverified } from "react-icons/go";

const Settings = () => {
  const auth = useSelector((state) => state.auth);

  return (
    <div className="flex justify-center items-center bg-primary h-[100vh]">
      <div className="p-4 flex flex-col justify-center items-center w-[95%] md:w-[60%] h-[70%] md:h-[60%] border-2 border-secondary rounded-lg">
        <div className="h-[70%] w-[100%]">
          <h1 className="text-white text-4xl text-center tracking-wider">
            Kullanıcı Bilgileri
          </h1>
          <ul
            className="flex flex-col mt-[40px] md:mt-[80px] justify-center"
            style={{ fontFamily: '"Exo-2", sans-serif' }}
          >
            <li className="p-4 md:flex">
              <div className="flex w-[100%] flex-col md:flex-row">
                <p className="text-xl text-white">Kullanıcı Adı:</p>
                <p className="text-xl text-secondary md:ml-1">
                  {auth.username}
                </p>
              </div>
            </li>
            <li className="p-4 flex">
              <div className="w-[100%] ">
                <div className="flex w-[100%] flex-col md:flex-row">
                  <p className="text-xl text-white">Kullanıcı Adı:</p>
                  <p className="text-xl text-secondary md:ml-1 ">
                    {auth.email}
                  </p>
                </div>
              </div>
            </li>
            <li className="p-4 flex">
              <div className="w-[100%] ">
                <div className="flex w-[100%] flex-col md:flex-row">
                  <p className="text-xl text-white">Email Doğrulama:</p>
                  <p className="text-xl text-secondary">
                    {auth.verified === true ? (
                      <div className="md:ml-1 flex items-center">
                        Doğrulandı{" "}
                        <GoVerified
                          className="items-center ml-1 text-green-600"
                          size={20}
                        />
                      </div>
                    ) : (
                      <div className="md:ml-1 flex items-center">
                        Doğrulanmadı{" "}
                        <GoUnverified
                          className="items-center ml-1 text-red-700"
                          size={20}
                        />
                      </div>
                    )}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex-[1] w-full flex justify-center items-center flex-col mt-3">
          <button
            className="btn-secondary w-full md:w-[300px] mt-6"
            onClick={() => navigate("/login")}
          >
            Hesabı sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
