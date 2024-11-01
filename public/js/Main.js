import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Animations from './Animations';
import Card from './Card';
import Game from './Game';

class Main {
    constructor() {
        // Initializing the scene, renderer, and camera
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x272727);
        this.renderer.setAnimationLoop((time) => this.animate(time));
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000)
        this.camera.position.set(0, 40, 50);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);


        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        const gridHelper = new THREE.GridHelper(50, 50);
        this.scene.add(gridHelper);

        const axisHelper = new THREE.AxesHelper(5);
        this.scene.add(axisHelper);


        const testCard = new Card('3', 'diamonds');
        this.scene.add(testCard);

        // Temporary table top
        const tableTopGeometry = new THREE.CircleGeometry(18, 40);
        const tableTopMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
        const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
        tableTop.rotateX(Math.PI / 2);
        this.scene.add(tableTop);

        // Temporary Cards
        const geometry = new THREE.BoxGeometry(2.5, 0.0079, 3.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const material3 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.card = new THREE.Mesh(geometry, material);
        this.card2 = new THREE.Mesh(geometry, material2);
        this.card3 = new THREE.Mesh(geometry, material3);
        this.card.position.set(-14, 0.01 / 2, 0);
        this.card.rotateY(-Math.PI / 2);
        this.card2.position.set(14, 0.01, 0);
        this.card2.rotateY(Math.PI / 2);
        this.card3.position.set(0, 0.01 / 2, -14);
        this.card3.rotateY(Math.PI);
        this.scene.add(this.card);
        this.scene.add(this.card2);
        this.scene.add(this.card3);

        // Line to test paths
        this.testPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.0079, -14),
            new THREE.Vector3(0, 3, -9),
            new THREE.Vector3(0, 0, -4)
        ]);
        const geo = new THREE.BufferGeometry().setFromPoints(this.testPath.getPoints(50));
        const mat = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(geo, mat);
        this.scene.add(line);

        // Object to call different animations
        this.Animations = new Animations(this.scene);

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        window.addEventListener('resize', () => this.onWindowResize(), false);

        this.game = new Game();
        this.keyHandler = this.keyHandler.bind(this);
        document.addEventListener("keydown", this.keyHandler, false);


    }
  
    keyHandler(e) {
        switch (e.keyCode) {
            case 78:
                    this.game.playCard()
                    this.game.compareCard()
                    break;

        }
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

