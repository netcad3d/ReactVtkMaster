import React from "react";
import { useState } from "react";

import { Routes, Route } from "react-router-dom";
import Clip from "./components/Clip";
import Poly from "./components/Poly";
import SphereClip from "./components/SphereClip";
import VolumeClip from "./components/VolumeClip";
import VolumeViewer from "./components/VolumeViewer";

import Home from "./pages/Home";

function App() {
  const [realUrl, setRealUrl] = useState("");
  const handlePassUrl = (url) => {
    setRealUrl(url);
  };
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/poly" element={<Poly />}></Route>
      <Route path="/clip" element={<Clip />}></Route>
      <Route path="/sphereClip" element={<SphereClip />}></Route>
      <Route path="/VolumeViewer" element={<VolumeViewer />}></Route>
      <Route path="/VolumeClip" element={<VolumeClip />}></Route>
    </Routes>
  );
}

export default App;
