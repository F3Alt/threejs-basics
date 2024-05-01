import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as dat from "dat.gui";

import stars from "../img/stars.jpg";
import nebula from "../img/nebula.jpg";

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

const orbitControls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 2, 5);
orbitControls.update();

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(geometry, material);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(15, 15);
const planeMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
planeMesh.rotation.x = -0.5 * Math.PI;

const sphereGeometry = new THREE.SphereGeometry(2, 50, 50);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

const gui = new dat.GUI();

const options = {
  color: 0x0000ff,
  wireframe: false,
  speed: 0.01,
  intensity: 0,
  angle: 0.2,
  penumbra: 0,
};

gui.addColor(options, "color").onChange(function (e) {
  sphereMesh.material.color.set(e);
});

gui.add(options, "wireframe").onChange(function (e) {
  sphereMesh.material.wireframe = e;
});

gui.add(options, "intensity", 0, 1000).onChange(function (e) {
  spotlight.intensity = e;
});
gui.add(options, "angle", 0, 2).onChange(function (e) {
  spotlight.angle = e;
});
gui.add(options, "penumbra", 0, 1).onChange(function (e) {
  spotlight.penumbra = e;
});

gui.add(options, "speed", 0, 0.1);

let step = 0;

const mousePosition = new THREE.Vector2();
window.addEventListener("mousemove", function (event) {
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // console.log(mousePosition);
});

const rayCaster = new THREE.Raycaster();

const sphereId = sphereMesh.id;

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// const directionalLight =
// new THREE.DirectionalLight(0xFFFFFF, 10);
// scene.add(directionalLight);
// directionalLight.position.set(-5, 8, 0);
// sphereMesh.position.x = 5;

// const dLightHelper =
// new THREE.DirectionalLightHelper(directionalLight, 3);
// scene.add(dLightHelper);

const spotlight = new THREE.SpotLight(0xffffff, 1000);
scene.add(spotlight);
spotlight.position.set(-5, 8, 0);

const sLightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0xffffff, 0.01);

// renderer.setClearColor("yellow", 1);
const textureLoader = new THREE.TextureLoader();
// const backgroundImage = textureLoader.load('../img/stars.jpg');

// scene.background = backgroundImage;
// scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  nebula,
  nebula,
  stars,
  stars,
  stars,
  stars,
]);

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  // color: 0x0000ff,
  map: textureLoader.load(nebula),
});
const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
];
const box2 = new THREE.Mesh(box2Geometry, box2Material);
scene.add(box2);
box2.position.set(0, 15, 10);

renderer.shadowMap.enabled = true;
planeMesh.receiveShadow = true;
sphereMesh.castShadow = true;
spotlight.castShadow = true;
// directionalLight.castShadow = true;

function animate() {
  step += options.speed;
  sphereMesh.position.y = 3 * Math.abs(Math.sin(step));

  renderer.render(scene, camera);
  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  console.log(intersects);

  for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.id === sphereId)
      intersects[i].object.material.color.set(0xff0000);
  }
  sLightHelper.update();

}

renderer.setAnimationLoop(animate);
