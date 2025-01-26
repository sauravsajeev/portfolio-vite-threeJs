
import * as THREE from "three";
import "/style.css";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
//scene


const sizes = {
    width:window.innerWidth,
    height:window.innerHeight,
  }
function traverseModel(object) {
    object.traverse(function(child) {
        if (child.isMesh) {
            console.log('Mesh Name:', child.name);  // Print the mesh name
            console.log('Mesh Object:', child);     // Print the entire mesh object
        }
    });
  }
const scenes = new THREE.Scene();

//sPHERE
// const geometry = new THREE.SphereGeometry(3,64,64);
// const material = new THREE.MeshStandardMaterial({
//   color:"#00ff83",
// })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)



const spotLight = new THREE.SpotLight(0xffffff, 50000, 0, 0.22, 1);
spotLight.position.set(0,200 , 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scenes.add(spotLight)
// const helper = new THREE.SpotLightHelper(spotLight);
// scenes.add(helper);


// const lightss = new THREE.PointLight( 0xffffff, 3000);
// lightss.position.set( 0,0,0);
// scenes.add( lightss );
// // Add a PointLight from the bottom to the top

// const ambientlight = new THREE.AmbientLight(0xffffff, 0.1);
// scenes.add(ambientlight);
// light.position = new THREE.Vector3(0,0,10);
//CAMERA
const cameras = new THREE.PerspectiveCamera(45,sizes.width/sizes.height,0.1,1000)
cameras.position.set(15, 15,-11);

scenes.add(cameras)
const loaders = new GLTFLoader();
let model2;
// Add loading manager and texture loader
// const loadingManager = new THREE.LoadingManager();
// const textureLoader = new TextureLoader(loadingManager);
// const texturePath = 'static/textures/';
// const loaders = new GLTFLoader(loadingManager);
// loaders.load(
//     'static/new.glb',
//     (gltf) => {
//         model2 = gltf.scene;
//         scenes.add(model2);          // Add the model to the scene
//         traverseModel(model2);
//          // Find the screen part of the model (replace 'Screen' with the correct name from your model)
         
//         // Optional: Scale and position the model if needed
//         model2.scale.set(1,1,1);  // Adjust scaling based on model size
//         model2.position.set(0, 0, 0); // Position the model in the scene
//       },
//       function (xhr) {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded'); // Progress info
//       },
//       function (error) {
//         console.error('An error happened while loading the model:', error);
//       }
//     );// Layer for object 2
let spotLights;
loaders.load(
  '/static/untitled.gltf', // Replace with the path to your GLTF/GLB model
  function (gltf) {
    model2 = gltf.scene;
    model2.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        console.log ("child names: " + child.name)
        if (child.name  == "Object_93"){
          // For glowing objects, use an emissive material
          child.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              emissive: 0xFADA7D,
              emissiveIntensity:3,
          });
         
      //     glowingGroup.add(child);
      } else if(child.name  == "Object_116"){
        // For glowing objects, use an emissive material
        child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x9DFFED,
            emissiveIntensity:1.4,
        }); 
      } 
      else if(child.name  == "Plane"){
        // For glowing objects, use an emissive material
        child.visible = false;
        spotLights = new THREE.SpotLight(0xffffff, 2000, 0, 0.2, 1);
        spotLights.position.set(3,12, -20);
        spotLights.target= new THREE.Vector3(-10.121976852416992, 7.701351928710938, -5.95456985473633);
        spotLights.castShadow = true;
        spotLights.shadow.bias = -0.0001;
        scenes.add(spotLights);
        spotLights.target = child;
        
        // const helpers = new THREE.SpotLightHelper(spotLights);
         }   // scenes.add(helpers);
      }
    });
   //Replace with the actual name of the screen mesh
    scenes.add(model2);          // Add the model to the scene
    traverseModel(model2);
     // Find the screen part of the model (replace 'Screen' with the correct name from your model)
 
    // Optional: Scale and position the model if needed
    model2.scale.set(0.5,0.5,0.5);
  // Adjust scaling based on model size
    model2.position.set(0, 0, 0);
    if (sizes.width  <= 768){ 
      model2.position.set(0, 14, 0);
    }// Position the model in the scene
    model2.rotation.set(0, 0, 0.1);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded'); // Progress info
  },
  function (error) {
    console.error('An error happened while loading the model:', error);
  }
);

//renderer

       
const canvass = document.querySelector(".room")
const rects = canvass.getBoundingClientRect();

const renderers = new THREE.WebGLRenderer({ // Your existing canvas selected via querySelector
  alpha: true})
renderers.setClearColor(0x000000, 0);
renderers.setSize(sizes.width,sizes.height)
renderers.setPixelRatio(2)
canvass.appendChild(renderers.domElement);

renderers.toneMapping = THREE.NoToneMapping;
renderers.toneMappingExposure = 1; 
        // Set clear color to transparent
renderers.setClearColor(0x000000, 0); 
// renderer.setClearColor( 0x00000, 0);
renderers.render(scenes,cameras)

//controls
const controlss = new OrbitControls(cameras, canvass )
 controlss.enableDamping = true;
 controlss.enablePan = false;
 controlss.enableZoom = false;
 controlss.enableRotate = false;
 // controls.autoRotate = true
// controls.autoRotateSpeed = 6
 //resize 
 window.addEventListener("resize", ()=>{
  
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  cameras.aspect = sizes.width/sizes.height;
   cameras.updateProjectionMatrix();
  renderers.setSize(sizes.width,sizes.height) 
  if (sizes.width  <= 768){
    cameras.position.set(50, 20,-40);
    console.log("position set")
    controlss.enableDamping = false;
 controlss.enablePan =false;
 controlss.enableZoom = false;
 controlss.enableRotate = true;
 model2.position.set(0, 14, 0);
  }
 })

 cameras.lookAt(  
  2
,7.884449005126953,-4.130945205688477);
var rotation =  cameras.rotation.z  -0.05;
if (sizes.width  <= 768){
  controlss.enableDamping = false;
 controlss.enablePan = false;
 controlss.enableZoom = false;
 controlss.enableRotate = true;
  cameras.position.set(90, 50,-45);
  cameras.rotation.z = rotation;
}


let currentSectionIndex = 0;
const sections = document.querySelectorAll('.section');

let isScrolling = false;

// Scroll to a specific section
function scrollToSection(index) {
  if (index < 0 || index >= sections.length || isScrolling) return;

  isScrolling = true;
  sections[index].scrollIntoView({ behavior: 'smooth' });

  // Prevent rapid consecutive scrolling
  setTimeout(() => {
    currentSectionIndex = index;
    isScrolling = false;
  }, 1000); // Adjust delay to match scrolling duration
}

// Handle scroll events
function handleScroll(event) {
  if (isScrolling) return;

  const deltaY = event.deltaY || event.changedTouches[0].clientY - event.changedTouches[1]?.clientY || 0;

  if (deltaY > 0) {
    // Scroll down
    scrollToSection(currentSectionIndex + 1);
    page= "skills"
  } else if (deltaY < 0) {
    // Scroll up
    scrollToSection(currentSectionIndex - 1);
  }
}

// Event listeners
window.addEventListener('wheel', handleScroll); // Desktop scrolling
let touchStartY = 0;

window.addEventListener('touchstart', (event) => {
  touchStartY = event.touches[0].clientY;
});

window.addEventListener('touchend', (event) => {
  const touchEndY = event.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY;

  if (deltaY > 50) {
    // Scroll down
    scrollToSection(currentSectionIndex + 1);
  } else if (deltaY < -50) {
    // Scroll up
    scrollToSection(currentSectionIndex - 1);
  }
});
 const composer = new EffectComposer(renderers);
 const renderPass = new RenderPass(scenes, cameras);
 composer.addPass(renderPass);
 
 // Add UnrealBloomPass
 const bloomPass = new UnrealBloomPass(
     new THREE.Vector2(window.innerWidth, window.innerHeight),
     1,  // strength
     0.2,  // radius
     1 // threshold
 );
 composer.addPass(bloomPass);
 let renderout = true;
 let movementcam = true;
 let page = "home";
const loops = ()=>{
   controlss.update();

  
  if (model2 && movementcam) {
    // Smoothly interpolate the model's rotation towards the target rotation
    model2.rotation.y += (targetRotationY2 - model2.rotation.y) * rotationSpeed;
}
if (renderout){
   composer.render();
   window.requestAnimationFrame(loops);
}
}
loops()
let maxRotationY2 = Math.PI / 12;
document.addEventListener('click',onClick2);



let mainpos = [15, 15,-11,2 ,7.884449005126953, -4.130945205688477];
let lastpos = [15, 15,-11,2 ,7.884449005126953, -4.130945205688477];
function mobileset(){
  if  (sizes.width  <= 768){
     mainpos = [80, 50,-45,2 ,7.884449005126953, -4.130945205688477];
     lastpos = [80, 50,-45,2 ,7.884449005126953, -4.130945205688477];
  }
  
}
function onClick2(event) {
  if (document.querySelector('.right').contains(event.target)){
    renderout = true;
		// wheel = getFirstObjectWithName(event, window, cameras, scenes, "Object_5");
   if (page == 'about'){
		// (wheel != null) ?
    renderout = true;
     updateCamera();
     
   }
   else if (page == 'skills'){
    renderout = true;
    updateskillcam();
   
   }
   else if (page == 'project'){
    console.log("inside project");
    renderout = true;
    updateprojectcam();
   
   }
   else if (page == 'contact'){
    renderout = true;
    updatecontactcam();
  
   }
}
}
gsap.registerPlugin();
const t1 = gsap.timeline();
function updateCamera(){
  movementcam =false;
  model2.rotation.y = 0;
  cameras.position.set(15, 15,-11);
  cameras.lookAt(2 ,7.884449005126953, -4.130945205688477);
  if (sizes.width  <= 768){
    cameras.position.set(80, 50,-45);
    cameras.rotation.z = rotation;
  }
   t1.to(cameras.position,{
    x:-3.4,
    y:7.4,
    z:-6.1,
    duration:1.5,
ease:"power3.inOut",
    onUpdate:function(){
        cameras.lookAt(new THREE.Vector3(-10.121976852416992, 7.701351928710938, -5.95456985473633));
    },

     onComplete:normalpos,
     
  });
  lastpos= [-3.4, 7.4,-6.1,-10.121976852416992, 7.701351928710938, -5.95456985473633];
}
window.resetproject = function(){
  renderout = true;
  loops();
};
function reset(pages){
  page = pages;
  movementcam =true;
  if (page == 'skills'){
  model2.traverse((child) => {
    if (child.isMesh) {
      console.log("Found mesh");
     if(child.name  == "Plane"){
      // For glowing objects, use an emissive material
      console.log("Found plane");
      child.visible = true;
      spotLights.intensity = 2000;
      spotLights.position.set(3,12, -20);
      spotLights.target= new THREE.Vector3(-10.121976852416992, 7.701351928710938, -5.95456985473633);
      spotLights.castShadow = true;
      spotLights.shadow.bias = -0.0001;
      scenes.add(spotLights);
      spotLights.target = child;
    }
    }
  })
  }
  else{
    model2.traverse((child) => {
      if (child.isMesh) {
        console.log("Found mesh");
       if(child.name  == "Plane"){
        // For glowing objects, use an emissive material
        console.log("Found plane");
        child.visible = false;
        spotLights.intensity = 0;
        spotLights.position.set(3,12, -20);
        spotLights.target= new THREE.Vector3(-10.121976852416992, 7.701351928710938, -5.95456985473633);
        spotLights.castShadow = true;
        spotLights.shadow.bias = -0.0001;
        scenes.add(spotLights);
        spotLights.target = child;
        
        // const helpers = new THREE.SpotLightHelper(spotLights);
        // scenes.add(helpers);
      }
      }
    })
    }
  if((JSON.stringify(lastpos) != JSON.stringify(mainpos))){
    console.log("inside lastpos");
    t1.to(cameras.position,{
      x:mainpos[0],
      y:mainpos[1],
      z:mainpos[2],
      ease:"power3.inOut",
      duration:1.5,
      onUpdate:function(){
          cameras.lookAt(new THREE.Vector3(mainpos[3],mainpos[4],mainpos[5]))
      },
    });
  }
  else if (JSON.stringify(lastpos) == JSON.stringify(mainpos)){
    console.log("not inside lastpos");
  cameras.position.set(15, 15,-11);
  cameras.lookAt(2 ,7.884449005126953, -4.130945205688477);
  if (sizes.width  <= 768){
    cameras.position.set(80, 50,-45);
    cameras.rotation.z = rotation;
  }
  }
}
window.reset = reset;
function normalpos(){
  if (page == "about"){
  cameras.lookAt(new THREE.Vector3(-10.121976852416992, 7.701351928710938, -5.95456985473633));
  cameras.position.set(-3.4, 7.4,-6.1);
  lastpos= [-3.4, 7.4,-6.1,-10.121976852416992, 7.701351928710938, -5.95456985473633];
  }
  else if (page =="skills") {
    cameras.position.set(-5.5,7.5,1);
    cameras.lookAt(new THREE.Vector3(-5.0699995040893555,  7.079998970031738,  20.9600));
    cameras.rotation.z += -0.1;
    lastpos= [-5.5,7.5,1,-5.0699995040893555,  7.079998970031738,  20.9600];
  }  else if (page =="project") {
    cameras.position.set(-6, 4,-4.9);
    cameras.lookAt(new THREE.Vector3(-10.121976852416992, 4.01351928710938, -4.8956985473633));
    renderout = false;
    window.location.href = "#project";
  
  lastpos= [-3.4, 7.4,-6.1,-10.121976852416992, 7.701351928710938, -5.95456985473633];
  }
  else if (page =="contact") {
    cameras.position.set(-6.5, 5,1);
    cameras.lookAt(new THREE.Vector3(-10.121976852416992, -6.01351928710938, 0.3956985473633));
  
  lastpos= [-6.5, 5,1,-10.121976852416992, -6.01351928710938, 0.3956985473633];
  }
}

function updateskillcam(){
 
  movementcam =false;
  model2.rotation.y = 0;
  cameras.position.set(15, 15,-11);
  cameras.lookAt(2 ,7.884449005126953, -4.130945205688477);
  if (sizes.width  <= 768){
    cameras.position.set(80, 50,-45);
    cameras.rotation.z = rotation;
  }
  t1.to(cameras.position,{
    x:-5.5,
    y:7.5,
    z:1,
    duration:3,
    ease:"power3.inOut",
    onUpdate:function(){
      cameras.lookAt(new THREE.Vector3(-5.0699995040893555,  7.079998970031738,  20.9600));
        cameras.rotation.z += -0.1;
    },
    onComplete:normalpos
});
lastpos =[-5.5,7.5,1,-5.0699995040893555,  7.079998970031738,  20.9600];
}
function updateprojectcam(){
 
  movementcam =false;
  model2.rotation.y = 0;
  cameras.position.set(15, 15,-11);
  cameras.lookAt(2 ,7.884449005126953, -4.130945205688477);
  if (sizes.width  <= 768){
    cameras.position.set(80, 50,-45);
    cameras.rotation.z = rotation;
  }
  t1.to(cameras.position,{
    x:-6,
    y:4,
    z:-4.9,
    duration:3,
    ease:"power3.inOut",
    onUpdate:function(){
      cameras.lookAt(new THREE.Vector3(-10.121976852416992, 4.01351928710938, -4.8956985473633));
        
    },
    onComplete:normalpos
});
lastpos =[-6,4,-4.9,-10.121976852416992, 4.01351928710938, -4.8956985473633];
}

function updatecontactcam(){
  movementcam =false;
  model2.rotation.y = 0;
  cameras.position.set(15, 15,-11);
  cameras.lookAt(2 ,7.884449005126953, -4.130945205688477);
  if (sizes.width  <= 768){
    cameras.position.set(80, 50,-45);
    cameras.rotation.z = rotation;
  }
  t1.to(cameras.position,{
    x:-6.5,
    y:5,
    z:1,
    duration:3,
    ease:"power3.inOut",
    onUpdate:function(){
      cameras.lookAt(new THREE.Vector3(-10.121976852416992, -6.01351928710938, 0.3956985473633));
        
    },
    onComplete:normalpos
});

lastpos =[-6.5,5,1,10.121976852416992, -6.01351928710938, 0.3956985473633];
}

let mouseX = 0; // Horizontal mouse position
        let targetRotationY = 0; // Target rotation for smooth transition
        const rotationSpeed = 0.05; // Sensitivity of the rotation
        const maxRotationY = Math.PI / 3;
         // Max rotation (120 degrees)
        let targetRotationY2 = 0; 
        // Update mouse position on mouse move
function onMouseMove1(event) {
            // Convert the mouse position to normalized device coordinates (-1 to 1)
            mouseX = (event.clientX / window.innerWidth) * 2 - 1; // X-axis normalized
            // Calculate the target rotation based on mouse position
            targetRotationY = mouseX * maxRotationY;      
            targetRotationY2 = mouseX * maxRotationY2;// Limit rotation to ±60 degrees
}
window.addEventListener('mousemove', onMouseMove1, false);

// window.addEventListener("resize", ()=>{
  
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;
//   cameras.aspect = sizes.width/sizes.height;
 
//    cameras.updateProjectionMatrix();
//   renderers.setSize(sizes.width,sizes.height) 
//  })
