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


import EmailVerifyPage from "./pages/EmailVerifyPage";
import EmailVerify from "./components/EmailVerify";
import NotFound from "./pages/NotFound";
import ResetPass from "./components/ResetPass";
import ForgotPass from "./components/ForgotPass";

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
		<Route path="/ResetPass/:id/:token" element={<ResetPass></ResetPass>} />
		<Route path="/ForgotPass" element={<ForgotPass></ForgotPass>} />
        <Route path="/:id/verify/:token" element={<EmailVerifyPage />} />
        <Route path="/NotFound" element={<NotFound />} />
      </Routes>
    </>
  );
}
export default App;
