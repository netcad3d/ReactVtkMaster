import React from "react";

import { useNavigate } from "react-router-dom";

const Auth = ({ title, button, navigate, navigateTitle, navigateLink }) => {
  const navigation = useNavigate();

  return (
    <div className="flex flex-col h-[100vh] justify-center items-center">
      <div className="flex w-[80%] md:w-[50%] border-2 border-secondary rounded-lg flex-col justify-center items-center">
        <h1
          className="text-white font-bold text-2xl mt-5 text-center"
          style={{ fontFamily: '"Exo-2", sans-serif' }}
        >
          {title}
        </h1>
        <div className="shadow-lg p-8 text-secondary md:w-[500px]">
          <form action="" className="flex flex-col space-y-4">
            {title === "Hesap Oluştur" ? (
              <div>
                <label for="" className="text-sm ">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Kullanıcı Adı"
                  className="ring-1 ring-gray-300 w-full rounded-md mt-2 px-4 py-2 outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            ) : null}
            <div>
              <label for="" className="text-sm ">
                Email
              </label>
              <input
                type="text"
                required
                placeholder="Email"
                className="ring-1 ring-gray-300 w-full rounded-md mt-2 px-4 py-2 outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label for="" className="text-sm">
                Şifre
              </label>
              <input
                type="text"
                required
                placeholder="Şifre"
                className="ring-1 ring-gray-300 w-full rounded-md mt-2 px-4 py-2 outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="flex justify-end">
              <button className="btn-secondary text-sm w-full ss:w-[200px] md:text-base p-2">
                {button}
              </button>
            </div>
            <div
              className="flex justify-center items-center"
              style={{ fontFamily: '"Exo-2", sans-serif' }}
            >
              <p className="text-sm text-white">
                {navigate}{" "}
                <span
                  onClick={() => navigation(`${navigateLink}`)}
                  className="cursor-pointer text-secondary hover:text-secondaryDark transition-all duration-100"
                >
                  {navigateTitle}
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
