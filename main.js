import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//3 things : scene object, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//track mouse position
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//3d object
let object;
let controls;
let objToRender ;
//.gltf -> file format 3D files retaining a consistent PBR workflow
const loader = new GLTFLoader();

// Variable to store the currently active object
let activeObject = null;

// Function to load a GLTF model and replace the currently active object
function loadModel(modelPath) {
  if (activeObject) {
    scene.remove(activeObject); // Remove the previous object from the scene
    activeObject = null;   
  }

  loader.load(
    modelPath,
    function(gltf) {
      activeObject = gltf.scene;   // Store the loaded object
      scene.add(activeObject);     // Add the new object to the scene

      let targetPosition = activeObject.position.clone();
      camera.lookAt(targetPosition);
      camera.position.z = 5;

      renderer.render(scene, camera);
    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function(error) {
      console.error(error);
    }
  );
}

// Event listeners for buttons to load different models
const models = ['lily', 'pink', 'blue'];  

models.forEach((model, index) => {
  const buttonId = `button${index + 1}`; 
  
  document.getElementById(buttonId).addEventListener("click", function() {
    objToRender = model;  // Set the current model
    loadModel(`models/${objToRender}/scene.gltf`);  // Load corresponding model
  });
});


// Camera and scroll-related variables
let maxRotationAngle = 2 * Math.PI;  // Full 360 degrees in radians (complete rotation)
let maxYShift = 4;                // Maximum downward movement (negative y direction)
let cameraDistance = 5;             // Distance from the object (radius of circular path)
let scrollFactor = 0.5;              // Sensitivity of scroll movement
let totalScroll = 0;                 // Tracks total scroll movement
let maxScroll = 1000;                // Max scroll distance for full model view


const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);


document.getElementById("wheel").addEventListener("wheel", function(event) {
    if (activeObject) { 
        // Update total scroll amount based on scroll direction
        totalScroll += event.deltaY * scrollFactor;

        // Normalize scroll progress between 0 and 1
        let scrollProgress = Math.max(0, Math.min(totalScroll, maxScroll)) / maxScroll;

        // Calculate camera's circular path using sin and cos
        let angle = scrollProgress * maxRotationAngle;  // Full rotation based on scroll
        
        let cameraX = cameraDistance * Math.sin(angle);  // Circular path on x-axis
        let cameraZ = cameraDistance * Math.cos(angle);  // Circular path on z-axis
        let cameraY = scrollProgress * maxYShift; // Calculate downward movement of the camera on the y-axis

        // Update camera position
        camera.position.set(cameraX, -cameraY, cameraZ);  // Move camera along the circular path and downward

        // Make the camera look at the object's position
        let targetPosition = activeObject.position.clone();
        camera.lookAt(targetPosition);

        console.log("Camera position - X:", camera.position.x, "Y:", camera.position.y, "Z:", camera.position.z);
        renderer.render(scene, camera);
    }
});

//Add light to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1); 
topLight.position.set(-100, -100, -100);
topLight.castShadow = false;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "lily" ? 25 : 1);
scene.add(ambientLight);

if (objToRender) {
    controls = new OrbitControls(camera, renderer.domElement);
}


// function animate(){
//     requestAnimationFrame(animate);
// //use possibly within portfolio
//     if (object && objToRender === "lily"){
//         object.rotation.y = -3 + mouseX / window.innerWidth * 3;
//         object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
//     }
//     renderer.render(scene, camera);
// }

window.addEventListener("resize", function (){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// //add mouse position listener
// document.onmousemove = (e) => {
//     mouseX = e.clientX;
//     mouseY = e.clientY;
// }

//start 3d rendering
//animate();
