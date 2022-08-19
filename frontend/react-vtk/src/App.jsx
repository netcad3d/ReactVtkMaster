import React from "react";

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Clip from "./components/Clip";
import Poly from "./components/Poly";
import SphereClip from "./components/SphereClip";
import VolumeClip from "./components/VolumeClip";
import VolumeViewer from "./components/VolumeViewer";
import GeometryViewer from "./components/GeometryViewer";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ManyRenderers from "./components/ManyRenderers";

function App() {
  return (
    <>
      <Navbar />
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
export default App;
