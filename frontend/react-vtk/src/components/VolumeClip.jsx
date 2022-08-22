import React, { useRef, useEffect } from "react";
import style from "../Styling/volumeViewer.module.css";

import "@kitware/vtk.js/favicon";

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import "@kitware/vtk.js/Rendering/Profiles/Volume";

import macro from "@kitware/vtk.js/macros";
import HttpDataAccessHelper from "@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper";
import vtkBoundingBox from "@kitware/vtk.js/Common/DataModel/BoundingBox";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkPiecewiseFunction from "@kitware/vtk.js/Common/DataModel/PiecewiseFunction";
import vtkVolumeController from "@kitware/vtk.js/Interaction/UI/VolumeController";
import vtkURLExtract from "@kitware/vtk.js/Common/Core/URLExtract";
import vtkVolume from "@kitware/vtk.js/Rendering/Core/Volume";
import vtkVolumeMapper from "@kitware/vtk.js/Rendering/Core/VolumeMapper";
import vtkXMLImageDataReader from "@kitware/vtk.js/IO/XML/XMLImageDataReader";
import vtkFPSMonitor from "@kitware/vtk.js/Interaction/UI/FPSMonitor";

// clip imports
import vtkPlane from "@kitware/vtk.js/Common/DataModel/Plane";
import vtkMatrixBuilder from "@kitware/vtk.js/Common/Core/MatrixBuilder";

// Force DataAccessHelper to have access to various data source
import "@kitware/vtk.js/IO/Core/DataAccessHelper/HtmlDataAccessHelper";
import "@kitware/vtk.js/IO/Core/DataAccessHelper/JSZipDataAccessHelper";

import lottie from "lottie-web";
import loadingCube from "../assets/loadingCube.json";

//import style from './VolumeViewer.module.css';
const VolumeClip = () => {
  const vtkContainerRef = useRef(null);
  const context = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      name: "loadingCube",
      container: loaderRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: loadingCube,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    return () => {
      lottie.destroy();
    };
  }, []);

  let autoInit = true;
  const userParams = vtkURLExtract.extractURLParameters();
  const fpsMonitor = vtkFPSMonitor.newInstance();

  // ----------------------------------------------------------------------------
  // Add class to body if iOS device
  // ----------------------------------------------------------------------------
  const iOS = /iPad|iPhone|iPod/.test(window.navigator.platform);

  if (iOS) {
    document.querySelector("body").classList.add("is-ios-device");
  }

  // ----------------------------------------------------------------------------

  function emptyContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  // ----------------------------------------------------------------------------

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // ----------------------------------------------------------------------------
  function createViewer(rootContainer, fileContents, options) {
    const background = options.background
      ? options.background.split(",").map((s) => Number(s))
      : [0, 0, 0];
    const containerStyle = options.containerStyle;
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      background,
      rootContainer,
      containerStyle,
    });
    //clip control html
    //
    const contr = `<table class='clipControl'>
	<tr>
		<td><b>Clip Plane 1</b></td>
		<tr>        
		  <td>
			Position
			<input class='plane1Position' type="range" min="0" max="2.0" step="1" value="0" />
		  </td>
		  <td>
			Rotation
			<input class='plane1Rotation' type="range" min="0" max="2.0" step="1" value="0" />
		  </td>
		</tr>
	</tr>
	<tr>
		<td><b>Clip Plane 2</b></td>R
		<tr>        
		  <td>
			Position
			<input class='plane2Position' type="range" min="0" max="2.0" step="1" value="0" />
		  </td>
		  <td>
			Rotation
			<input class='plane2Rotation' type="range" min="0" max="2.0" step="1" value="0" />
		  </td>
		</tr>
	</tr>
</table>`;
    //
    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();
    renderWindow.getInteractor().setDesiredUpdateRate(30);
    fullScreenRenderer.addController(contr);

    const vtiReader = vtkXMLImageDataReader.newInstance();
    vtiReader.parseAsArrayBuffer(fileContents);

    const source = vtiReader.getOutputData(0);
    const mapper = vtkVolumeMapper.newInstance();
    const actor = vtkVolume.newInstance();

    // clip fcn
    clip(vtiReader, mapper, renderer, renderWindow, actor);

    const dataArray =
      source.getPointData().getScalars() ||
      source.getPointData().getArrays()[0];
    const dataRange = dataArray.getRange();

    const lookupTable = vtkColorTransferFunction.newInstance();
    const piecewiseFunction = vtkPiecewiseFunction.newInstance();

    // Pipeline handling
    actor.setMapper(mapper);
    mapper.setSampleDistance(1.1);
    mapper.setInputData(source);
    renderer.addActor(actor);

    // Configuration
    const sampleDistance =
      0.7 *
      Math.sqrt(
        source
          .getSpacing()
          .map((v) => v * v)
          .reduce((a, b) => a + b, 0)
      );
    mapper.setSampleDistance(sampleDistance);
    actor.getProperty().setRGBTransferFunction(0, lookupTable);
    actor.getProperty().setScalarOpacity(0, piecewiseFunction);
    // actor.getProperty().setInterpolationTypeToFastLinear();
    actor.getProperty().setInterpolationTypeToLinear();

    // For better looking volume rendering
    // - distance in world coordinates a scalar opacity of 1.0
    actor
      .getProperty()
      .setScalarOpacityUnitDistance(
        0,
        vtkBoundingBox.getDiagonalLength(source.getBounds()) /
          Math.max(...source.getDimensions())
      );
    // - control how we emphasize surface boundaries
    //  => max should be around the average gradient magnitude for the
    //     volume or maybe average plus one std dev of the gradient magnitude
    //     (adjusted for spacing, this is a world coordinate gradient, not a
    //     pixel gradient)
    //  => max hack: (dataRange[1] - dataRange[0]) * 0.05
    actor.getProperty().setGradientOpacityMinimumValue(0, 0);
    actor
      .getProperty()
      .setGradientOpacityMaximumValue(0, (dataRange[1] - dataRange[0]) * 0.05);
    // - Use shading based on gradient
    actor.getProperty().setShade(true);
    actor.getProperty().setUseGradientOpacity(0, true);
    // - generic good default
    actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
    actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
    actor.getProperty().setAmbient(0.2);
    actor.getProperty().setDiffuse(0.7);
    actor.getProperty().setSpecular(0.3);
    actor.getProperty().setSpecularPower(8.0);

    // Control UI
    const controllerWidget = vtkVolumeController.newInstance({
      size: [400, 150],
      rescaleColorMap: true,
    });
    const isBackgroundDark =
      background[0] + background[1] + background[2] < 1.5;
    controllerWidget.setContainer(rootContainer);
    controllerWidget.setupContent(renderWindow, actor, isBackgroundDark);

    // setUpContent above sets the size to the container.
    // We need to set the size after that.
    // controllerWidget.setExpanded(false);

    fullScreenRenderer.setResizeCallback(({ width, height }) => {
      // 2px padding + 2x1px boder + 5px edge = 14
      if (width > 414) {
        controllerWidget.setSize(400, 150);
      } else {
        controllerWidget.setSize(width - 14, 150);
      }
      controllerWidget.render();
      fpsMonitor.update();
    });

    // First render
    renderer.resetCamera();
    renderWindow.render();

    global.pipeline = {
      actor,
      renderer,
      renderWindow,
      lookupTable,
      mapper,
      source,
      piecewiseFunction,
      fullScreenRenderer,
    };

    if (userParams.fps) {
      const fpsElm = fpsMonitor.getFpsMonitorContainer();
      fpsElm.classList.add(style.fpsMonitor);
      fpsMonitor.setRenderWindow(renderWindow);
      fpsMonitor.setContainer(rootContainer);
      fpsMonitor.update();
    }
  }
  // clip function
  function clip(reader, mapper, renderer, renderWindow, actor) {
    const clipPlane1 = vtkPlane.newInstance();
    const clipPlane2 = vtkPlane.newInstance();
    let clipPlane1Position = 0;
    let clipPlane2Position = 0;
    let clipPlane1RotationAngle = 0;
    let clipPlane2RotationAngle = 0;
    const clipPlane1Normal = [-1, 1, 0];
    const clipPlane2Normal = [0, 0, 1];
    const rotationNormal = [0, 1, 0];

    // create color and opacity transfer functions
    const ctfun = vtkColorTransferFunction.newInstance();
    ctfun.addRGBPoint(0, 85 / 255.0, 0, 0);
    ctfun.addRGBPoint(95, 1.0, 1.0, 1.0);
    ctfun.addRGBPoint(225, 0.66, 0.66, 0.5);
    ctfun.addRGBPoint(255, 0.3, 1.0, 0.5);
    const ofun = vtkPiecewiseFunction.newInstance();
    ofun.addPoint(0.0, 0.0);
    ofun.addPoint(255.0, 1.0);
    actor.getProperty().setRGBTransferFunction(0, ctfun);
    actor.getProperty().setScalarOpacity(0, ofun);
    actor.getProperty().setScalarOpacityUnitDistance(0, 3.0);
    actor.getProperty().setInterpolationTypeToLinear();
    actor.getProperty().setUseGradientOpacity(0, true);
    actor.getProperty().setGradientOpacityMinimumValue(0, 2);
    actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
    actor.getProperty().setGradientOpacityMaximumValue(0, 20);
    actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
    actor.getProperty().setShade(true);
    actor.getProperty().setAmbient(0.2);
    actor.getProperty().setDiffuse(0.7);
    actor.getProperty().setSpecular(0.3);
    actor.getProperty().setSpecularPower(8.0);
    //
    const data = reader.getOutputData();
    // console.log(data);
    const extent = data.getExtent();
    const spacing = data.getSpacing();
    const sizeX = extent[1] * spacing[0];
    const sizeY = extent[3] * spacing[1];

    clipPlane1Position = sizeX / 4;
    clipPlane2Position = sizeY / 2;
    const clipPlane1Origin = [
      clipPlane1Position * clipPlane1Normal[0],
      clipPlane1Position * clipPlane1Normal[1],
      clipPlane1Position * clipPlane1Normal[2],
    ];
    const clipPlane2Origin = [
      clipPlane2Position * clipPlane2Normal[0],
      clipPlane2Position * clipPlane2Normal[1],
      clipPlane2Position * clipPlane2Normal[2],
    ];

    clipPlane1.setNormal(clipPlane1Normal);
    clipPlane1.setOrigin(clipPlane1Origin);
    clipPlane2.setNormal(clipPlane2Normal);
    clipPlane2.setOrigin(clipPlane2Origin);
    mapper.addClippingPlane(clipPlane1);
    mapper.addClippingPlane(clipPlane2);

    renderer.addVolume(actor);
    const interactor = renderWindow.getInteractor();
    interactor.setDesiredUpdateRate(15.0);
    // renderer.resetCamera();
    // renderer.getActiveCamera().elevation(70);
    // renderWindow.render();

    let el = document.querySelector(".plane1Position");
    el.setAttribute("min", -sizeX);
    el.setAttribute("max", sizeX);
    el.setAttribute("value", clipPlane1Position);

    el = document.querySelector(".plane2Position");
    el.setAttribute("min", -sizeY);
    el.setAttribute("max", sizeY);
    el.setAttribute("value", clipPlane2Position);

    el = document.querySelector(".plane1Rotation");
    el.setAttribute("min", 0);
    el.setAttribute("max", 180);
    el.setAttribute("value", clipPlane1RotationAngle);

    el = document.querySelector(".plane2Rotation");
    el.setAttribute("min", 0);
    el.setAttribute("max", 180);
    el.setAttribute("value", clipPlane2RotationAngle);

    document.querySelector(".plane1Position").addEventListener("input", (e) => {
      clipPlane1Position = Number(e.target.value);
      const clipPlane1Origin = [
        clipPlane1Position * clipPlane1Normal[0],
        clipPlane1Position * clipPlane1Normal[1],
        clipPlane1Position * clipPlane1Normal[2],
      ];
      clipPlane1.setOrigin(clipPlane1Origin);
      renderWindow.render();
    });

    document.querySelector(".plane1Rotation").addEventListener("input", (e) => {
      const changedDegree = Number(e.target.value) - clipPlane1RotationAngle;
      clipPlane1RotationAngle = Number(e.target.value);
      vtkMatrixBuilder
        .buildFromDegree()
        .rotate(changedDegree, rotationNormal)
        .apply(clipPlane1Normal);
      clipPlane1.setNormal(clipPlane1Normal);
      renderWindow.render();
    });
    document.querySelector(".plane2Position").addEventListener("input", (e) => {
      clipPlane2Position = Number(e.target.value);
      const clipPlane2Origin = [
        clipPlane2Position * clipPlane2Normal[0],
        clipPlane2Position * clipPlane2Normal[1],
        clipPlane2Position * clipPlane2Normal[2],
      ];
      clipPlane2.setOrigin(clipPlane2Origin);
      renderWindow.render();
    });

    document.querySelector(".plane2Rotation").addEventListener("input", (e) => {
      const changedDegree = Number(e.target.value) - clipPlane2RotationAngle;
      clipPlane2RotationAngle = Number(e.target.value);
      vtkMatrixBuilder
        .buildFromDegree()
        .rotate(changedDegree, rotationNormal)
        .apply(clipPlane2Normal);
      clipPlane2.setNormal(clipPlane2Normal);
      renderWindow.render();
    });
  }

  // load function
  function load(container, options) {
    autoInit = false;
    emptyContainer(container);

    if (options.file) {
      if (options.ext === "vti") {
        const reader = new FileReader();
        reader.onload = function onLoad(e) {
          createViewer(container, reader.result, options);
        };
        reader.readAsArrayBuffer(options.file);
      } else {
        console.error("Unkown file...");
      }
    } else if (options.fileURL) {
      const progressContainer = document.createElement("div");
      progressContainer.setAttribute("class", style.progress);
      container.appendChild(progressContainer);

      const progressCallback = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percent = Math.floor(
            (100 * progressEvent.loaded) / progressEvent.total
          );
          progressContainer.innerHTML = `Loading ${percent}%`;
        } else {
          progressContainer.innerHTML = macro.formatBytesToProperUnit(
            progressEvent.loaded
          );
        }
      };

      HttpDataAccessHelper.fetchBinary(options.fileURL, {
        progressCallback,
      }).then((binary) => {
        container.removeChild(progressContainer);
        createViewer(container, binary, options);
      });
    }
  }
  // init local file loader
  function initLocalFileLoader(container) {
    const exampleContainer = document.querySelector(".content");
    const rootBody = document.querySelector("body");
    const myContainer = container || exampleContainer || rootBody;

    const fileContainer = document.createElement("div");
    fileContainer.innerHTML = `<div class="${style.bigFileDrop}"/><input type="file" accept=".vti" style="display: none;"/>`;
    myContainer.appendChild(fileContainer);

    const fileInput = fileContainer.querySelector("input");

    function handleFile(e) {
      preventDefaults(e);
      const dataTransfer = e.dataTransfer;
      const files = e.target.files || dataTransfer.files;
      if (files.length === 1) {
        myContainer.removeChild(fileContainer);
        const ext = files[0].name.split(".").slice(-1)[0];
        const options = { file: files[0], ext, ...userParams };
        load(myContainer, options);
      }
    }

    fileInput.addEventListener("change", handleFile);
    fileContainer.addEventListener("drop", handleFile);
    fileContainer.addEventListener("click", (e) => fileInput.click());
    fileContainer.addEventListener("dragover", preventDefaults);
  }

  // Look at URL an see if we should load a file
  // ?fileURL=https://data.kitware.com/api/v1/item/59cdbb588d777f31ac63de08/download
  if (userParams.fileURL) {
    const exampleContainer = document.querySelector(".content");
    const rootBody = document.querySelector("body");
    const myContainer = exampleContainer || rootBody;
    load(myContainer, userParams);
  }

  const viewerContainers = document.querySelectorAll(".vtkjs-volume-viewer");
  let nbViewers = viewerContainers.length;
  while (nbViewers--) {
    const viewerContainer = viewerContainers[nbViewers];
    const fileURL = viewerContainer.dataset.url;
    const options = {
      containerStyle: { height: "100%" },
      ...userParams,
      fileURL,
    };
    load(viewerContainer, options);
  }

  //----------------------------------------------------------------------------
  useEffect(() => {
    if (!context.current) {
      // Auto setup if no method get called within 100ms
      setTimeout(() => {
        if (autoInit) {
          initLocalFileLoader();
        }
      }, 100);
      context.current = {};
    }
  }, [vtkContainerRef]);

  return (
    <div className="h-[100vh] flex">
      <div className="w-full h-full bg-black z-[1] justify-center items-center relative">
        <div
          ref={loaderRef}
          className="w-[600px] h-[600px] absolute left-0 top-[20%]"
        />
      </div>
      <div ref={vtkContainerRef} />
    </div>
  );
};

export default VolumeClip;
