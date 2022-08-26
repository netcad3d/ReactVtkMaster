import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import lottie from "lottie-web";
import verify from "../assets/verify.json";

const EmailVerify = () => {
  const navigate = useNavigate();
  const verifyRef = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      name: "verify",
      container: verifyRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: verify,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    return () => {
      lottie.destroy();
    };
  }, []);

  return (
    <div className="flex justify-center items-center bg-primary h-[100vh]">
      <div className="p-4 flex flex-col justify-center items-center w-[90%] md:w-[60%] h-[60%] border-2 border-secondary rounded-lg">
        <div className="flex-[2] w-[full] h-[300px] mt-5" ref={verifyRef} />
        <div className="flex-[1] flex justify-center items-center flex-col mt-3">
          <h1 className=" text-white text-2xl text-center">
            Email Başarıyla Doğrulandı!
          </h1>
          <button
            className="btn-secondary w-full md:w-[300px] mt-6"
            onClick={() => {
              navigate("/login");
            }}
          >
            Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
