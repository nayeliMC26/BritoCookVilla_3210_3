import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Card from './Card';
import Game from './Game';

class Main {
    constructor() {
        // Initializing the scene, renderer, and camera
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x272727);

        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000)
        this.camera.position.set(0, 0, 10);
        this.scene.add(this.camera);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        document.body.appendChild(this.renderer.domElement);

        const testCard = new Card('3', 'diamonds');
        this.scene.add(testCard);

        this.renderer.setAnimationLoop(() => this.animate());

        window.addEventListener('resize', () => this.onWindowResize(), false);

        var game = new Game();

    }

    // Our animate function
    animate() {
        this.controls.update();
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
