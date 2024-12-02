
import * as THREE from "three";
import "./style.css";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { getFirstObjectWithName } from '/help/help.js';
import gsap from 'gsap';


var typed = new Typed('#typed', {
  strings: ['Web Developer!', 'B-TECH Student!'],
  typeSpeed: 50,
  backSpeed:50,
  loop: true,
});
function disableWheelScroll() {
  window.addEventListener('wheel', (e) => {
    e.preventDefault(); // Prevent the wheel scroll
  }, { passive: false });
}

function enableWheelScroll() {
  window.removeEventListener('wheel', (e) => {
    e.preventDefault();
  });
}

// Example: Disable scrolling when the page loads
window.addEventListener('load', disableWheelScroll);
//scene
const scene = new THREE.Scene();

//sPHERE
// const geometry = new THREE.SphereGeometry(3,64,64);
// const material = new THREE.MeshStandardMaterial({
//   color:"#00ff83",
// })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

//sizes
const sizes = {
  width:window.innerWidth,
  height:window.innerHeight,
}

//light

const light = new THREE.PointLight( 0xFADA7D, 30000);
light.position.set( 50, 50, 50);
scene.add( light );
// Add a PointLight from the bottom to the top
const lights = new THREE.PointLight(0xFADA7D, 300, 100);  // Color, intensity, range
lights.position.set(0, -10, 0);  // Position light below the mesh
lights.castShadow = true;       // Enable shadow casting for light
scene.add(lights);

const ambientLight = new THREE.AmbientLight(0xFADA7D, 15); // Soft light
scene.add(ambientLight);
// light.position = new THREE.Vector3(0,0,10);
//CAMERA
const camera = new THREE.PerspectiveCamera(45,sizes.width/sizes.height,0.1,100)
camera.position.z =20

scene.add(camera)
const loader = new GLTFLoader();
let model;
  
function traverseModel(object) {
  object.traverse(function(child) {
      if (child.isMesh) {
          console.log('Mesh Name:', child.name);  // Print the mesh name
          console.log('Mesh Object:', child);     // Print the entire mesh object
      }
  });
}


loader.load(
  './scene.gltf', // Replace with the path to your GLTF/GLB model
  function (gltf) {
    model = gltf.scene; // Replace with the actual name of the screen mesh
    scene.add(model);          // Add the model to the scene
    traverseModel(model);
     // Find the screen part of the model (replace 'Screen' with the correct name from your model)
     
    // Optional: Scale and position the model if needed
    model.scale.set(5,5,5);  // Adjust scaling based on model size
    model.position.set(-10, 0, 0); // Position the model in the scene
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded'); // Progress info
  },
  function (error) {
    console.error('An error happened while loading the model:', error);
  }
);

//renderer

       
const canvas = document.querySelector(".sphere")
const rect = canvas.getBoundingClientRect();

const renderer = new THREE.WebGLRenderer({ // Your existing canvas selected via querySelector
  alpha: true})
renderer.setClearColor(0x000000, 0);
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(2)
canvas.appendChild(renderer.domElement);

        // Set clear color to transparent
renderer.setClearColor(0x000000, 0); 
// renderer.setClearColor( 0x00000, 0);
renderer.render(scene,camera)

//controls
const controls = new OrbitControls(camera, canvas )
 controls.enableDamping = true
 controls.enablePan = false
 controls.enableZoom = false
 controls.enableRotate = false
//  controls.autoRotate = true
// controls.autoRotateSpeed = 6
 //resize 
 window.addEventListener("resize", ()=>{
  
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width/sizes.height;
 
   camera.updateProjectionMatrix();
  renderer.setSize(sizes.width,sizes.height) 
 })

 camera.lookAt(0, 0, 0);

 let mouseX = 0; // Horizontal mouse position
        let targetRotationY = 0; // Target rotation for smooth transition
        const rotationSpeed = 0.05; // Sensitivity of the rotation
        const maxRotationY = Math.PI / 3;
        const maxRotationY2 = Math.PI / 12;  // Max rotation (120 degrees)
        let targetRotationY2 = 0; 
        // Update mouse position on mouse move
function onMouseMove(event) {
            // Convert the mouse position to normalized device coordinates (-1 to 1)
            mouseX = (event.clientX / window.innerWidth) * 2 - 1; // X-axis normalized
            // Calculate the target rotation based on mouse position
            targetRotationY = mouseX * maxRotationY; 
            targetRotationY2 = mouseX * maxRotationY2;// Limit rotation to ±60 degrees
}

        window.addEventListener('mousemove', onMouseMove, false);
 // Function to move the model along X-axis and rotate within 120 degrees

const loop = ()=>{
  controls.update();
  
  if (model) {
    // Smoothly interpolate the model's rotation towards the target rotation
    model.rotation.y += (targetRotationY - model.rotation.y) * rotationSpeed;
}
  
 renderer.render(scene,camera)
 window.requestAnimationFrame(loop)
}
loop()


