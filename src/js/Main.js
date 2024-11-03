import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Animations } from './Animations.js';
import { Deck } from './Deck.js';
import Game from './Game.js'

class Main {
    constructor() {
        // Initializing the scene, renderer, and camera
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x272727);
        this.renderer.setAnimationLoop((time) => this.animate(time));
        this.renderer.shadowMap.enabled = true;



        document.body.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000)
        this.camera.position.set(0, 30, 50);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);


        this.controls = new OrbitControls(this.camera, this.renderer.domElement);



        const gridHelper = new THREE.GridHelper(50, 50);
        this.scene.add(gridHelper);

        const axisHelper = new THREE.AxesHelper(5);
        this.scene.add(axisHelper);


        var deck = new Deck(this.scene);
        deck.addToScene();

        this.game = new Game();

        this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(this.ambientLight);

        // Temporary pointLight
        this.pointLight = new THREE.PointLight(0xffffff, 10000, 0);
        this.pointLight.position.set(0, 20, 20)
        this.pointLight.castShadow = true;
        this.scene.add(this.pointLight)

        this.pointLightHelper = new THREE.PointLightHelper(this.pointLight)
        //this.scene.add(this.pointLightHelper, 1.0)



        //const testCard = new Card('3', 'diamonds', 0);
        //this.scene.add(testCard);

        // Temporary table top
        const tableTopGeometry = new THREE.CylinderGeometry(18, 18, 1.75, 40);
        const tableTopMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
        const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
        tableTop.castShadow = true;
        tableTop.receiveShadow = true;
        tableTop.translateY(-1.75 / 2)
        this.scene.add(tableTop);

        // Temporary Cards
        const geometry = new THREE.BoxGeometry(2.5, 0.02, 3.5);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const material2 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        const material3 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const material4 = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        const material5 = new THREE.MeshPhongMaterial({ color: 0xff00ff });
        const material6 = new THREE.MeshPhongMaterial({ color: 0x00ffff });
        this.card = new THREE.Mesh(geometry, material);
        this.card2 = new THREE.Mesh(geometry, material2);
        this.card3 = new THREE.Mesh(geometry, material3);
        this.card4 = new THREE.Mesh(geometry, material4);
        this.card5 = new THREE.Mesh(geometry, material5);
        this.card6 = new THREE.Mesh(geometry, material6);
        this.card.castShadow = true;
        this.card.receiveShadow = true;
        this.card2.castShadow = true;
        this.card2.receiveShadow = true;
        this.card3.castShadow = true;
        this.card3.receiveShadow = true;
        this.card4.castShadow = true;
        this.card4.receiveShadow = true;
        this.card5.castShadow = true;
        this.card5.receiveShadow = true;
        this.card6.castShadow = true;
        this.card6.receiveShadow = true;


        // this.card.position.set(-14, 0.01 / 2, 0);
        this.card.position.set(-14, 0.025, 0);
        this.card.rotateY(-Math.PI / 2);
        // this.card2.position.set(14, 0.01, 0);
        this.card2.position.set(-14, 0.075, 0);
        this.card2.rotateY(Math.PI / 2);
        this.card3.position.set(-14, 0.125, 0);
        // this.card3.position.set(-4, 0.01, 0);
        this.card3.rotateY(Math.PI / 2);
        this.card4.rotateY(-Math.PI / 2);
        this.card4.position.set(-14, 0.175, 0);
        // this.card2.position.set(14, 0.01, 0);
        this.card5.position.set(-14, 0.225, 0);
        this.card5.rotateY(Math.PI / 2);
        this.card6.position.set(-14, 0.275, 0);
        // this.card3.position.set(-4, 0.01, 0);
        this.card6.rotateY(Math.PI / 2);
        this.scene.add(this.card);
        this.scene.add(this.card2);
        this.scene.add(this.card3);
        this.scene.add(this.card4);
        this.scene.add(this.card5);
        this.scene.add(this.card6);


        // Line to test paths
        this.testPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-14, 0, 0),
            new THREE.Vector3(-11.5, 3, 0),
            new THREE.Vector3(-9, 0, 0)
        ]);
        const geo = new THREE.BufferGeometry().setFromPoints(this.testPath.getPoints(50));
        const mat = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(geo, mat);
        this.scene.add(line);

        // Object to call different animations
        this.Animations = new Animations(this.scene);

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('keydown', (event) => this.keydown(event), false);
        this.test = true

        var testDeck = new Deck(this.scene);
        this.t1 = false;
        this.t2 = false;
        this.t3 = false;
        this.t4 = false;
        this.t5 = false;
        this.t6 = false;

    }

    // Our animate function
    animate(time) {
        this.controls.update();
        if (this.t1) {
            this.t1 = this.Animations.flipCard("ONE", this.card6, time);
        }
        if (this.t2) {
            this.t2 = this.Animations.war("ONE", this.card5, this.card4, time);
        }
        if (this.t3) {
            this.t3 = this.Animations.war("ONE", this.card3, this.card2, time);
        }

        this.renderer.render(this.scene, this.camera);
    }

    // A function to update the projection matrix when the window is resized
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    keydown(event) {
        switch (event.keyCode) {
            case 49:
                this.t1 = true;
                break;
            case 50:
                this.t2 = true;
                break;
            case 51:
                this.t3 = true;
                break;
            case 52:
                this.t4 = true;
                break;
            case 53:
                this.t5 = true;
                break;
            case 54:
                this.t6 = true;
                break;
            case 76:
                this.ambientLight.visible = !this.ambientLight.visible;
                break;
            case 77:
                console.log('Shadow should change')
                break;
            case 78:
                this.game.playCard()
                this.game.compareCard()
                break;
            case 80: 
            this.pointLight.visible = !this.pointLight.visible
            break;
        }

    }

}

var game = new Main();