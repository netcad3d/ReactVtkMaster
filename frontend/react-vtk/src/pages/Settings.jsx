import React from "react";

import styles from "../Styling/forgotPass.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../slices/authSlice";

import Swal from "sweetalert2";

import { GoVerified, GoUnverified } from "react-icons/go";

const Settings = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
	e.preventDefault();
	const url = `https://netcad-vtk.herokuapp.com/api/delete-account/${auth._id}`;
	console.log(url);

	try {
		Swal.fire({
			title: "Emin misin?",
			text: "Bu işlem geri döndürülemez!Dosyalarınız ve hesabınız silinecektir.",
			icon: "warning",
			showCancelButton: true,
			cancelButtonText: "Vazgeç!",
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Evet, sil!",
		  }).then(async(result) => {
			if (result.isConfirmed) {
			  Swal.fire("Hesabınız Başarıyla silindi :(", "Silindi", "success");
			
		const { data } = await axios.delete(url);
		setMsg(data.message);
		//if(data.message === "User deleted successfully") 
		setError("");
		//window.location = "/login";
		dispatch(logoutUser(null));
				navigate("/login");}});
	} catch (error) {
		if (
			error.response &&
			error.response.status >= 400 &&
			error.response.status <= 500
		) {
			setError(error.response.data.message);
			setMsg("");
		}
	}
};


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
		<form onSubmit={handleSubmit}>
			{error && <div className={styles.error_msg}>{error}</div>}
						{msg && <div className={styles.success_msg}>{msg}</div>}
			<button
			type="submit"
            className="btn-secondary w-full md:w-[300px] mt-6"
          >
            Hesabı sil
          </button>
			</form>
         
        </div>
      </div>
    </div>
  );
};

export default Settings;
