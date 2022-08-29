import React, { useRef, useEffect } from "react";
import lottie from "lottie-web";
import notFound from "../assets/404.json";

const NotFound = () => {
  const notFoundRef = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      name: "verify",
      container: notFoundRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: notFound,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    return () => {
      lottie.destroy();
    };
  }, []);

  return (
    <div className="flex justify-center items-center bg-primary">
      <div className="flex flex-col justify-center items-center w-[90%] md:w-full mt-[200px]">
        <div className="flex-[4] " ref={notFoundRef} />
        <div className="flex flex-[1] justify-center items-center mt-[50px] md:mt-[100px]">
          <h1
            className="text-6xl md:text-7xl text-center text-secondary tracking-wider"
            style={{
              fontFamily: "FairProsper, sans-serif",
              rotate: "-5deg",
            }}
          >
            Sayfa Bulunamadı
          </h1>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
