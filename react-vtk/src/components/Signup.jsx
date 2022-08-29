import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/authSlice";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import Swal from "sweetalert2";

const Signup = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown((prev) => !prev);
  };

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(registerUser(user));
    e.target.reset();
    navigate("/");
  };

  useEffect(() => {
    if (auth.registerStatus === "rejected") {
      Swal.fire({
        title: `${auth.registerError}`,
        icon: "error",
        confirmButtonText: "Tamam",
      });
    }
    if (auth.registerStatus === "success") {
      Swal.fire({
        title: `${auth.email} adresine onay maili gönderildik. Devam edebilmek için lütfen mailinize gelen linki onaylayın.`,
        icon: "info",
        confirmButtonText: "Tamam",
      });
    }
  }, [auth.registerStatus]);

  return (
    <div className="flex flex-col h-[100vh] justify-center items-center">
      <div className="flex w-[80%] md:w-[50%] border-2 border-secondary rounded-lg flex-col justify-center items-center">
        <h1
          className="text-white font-bold text-2xl mt-5 text-center"
          style={{ fontFamily: '"Exo-2", sans-serif' }}
        >
          Hesap Oluştur
        </h1>
        <div className="shadow-lg p-8 text-secondary md:w-[500px]">
          <form
            action=""
            className="flex flex-col space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="username" className="text-sm ">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                type="text"
                placeholder="Kullanıcı Adı"
                className="ring-1 ring-gray-300 w-full rounded-md mt-2 px-4 py-2 outline-none focus:ring-2 focus:text-primary focus:ring-white focus:bg-secondary placeholder:text-primary"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm ">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="ring-1 ring-gray-300 w-full rounded-md mt-2 px-4 py-2 outline-none focus:ring-2 focus:text-primary focus:ring-white focus:bg-secondary placeholder:text-primary"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="pass-wrapper">
              <label htmlFor="password" className="text-sm">
                Şifre
              </label>
              {""}
              <input
                className="ring-1 ring-gray-300 w-full rounded-md mt-2 px-4 py-2 outline-none focus:ring-2 focus:text-primary focus:ring-white focus:bg-secondary placeholder:text-primary"
                placeholder="Password"
                id="password"
                name="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type={passwordShown ? "text" : "password"}
                required
              />
              <div className="mt-1">
                {passwordShown ? (
                  <AiFillEyeInvisible
                    onClick={togglePasswordVisiblity}
                    size={25}
                  />
                ) : (
                  <AiFillEye onClick={togglePasswordVisiblity} size={25} />
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button className="btn-secondary text-sm w-full ss:w-[200px] md:text-base p-2">
                {auth.registerStatus === "pending" ? "Gönderliyor" : "Kaydol"}
              </button>
            </div>
            <div
              className="flex justify-center items-center"
              style={{ fontFamily: '"Exo-2", sans-serif' }}
            >
              <p className="text-sm text-white">
                Hesabınız var mı?{" "}
                <span
                  onClick={() => navigate(`/login`)}
                  className="cursor-pointer text-secondary hover:text-secondaryDark transition-all duration-100"
                >
                  Oturum Aç
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
