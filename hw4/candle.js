import * as THREE from "https://cdn.skypack.dev/three@0.133.1";
import { scene } from './main.js';

class Candle {

	constructor(radius, height, color, positionX, positionZ) {

		this.posX = positionX;
		this.posZ = positionZ;
		this.intervalHandle;
		this.count = Math.floor(Math.random() * 20);
		this.candle = new THREE.Group();

		//make a body

		this.body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 60),
			new THREE.MeshPhongMaterial({ color: color }));

		this.body.position.y = height / 2;
		this.body.position.x = positionX;
		this.body.position.z = positionZ;

		this.candle.add(this.body);

		//make a thread

		this.thread = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 60),
			new THREE.MeshPhongMaterial({ color: 0x000000 }));

		this.thread.position.x = positionX;
		this.thread.position.z = positionZ;
		this.thread.position.y = height + 3 / 2;
		this.candle.add(this.thread);

		//make a spotlight

		this.spotLight = new THREE.SpotLight(0xffffff);
		this.candle.add(this.spotLight);
		this.spotLight.angle = Math.PI / 4;
		this.spotLight.position.y = 30;
		this.spotLight.target = this.body;

		this.spotLight.castShadow = true;
		this.spotLight.penumbra = 0.51;
		this.spotLight.shadow.mapSize.width = 1024;
		this.spotLight.shadow.mapSize.height = 1024;

		this.spotLight.shadow.camera.near = 10;
		this.spotLight.shadow.camera.far = 40;
		this.spotLight.shadow.camera.fov = 120;

		//scene.add(new THREE.SpotLightHelper(this.spotLight));

		scene.add(this.candle);

		this.intervalHandle = setInterval(this.textureAnimate.bind(this), 100);
	}
	makeFlame() {

		var loader = new THREE.TextureLoader();
		// load a resource
		var texture = loader.load(
			// URL ...
			'fire.png',
			// onLoad ...
			function (texture) {
				// do something with the texture
				// Plane with default texture coordinates [0,1]x[0,1]
			},
			undefined, // onProgress
			// onError ...
			function (xhr) {
				console.log('An error happened');
			}
		);
		var texMat = new THREE.MeshBasicMaterial({
			map: texture,
			alphaTest: 0.5
		});
		this.flameMesh = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), texMat);
		this.flameMesh.name = "fire";
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(1 / 3, 1 / 3);
		texture.offset.set(0, 2 / 3);
		this.candle.add(this.flameMesh);
		scene.add(this.candle);
		this.flameMesh.position.y = 28;
		this.flameMesh.position.z = this.posZ;
		this.flameMesh.position.x = this.posX;
	}

	textureAnimate() {
		this.count = (this.count === undefined) ? 1 : this.count;
		if (this.flameMesh !== undefined) {
			var texture = this.flameMesh.material.map;
			texture.offset.x += 1 / 3;
			if (this.count % 3 === 0) {
				texture.offset.y -= 1 / 3;
			}
			this.count++;
		}
	}

	reset() {

		clearInterval(this.intervalHandle);
		this.flameMesh.visible = false;
		this.spotLight.visible = false;
		this.count = 0;

		setTimeout(this.restart.bind(this), 3000);
	}

	restart() {
		this.spotLight.visible = true;
		this.flameMesh.visible = true;
		this.intervalHandle = setInterval(this.textureAnimate.bind(this), 100);
	}

}

export { Candle };
