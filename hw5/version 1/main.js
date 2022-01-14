import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { UtahTeapot } from "./Utah_teapot.js";

var renderer, camera, scene;
var angle = 0, pointLight;
var utahTeapots = [[], [], [], [], [], [], [], [], [], []];

function init() {

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();

    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x888888);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.set(0, 200, 300);

    let controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    ///////////////////////////

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xffffff);
    scene.add(pointLight);
    scene.add(new THREE.PointLightHelper(pointLight, 5));

    ///////////////////////////  	

    let floor = new THREE.Mesh(new THREE.PlaneGeometry(300, 300),
        new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    scene.add(floor);
    floor.rotation.x = -Math.PI / 2;

    floor.receiveShadow = true;

    /////////////////////////////////

    let x = -120;
    let z = 120

    for (let i = 0; i < 10; i++) {
        x = 120;
        for (let j = 0; j < 10; j++) {

            utahTeapots[i][j] = new UtahTeapot(5, x, z);
            x -= 27;
        }
        z -= 27;
    }
};

function animate() {

    angle += 0.01;
    pointLight.position.set(100 * Math.cos(angle), 80, 100 * Math.sin(angle));

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            utahTeapots[i][j].utahTeapot.rotation.y = 1.3 * angle;
            utahTeapots[i][j].utahTeapot.material.uniforms.lightpos.value.copy(pointLight.position);
        }
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export { init, animate, scene };

