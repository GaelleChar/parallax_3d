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

camera.position.z = objToRender === "lily" ? 25 : 500;

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


function animate(){
    requestAnimationFrame(animate);
//use possibly within portfolio
    if (object && objToRender === "lily"){
        object.rotation.y = -3 + mouseX / window.innerWidth * 3;
        object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
    }
    renderer.render(scene, camera);
}

window.addEventListener("resize", function (){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener
document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

//start 3d rendering
animate();
