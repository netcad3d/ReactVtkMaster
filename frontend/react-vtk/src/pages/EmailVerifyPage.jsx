import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import axios from "axios";

import EmailVerify from "../components/EmailVerify";
import NotFound from "./NotFound";

const EmailVerifyPage = () => {
  const [validUrl, setValidUrl] = useState(false);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:3000/${param.id}/verify/${param.token}`;
        const { data } = await axios.get(url);
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
