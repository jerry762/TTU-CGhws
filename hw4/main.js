import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js";

import { Candle } from "./candle.js";

var renderer, camera, scene;
var raycaster;
var mouseLoc;
var candles = [], pickables = [];

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
	camera.position.set(0, 150, 200);

	let controls = new OrbitControls(camera, renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);

	///////////////////////////
	let spotLight = new THREE.SpotLight(0xffffff);
	spotLight.angle = Math.PI / 3;
	spotLight.position.set(0, 130, 0);


	spotLight.decay = 2;
	spotLight.castShadow = true;
	spotLight.penumbra = 0.54;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;

	spotLight.shadow.camera.near = 50;
	spotLight.shadow.camera.far = 250;
	spotLight.shadow.camera.fov = 120;//spotLight.angle*Math.PI/180*2;;

	scene.add(spotLight);
	//scene.add(new THREE.SpotLightHelper(spotLight));
	//scene.add(new THREE.CameraHelper(spotLight.shadow.camera));

	///////////////////////////  	
	let floor = new THREE.Mesh(new THREE.PlaneGeometry(300, 300),
		new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
	scene.add(floor);
	floor.rotation.x = -Math.PI / 2;

	floor.receiveShadow = true;

	/////////////////////////////////

	var candle1 = new Candle(5, 20, 0xffff00, -75, 75);
	candle1.candle.name = 'candle1';
	var candle2 = new Candle(5, 20, 0xff8000, 0, 75);
	candle2.candle.name = 'candle2';
	var candle3 = new Candle(5, 20, 0x0000ff, 75, 75);
	candle3.candle.name = 'candle3';
	var candle4 = new Candle(5, 20, 0x00ff00, -75, 0);
	candle4.candle.name = 'candle4';
	var candle5 = new Candle(5, 20, 0x00ffff, 0, 0);
	candle5.candle.name = 'candle5';
	var candle6 = new Candle(5, 20, 0xff0040, 75, 0);
	candle6.candle.name = 'candle6';
	var candle7 = new Candle(5, 20, 0xbfff00, -75, -75);
	candle7.candle.name = 'candle7';
	var candle8 = new Candle(5, 20, 0x8000ff, 0, -75);
	candle8.candle.name = 'candle8';
	var candle9 = new Candle(5, 20, 0xff00bf, 75, -75);
	candle9.candle.name = 'candle9';


	candles.push(candle1, candle2, candle3, candle4, candle5, candle6,
		candle7, candle8, candle9);

	candles.forEach(function (t) {
		t.makeFlame();
		pickables.push(t.candle);
	});

	raycaster = new THREE.Raycaster();
	mouseLoc = new THREE.Vector2();
	document.addEventListener('pointerdown', doPointerDown, false);
};

function animate() {

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	candles.forEach(function (b) { b.flameMesh.lookAt(camera.position.x, 0, camera.position.z); });
};

function doPointerDown(event) {
	event.preventDefault();

	mouseLoc.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouseLoc.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouseLoc, camera);
	var intersects = raycaster.intersectObjects(pickables);

	if (intersects.length > 0) {
		console.log(intersects.length + ' picked ...');
		console.log(intersects[0].object.parent.name);

		for (let i = 0; i < candles.length; i++) {
			if (candles[i].candle.name == intersects[0].object.parent.name) {

				candles[i].reset();
			}
		}
	} else {
		console.log('nothing picked...');
	}

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

export { init, animate, scene };
