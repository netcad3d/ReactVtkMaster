import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slices/authSlice";

import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  console.log(auth);

  useEffect(() => {
    if (auth._id && auth.verified) {
      navigate("/");
    }
  }, [auth._id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(user));
  };
  useEffect(() => {
    if (auth.loginStatus === "rejected") {
      Swal.fire({
        title: `${auth.loginError}`,
        icon: "error",
      });
    }
  }, [auth.loginStatus]);

  return (
    <div className="flex flex-col h-[100vh] justify-center items-center">
      <div className="flex w-[80%] md:w-[50%] border-2 border-secondary rounded-lg flex-col justify-center items-center">
        <h1
          className="text-white font-bold text-2xl mt-5 text-center"
          style={{ fontFamily: '"Exo-2", sans-serif' }}
        >
          Giriş Yap
        </h1>

        <div className="shadow-lg p-8 text-secondary md:w-[500px]">
          <form
            action=""
            className="flex flex-col space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="email" className="text-sm ">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="ring-1 ring-gray-300 w-full rounded-md mt-2 px-4 py-2 outline-none focus:ring-2 focus:text-primary focus:ring-white focus:bg-secondary placeholder:text-primary "
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                placeholder="Şifre"
                className="ring-1 ring-gray-300 w-full rounded-md mt-2 px-4 py-2 outline-none focus:ring-2 focus:text-primary focus:ring-white focus:bg-secondary placeholder:text-primary"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <button className="btn-secondary text-sm w-full ss:w-[200px] md:text-base p-2">
                {auth.loginStatus === "pending" ? "Gönderiliyor" : "Giriş Yap"}
              </button>
            </div>
            <div
              className="flex justify-center items-center"
              style={{ fontFamily: '"Exo-2", sans-serif' }}
            >
              <p className="text-sm text-white">
                Hesabınız yok mu?
                <span
                  onClick={() => navigate(`/signup`)}
                  className="cursor-pointer text-secondary hover:text-secondaryDark transition-all duration-100"
                >
                  {" "}
                  Hesap Oluştur
                </span>
              </p>
            </div>
            <div className="flex justify-center">
              <p className="text-sm  p-1 text-secondary cursor-pointer hover:text-secondaryDark transition-all duration-100">
                Şifrenizi mi unuttunuz?
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
