import React from "react";

import { Routes, Route } from "react-router-dom";
import Poly from "./components/Poly";
import Visualizer from "./components/Poly";

import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/poly" element={<Poly />} />
    </Routes>
  );
}

export default App;
