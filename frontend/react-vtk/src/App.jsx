import React from "react";
import { useState } from "react";

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Clip from "./components/Clip";
import Poly from "./components/Poly";
import SphereClip from "./components/SphereClip";
import VolumeClip from "./components/VolumeClip";
import VolumeViewer from "./components/VolumeViewer";
import GeometryViewer from "./components/GeometryViewer";
import Three from "./components/Three";
import Auth from "./components/Auth";
import ManyRenderers from "./components/ManyRenderers";

function App() {
  const [realUrl, setRealUrl] = useState("");
  const handlePassUrl = (url) => {
    setRealUrl(url);
  };
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/poly" element={<Poly />} />
      <Route path="/clip" element={<Clip />} />
      <Route path="/sphereClip" element={<SphereClip />} />
      <Route path="/VolumeViewer" element={<VolumeViewer />} />
      <Route path="/VolumeClip" element={<VolumeClip />} />
      <Route path="/GeometryViewer" element={<GeometryViewer />} />
      <Route
        path="/ManyRenderers"
        element={<ManyRenderers></ManyRenderers>}
      ></Route>
      <Route path="/Three" element={<Three />} />
      <Route
        path="/signup"
        element={
          <Auth
            title="Hesap Oluştur"
            button="Kaydol"
            navigate="Hesabınız var mı?"
            navigateTitle="Oturum Aç"
            navigateLink="/login"
          />
        }
      />
      <Route
        path="/login"
        element={
          <Auth
            title="Oturum Aç"
            button="Giriş Yap"
            navigate="Kullanıcı hesabınız yok mu?"
            navigateTitle="Hesap Oluştur"
            navigateLink="/signup"
          />
        }
      />
    </Routes>
  );
}
export default App;
