import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import axios from "axios";

import { verifyToAPI } from "../utils/fetchFromAPI";

import EmailVerify from "../components/EmailVerify";
import NotFound from "./NotFound";

const EmailVerifyPage = () => {
  const [validUrl, setValidUrl] = useState(false);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `https://netcad-vtk.herokuapp.com/${param.id}/verify/${param.token}`;
        const data = verifyToAPI(url);
        console.log(data);
        localStorage.setItem("verify", data.verified);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };

    verifyEmailUrl();
  }, [param]);

  return <>{validUrl ? <EmailVerify /> : <NotFound />}</>;
};

export default EmailVerifyPage;
