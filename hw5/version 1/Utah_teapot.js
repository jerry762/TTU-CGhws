import * as THREE from "https://threejs.org/build/three.module.js";
import { scene } from './main.js';
import { TeapotGeometry } from "https://threejs.org/examples/jsm/geometries/TeapotGeometry.js";

class UtahTeapot {

    constructor(size, positionX, positionZ) {

        this.posX = positionX;
        this.posZ = positionZ;

        this.meshMaterial = new THREE.ShaderMaterial({
            uniforms: {
                'lightpos': { type: 'v3', value: new THREE.Vector3() }
            },
            vertexShader: [
                "uniform vec3 lightpos;",
                "varying vec3 eyelightdir;",
                "varying vec3 eyenormal;",
                "varying vec4 eyepos;",
                "void main() {",
                "gl_Position = projectionMatrix* modelViewMatrix * vec4( position, 1.0);",
                "eyepos = modelViewMatrix * vec4 (position, 1.0);",
                "vec4 eyelightpos= viewMatrix * vec4 (lightpos, 1.0);",
                "eyelightdir =  eyelightpos.xyz - eyepos.xyz;",
                "eyenormal = normalMatrix * normal;",
                "}"
            ].join("\n"),
            fragmentShader: [
                "varying vec3 eyelightdir;",
                "varying vec3 eyenormal;",
                "varying vec4 eyepos;  ",
                "void main() {",
                "float intensity = dot (normalize (eyenormal), normalize (eyelightdir));",
                "if (intensity > 0.8)",
                "intensity = 0.8;",
                "else if (intensity > 0.4)",
                "intensity = 0.4;",
                "else",
                "intensity = 0.0;",
                "vec3 diffuse = intensity*vec3 (1,1,1);",
                "gl_FragColor = vec4 (diffuse + vec3(0,0,0.13), 1.0);",
                "}"
            ].join("\n")
        });

        this.utahTeapot = new THREE.Mesh(new TeapotGeometry(size), this.meshMaterial);
        this.utahTeapot.position.y = size;
        this.utahTeapot.position.x = this.posX;
        this.utahTeapot.position.z = this.posZ;

        scene.add(this.utahTeapot);

    }
}

export { UtahTeapot };
