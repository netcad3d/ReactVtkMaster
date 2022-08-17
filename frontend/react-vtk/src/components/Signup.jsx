import React from "react";

const Signup = () => {
  return (
    <div className="flex h-auto m-auto mt-20 mb-20 justify-center items-center">
      <div className="flex w-[80%] border-2 border-secondary rounded-lg flex-col ">
        <h1
          className="text-white font-bold text-2xl mt-[30px] ml-[30px]"
          style={{ fontFamily: '"Exo-2", sans-serif' }}
        >
          Kayıt Olun
        </h1>
        <div className="shadow-lg p-8 text-gray-600 md:w-80">
          <form action="" className="flex flex-col space-y-4">
            <div>
              <label for="" className="text-sm ">
                Email
              </label>
              <input
                type="text"
                placeholder="Email"
                className="ring-1 ring-gray-300 w-full rounded-md mt-2 px-4 py-2 outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div>
              <label for="" className="text-sm">
                Şifre
              </label>
              <input
                type="text"
                placeholder="Şifre"
                className="ring-1 ring-gray-300 w-full rounded-md mt-2 px-4 py-2 outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div className="flex justify-end">
              <button className="btn-primary text-sm w-full xxs:w-[150px] md:w-[200px]">
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
