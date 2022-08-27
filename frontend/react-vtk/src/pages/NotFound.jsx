import React, { useRef, useEffect } from "react";
import lottie from "lottie-web";
import coffin from "../assets/coffinDance.json";
import "../../src/index.css";

const NotFound = () => {
  const coffinRef = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      name: "verify",
      container: coffinRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: coffin,
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
      <div className="flex flex-col justify-center w-[80%] md:w-[60%] h-[70%] ">
        <div
          className="flex-[4] items-start w-[100%] md:w-[100%] md:h-[300px] "
          ref={coffinRef}
        />
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
