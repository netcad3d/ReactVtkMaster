import { useState } from "react";
import axios from "axios";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `https://netcad-vtk.herokuapp.com/api/password-reset`;
      const { data } = await axios.post(url, { email });
      setMsg(data.message);

      setError("");
      //navigate(`/s`)
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
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <div className="flex flex-col w-[70%] md:w-[30%] md:h- border-2 border-secondary rounded-lg">
        <form className="p-8" onSubmit={handleSubmit}>
          <h1
            className="text-white font-bold text-2xl mt-5 text-center"
            style={{ fontFamily: '"Exo-2", sans-serif' }}
          >
            Şifremi Unuttum
          </h1>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="ring-1 ring-gray-300 w-full rounded-md mt-[20px] px-4 py-2 outline-none focus:ring-2 focus:text-primary focus:ring-white focus:bg-secondary placeholder:text-primary "
          />
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
          <button className="btn-secondary w-full mt-6" type="submit">
            Gönder
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
