import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Animations } from './Animations.js';
import Game from './Game.js';

class Main {
    constructor() {
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
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
        //this.scene.add(gridHelper);

        const axisHelper = new THREE.AxesHelper(5);
        //this.scene.add(axisHelper);

        this.ambientLight = new THREE.AmbientLight(0x00ffff, 1.0);
        this.scene.add(this.ambientLight);

        // Temporary pointLight
        this.pointLight = new THREE.PointLight(0xffffff, 10000, 0);
        this.pointLight.position.set(0, 20, 20)
        this.pointLight.castShadow = true;

        this.pointLight.shadow.mapSize.width = 2048;
        this.pointLight.shadow.mapSize.height = 2048;

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

        // Object to call different animations
        this.Animations = new Animations(this.scene);

        this.cards = [];
        this.animationState = 'idle';
        this.indexONE = 0;
        this.indexTWO = 1;
        this.indexTHREE = 2;

        this.game = new Game(this.scene);
        console.log('Game initialized:', this.game, '\n\n');

        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('keydown', (event) => this.keydown(event), false);

    }

    // Our animate function
    animate(time) {
        this.stats.begin();
        this.controls.update();
        if ((this.game.removedPlayerId === 2)) {
            this.indexTWO = -1;
            this.indexTHREE = 1;
        } else if (this.game.removedPlayerId === 1) {
            this.indexONE = -1;
            this.indexTWO = 0;
            this.indexTHREE = 1;
        }
        var id = this.game.winningPlayerId;
        switch (this.animationState) {
            case 'draw':
                var i = this.Animations.flipCard("ONE", this.game.comparisonPool[this.indexONE], this.game.warCards, time);
                var ii = this.Animations.flipCard("TWO", this.game.comparisonPool[this.indexTWO], this.game.warCards, time);
                var iii = this.Animations.flipCard("THREE", this.game.comparisonPool[this.indexTHREE], this.game.warCards, time);
                this.animationState = (i || ii || iii) ? 'draw' : 'lift';
                break;
            case 'lift':
                if ((this.game.removedPlayerId === 2) && (id === 3)) {
                    id--;
                }
                var index = (this.game.playerDecks.length === 2) && (this.game.removedPlayerId === 1) ? id - 2 : id - 1;
                var deck = this.game.playerDecks[index].cards.slice(0, this.game.winningPool.length * -1);
                this.animationState = this.Animations.liftDeck(id, deck, this.game.winningPool.length, time) ? 'lift' : 'drawBack';
                break;
            case 'drawBack':
                this.animationState = this.Animations.drawBack(id, this.game.winningPool.toReversed(), time) ? 'drawBack' : 'idle';
                break;
        }
        this.renderer.render(this.scene, this.camera);
        this.stats.end();
    }

    // A function to update the projection matrix when the window is resized
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    keydown(event) {
        switch (event.keyCode) {
            case 78: // N
                if (this.game.gameActive && (this.animationState == 'idle')) {
                    this.game.playRound();
                    this.cards = this.game.comparisonPool;
                    this.animationState = 'draw';
                } else if (this.animationState == 'idle') {
                    console.log("The game has ended. You cannot play anymore.");
                }
                break;
            case 87: // W
                if (this.pointLight.visible) {
                    this.pointLight.position.z -= 2;
                }
                break;
            case 65: // A
                if (this.pointLight.visible) {
                    this.pointLight.position.x -= 2;
                }
                break;
            case 83: // S
                if (this.pointLight.visible) {
                    this.pointLight.position.z += 2;
                }
                break;
            case 68: // D
                if (this.pointLight.visible) {
                    this.pointLight.position.x += 2;
                }
                break;
            case 76: // L
                this.ambientLight.visible = !this.ambientLight.visible;
                break;
            case 77: // M
                this.pointLight.castShadow = !this.pointLight.castShadow
                break;
            case 80: // P
                this.pointLight.visible = !this.pointLight.visible
                break;
        }

    }

}

var game = new Main();