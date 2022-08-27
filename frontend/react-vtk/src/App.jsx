import React from "react";

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

//! ===== Components =====
import Poly from "./components/Poly";
import VolumeClip from "./components/VolumeClip";
import GeometryViewer from "./components/GeometryViewer";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ManyRenderers from "./components/ManyRenderers";
import ResetPass from "./components/ResetPass";
import ForgotPass from "./components/ForgotPass";

//! ===== Pages =====
import Home from "./pages/Home";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/poly" element={<Poly />} />
        <Route path="/VolumeClip" element={<VolumeClip />} />
        <Route path="/GeometryViewer" element={<GeometryViewer />} />
        <Route path="/ManyRenderers" element={<ManyRenderers />}></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ResetPass/:id/:token" element={<ResetPass></ResetPass>} />
        <Route path="/ForgotPass" element={<ForgotPass></ForgotPass>} />
        <Route path="/:id/verify/:token" element={<EmailVerifyPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/Settings" element={<Settings></Settings>} />
      </Routes>
    </>
  );
}
export default App;
