import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import "@kitware/vtk.js/Rendering/Profiles/Geometry";

import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkPolyDataReader from "@kitware/vtk.js/IO/Legacy/PolyDataReader";

const Poly = () => {
  // const {url}=props;
  const { state } = useLocation();
  const { url } = state;

  const vtkContainerRef = useRef(null);
  const context = useRef(null);

  useEffect(() => {
    if (!context.current) {
      console.log(url + "%20-%20sphere.vtk");
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        background: [0, 0, 0],
      });
      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      const resetCamera = renderer.resetCamera;
      const render = renderWindow.render;

      const reader = vtkPolyDataReader.newInstance();

      reader.setUrl(`${url}`).then(() => {
        const polydata = reader.getOutputData(0);
        const mapper = vtkMapper.newInstance();
        const actor = vtkActor.newInstance();

        actor.setMapper(mapper);
        mapper.setInputData(polydata);

        renderer.addActor(actor);

        resetCamera();
        render();
      });

      context.current = {
        renderer,
        renderWindow,
        resetCamera,
        render,
      };
    }
  }, [vtkContainerRef]);

  return (
    <div>
      <div ref={vtkContainerRef} />
    </div>
  );
};

export default Poly;
