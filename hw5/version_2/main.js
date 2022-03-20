import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js";
import { UtahTeapot } from "./Utah_teapot.js";

var renderer, camera, scene, sceneRTT;
var angle = 0, pointLight, controls;
var mesh, quad, renderTarget;
var utahTeapotsRTT = [[], [], [], [], [], [], [], [], [], []];
var imCam, imRadius;

function init() {

    sceneRTT = new THREE.Scene();
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });

    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x888888);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.set(0, 200, 300);

    controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    imCam = new THREE.PerspectiveCamera();
    imCam.copy(camera);

    ///////////////////////////

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xffffff);
    sceneRTT.add(pointLight);
    //scene.add(new THREE.PointLightHelper(pointLight, 5));

    ///////////////////////////  	

    mesh = new UtahTeapot(5);
    mesh.geometry.computeBoundingSphere();
    imRadius = mesh.geometry.boundingSphere.radius;

    sceneRTT.add(mesh.utahTeapot);


    renderTarget = new THREE.WebGLRenderTarget(
        1024, 1024, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
    }
    );

    let plane = new THREE.PlaneBufferGeometry(40, 20);

    let rttmaterial = new THREE.ShaderMaterial({
        uniforms: {
            mytex: {
                type: "T",
                value: renderTarget.texture
            }
        },
        side: THREE.DoubleSide,
        vertexShader: [
            "varying vec2 vUv;",
            "void main() {",
            "gl_Position = projectionMatrix* modelViewMatrix * vec4( position, 1.0);",
            "vUv = uv;",
            "}"
        ].join("\n"),
        fragmentShader: [
            "uniform sampler2D mytex;",
            "varying vec2 vUv;",

            "void main() {",
            "vec4 myColor = texture2D(mytex,vUv);",

            "if(myColor.r == 1.0 && myColor.g == 1.0 && myColor.b == 0.0)",
            "discard;",
            "else",
            "gl_FragColor = myColor;",
            "}"
        ].join("\n")
    });

    /////////////////////////////////

    let x = -120;
    let z = 120

    for (let i = 0; i < 10; i++) {
        x = 120;
        for (let j = 0; j < 10; j++) {
            quad = new THREE.Mesh(plane, rttmaterial);
            quad.position.set(x, 0, z)
            utahTeapotsRTT[i][j] = quad;
            scene.add(quad);
            x -= 27;
        }
        z -= 27;
    }

};

function animate() {

    angle += 0.01;
    pointLight.position.set(100 * Math.cos(angle), 80, 100 * Math.sin(angle));

    mesh.utahTeapot.material.uniforms.lightpos.value.copy(pointLight.position);
    mesh.utahTeapot.rotation.y = 1.3 * angle;

    let d = imRadius / Math.sin(imCam.fov / 180 * Math.PI / 2);
    imCam.position.copy((camera.position.clone().sub(controls.target)).setLength(d));
    imCam.lookAt(0, 0, 0);

    renderer.setRenderTarget(renderTarget);
    renderer.setClearColor(0xffff00);
    renderer.render(sceneRTT, imCam);

    renderer.setRenderTarget(null);
    renderer.setClearColor(0x888888);

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            utahTeapotsRTT[i][j].lookAt(camera.position);
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

export { init, animate };

