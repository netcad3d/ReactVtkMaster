import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotFound from "../pages/NotFound";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ResetPass = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const param = useParams();

  const URL = `https://netcad-vtk.herokuapp.com/api/password-reset/${param.id}/${param.token}`;

  useEffect(() => {
    const verifyUrl = async () => {
      try {
        await axios.get(URL);
        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);
      }
    };
    verifyUrl();
  }, [param, URL]);

  const togglePasswordVisiblity = () => {
    setPasswordShown((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(URL, { password });
      setMsg(data.message);
      setError("");
      window.location = "/login";
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
    <>
      {validUrl ? (
        <div className="h-[100vh] w-[100vw] flex justify-center items-center">
          <div className="flex flex-col w-[70%] md:w-[30%] md:h- border-2 border-secondary rounded-lg">
            <form className="p-8" onSubmit={handleSubmit}>
              <h1
                className="text-white font-bold text-2xl mt-5 text-center"
                style={{ fontFamily: '"Exo-2", sans-serif' }}
              >
                Yeni Şifre Belirle
              </h1>
              <input
                type={passwordShown ? "text" : "password"}
                placeholder="Yeni Şifre"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="ring-1 ring-gray-300 w-full rounded-md mt-[20px] px-4 py-2 outline-none focus:ring-2 focus:text-primary focus:ring-white focus:bg-secondary placeholder:text-primary "
              />
              <div className="mt-1 text-secondary cursor-pointer">
                {passwordShown ? (
                  <AiFillEyeInvisible
                    onClick={togglePasswordVisiblity}
                    size={25}
                  />
                ) : (
                  <AiFillEye onClick={togglePasswordVisiblity} size={25} />
                )}
              </div>
              {error && (
                <div className="flex justify-center items-center w-full bg-red-600 rounded-lg text-center mt-3 h-[50px] text-white text-xl">
                  {error}
                </div>
              )}
              {msg && (
                <div className="flex justify-center items-center w-full bg-green-600 rounded-lg text-center mt-3 h-[50px] text-white text-xl">
                  {msg}
                </div>
              )}
              <button type="submit" className="btn-secondary w-full mt-6">
                Şifreyi Değiştir
              </button>
            </form>
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default ResetPass;
