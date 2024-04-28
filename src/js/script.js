import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene(); 

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// camera.position.set(0, 2, 5);
camera.position.set(0, 2, 5);
orbit.update();
// camera.lookAt(scene.position);

const boxGeometry = new THREE.BoxGeometry(); // Create a threejs geometry object of type Box (3D cube).
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// const animate = () => {
//   box.rotation.x += 0.01;
//   box.rotation.y += 0.01;
//   renderer.render(scene, camera);
// };

const animate = (time) => {
    box.rotation.x = time * 0.001;
    box.rotation.y = time * 0.001;
    renderer.render(scene, camera);
  };
//if we were to divide the time by 2000, the rotation would be slower.
//   box.rotation.x = time / 2000; // Slower rotation
// box.rotation.y = time / 2000; 

renderer.setAnimationLoop(animate);
