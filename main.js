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
let objToRender ='lily';

//.gltf -> file format 3D files retaining a consistent PBR workflow
const loader = new GLTFLoader();


loader.load(
    `models/${objToRender}/scene.gltf`,
    function(gltf){
        object = gltf.scene; 
        scene.add(object);
    },
    function(xhr){
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error){
        console.error(error);
    }
);

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

let cameraStartZ = 500;      // Initial camera z position (farther from object)
let cameraEndZ = 4;          // Final camera z position (closer to object)
let cameraStartX = 0;        // Initial x position
let maxXShift = 50;          // Max shift in x axis during scroll
let maxRotationY = Math.PI;  // 180 degrees in radians for full rotation
let scrollFactor = 0.5;      // Sensitivity of scroll movement
let totalScroll = 0;         // Tracks total scroll movement
let maxScroll = 1000;        // Max scroll distance for full model view

// Listen for scroll (wheel) event
document.getElementById("wheel").addEventListener("wheel", function(event) {
    // Determine scroll direction (+/-) and update total scroll
    totalScroll += event.deltaY * scrollFactor;

    // Normalize scroll: clamp totalScroll between 0 and maxScroll, then map to a 0-1 range
    let scrollProgress = Math.max(0, Math.min(totalScroll, maxScroll)) / maxScroll;

    // Calculate camera position and rotation based on scroll progress
    camera.position.z = cameraStartZ - scrollProgress * (cameraStartZ - cameraEndZ);
    camera.position.x = cameraStartX + scrollProgress * maxXShift;
    camera.rotation.y = scrollProgress * maxRotationY;

    console.log("cameraZ" + camera.position.z);
    console.log("cameraX" + camera.position.x);
    console.log("cameraY" + camera.rotation.y);

    // Optional: Render the scene after updating the camera and object
    renderer.render(scene, camera);
});


//Add light to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1); 
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "lily" ? 5 : 1);
scene.add(ambientLight);

if (objToRender === "lily") {
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
