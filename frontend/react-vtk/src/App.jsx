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
import Signup from "./components/Signup";

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
      <Route path="/Three" element={<Three />} />
      <Route path="/Signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
