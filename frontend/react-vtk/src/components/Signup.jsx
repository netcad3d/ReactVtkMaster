import React from "react";

const Signup = () => {
  return (
    <div className="flex h-[100vh] justify-center items-center">
      <div className="flex w-[80%] md:w-[50%] border-2 border-secondary rounded-lg flex-col justify-center items-center">
        <h1
          className="text-white font-bold text-2xl mt-5 text-center"
          style={{ fontFamily: '"Exo-2", sans-serif' }}
        >
          Kayıt Olun
        </h1>
        <div className="shadow-lg p-8 text-secondary md:w-[500px]">
          <form action="" className="flex flex-col space-y-4">
            <div>
              <label for="" className="text-sm ">
                Email
              </label>
              <input
                type="text"
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
                placeholder="Şifre"
                className="ring-1 ring-gray-300 w-full rounded-md mt-2 px-4 py-2 outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="flex justify-end">
              <button className="btn-secondary text-sm w-full ss:w-[200px] md:text-lg">
                Kayıt Ol
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
