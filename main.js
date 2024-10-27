import * as THREE from 'three';
import { Animations } from './Animations.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Main {
    constructor() {
        // Initializing the scene, renderer, and camera
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x272727);
        this.renderer.setAnimationLoop((time) => this.animate(time));

        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000)
        this.scene.add(this.camera);
        // this.camera.position.set(-50, 30, 25);
        this.camera.position.set(-10, 20, 30);
        document.body.appendChild(this.renderer.domElement);

        const gridHelper = new THREE.GridHelper(50, 50);
        // this.scene.add(gridHelper);

        const axisHelper = new THREE.AxesHelper();
        // this.scene.add(axisHelper);

        // Add the custom geometry
        const vertices = [
            // front
            { pos: [0, 0.2, 0], color: [1.0, 0, 0] },
            { pos: [2.5, 0.2, 0], color: [1.0, 0, 0] },
            { pos: [2.5, 0.2, -3.5], color: [1.0, 0, 0] },
            { pos: [0, 0.2, -3.5], color: [1.0, 0, 0] },
            { pos: [0, 0, 0], color: [1.0, 1.0, 1.0] },
            { pos: [2.5, 0, 0], color: [1.0, 1.0, 1.0] },
            { pos: [2.5, 0, -3.5], color: [1.0, 1.0, 1.0] },
            { pos: [0, 0, -3.5], color: [1.0, 1.0, 1.0] }
        ];
        const positions = [];
        const normals = [];
        const uvs = [];
        const colors = []
        for (const vertex of vertices) {
            positions.push(...vertex.pos);
            // normals.push(...vertex.norm);
            // uvs.push(...vertex.uv);
            colors.push(...vertex.color);
        }
        const geometry = new THREE.BufferGeometry();


        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        // geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        // geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        const indices = new Uint16Array([
            0, 1, 2, 0, 2, 3,  // Front face
            5, 4, 7, 5, 7, 6,  // Back face
            3, 2, 6, 3, 6, 7,  // Top face
            4, 5, 1, 4, 1, 0,  // Bottom face
            5, 6, 2, 5, 2, 1,  // Right face
            7, 4, 0, 7, 0, 3  // Left face
        ]);
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));

        // const geometry2 = new THREE.BoxGeometry(2.5, 0.2, 1);
        const material2 = new THREE.MeshBasicMaterial({ vertexColors: true });
        this.cube = new THREE.Mesh(geometry, material2);
        this.scene.add(this.cube);


        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.4, 0),
            new THREE.Vector3(0, 5, -5),
            new THREE.Vector3(0, 0, -10)

        ]);


        // const geo = new THREE.BufferGeometry().setFromPoints(this.path.getPoints(50));
        const mat = new THREE.LineBasicMaterial({ color: 0xffffff });
        // const line = new THREE.Line(geo, mat);

        // this.scene.add(line);

        this.Animations = new Animations();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.pt = 0;

        this.act = true;
        this.test = 0;

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    // Our animate function
    animate(time) {
        this.controls.update();
        const t = (time / 400 % 4) / 4;

        if (this.act) {

            this.act = this.Animations.flipCard(this.cube, time);
            // console.log(this.act)

        }
        if (!this.act){
            this.act = !this.act;
        }
        console.log(this.test);
        // if (t > this.pt) {
        //     const pos = this.path.getPointAt(t);
        //     this.cube.position.copy(pos);
        //     // this.cube.translateX(-1.25);
        //     // this.cube.rotateZ(Math.PI);
        //     if (t >= 0.25) {
        //         this.cube.rotation.z = ((-Math.PI * ((t - 0.25) / 0.75)) * -1);

        //         // this.cube.rotateZ((Math.PI * ((t - 0.25) / 0.75)) - this.cube.rotation.z);
        //     }
        //     this.pt = t;
        // } else {
        //     this.cube.rotation.z = Math.PI;
        //     console.log("math.pi")
        // }




        this.renderer.render(this.scene, this.camera);
    }

    // A function to update the projection matrix when the window is resized
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }
}

var game = new Main();