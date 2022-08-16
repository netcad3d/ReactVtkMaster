import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import * as THREE from "three";
import { VTKLoader } from "three/examples/jsm/loaders/VTKLoader";

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

import SceneInit from "../utils/SceneInit";

const TreeJsEx = () => {
  const { state } = useLocation();
  const { url } = state;

  useEffect(() => {
    const test = new SceneInit("threeCanvas");
    test.initialize();
    test.animate();

    const loader = new VTKLoader();
    loader.load("src/assets/sphere.vtk", (geometry) => {
      geometry.computeVertexNormals();

      const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(geometry, material);

      test.scene.add(mesh);
    });

    let permukaan = [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    ];
    let helper = new THREE.PlaneHelper(permukaan[0], 2, 0xffff00);

    let material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      clippingPlanes: [permukaan[0]],
    });

    let material2 = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      clippingPlanes: [permukaan[0], permukaan[1], permukaan[2]],
      wireframe: true,
    });

    test.scene.add(helper);

    let cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    cube.position.set(0, 0, 0);
    test.scene.add(cube);

    let cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material2);
    test.scene.add(cube2);
  }, []);

  return (
    <div>
      <canvas id="threeCanvas"></canvas>
    </div>
  );
};

export default TreeJsEx;
