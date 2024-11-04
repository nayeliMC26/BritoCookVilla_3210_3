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

        this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
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
        // this.scene.add(this.card);
        // this.scene.add(this.card2);
        // this.scene.add(this.card3);
        // this.scene.add(this.card4);
        // this.scene.add(this.card5);
        // this.scene.add(this.card6);


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

        this.cards = [];
        this.animationState = 'idle';
        this.winningPlayer = 0;
        this.cardsWon = 0;

        this.game = new Game(this.scene);
        console.log('Game initialized:', this.game, '\n\n');

        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('keydown', (event) => this.keydown(event), false);

    }

    // Our animate function
    animate(time) {
        this.stats.begin();
        this.controls.update();
        switch (this.animationState) {
            case 'draw':
                var i = this.Animations.flipCard("ONE", this.cards[0], time);
                var ii = this.Animations.flipCard("TWO", this.cards[1], time);
                var iii = this.Animations.flipCard("THREE", this.cards[2], time);
                console.log((i || ii || iii));
                if (!(i || ii || iii)) {
                    this.winningPlayer = this.game.winningPlayerId;
                    this.cardsWon = this.game.winningPool.length
                }
                this.animationState = (i || ii || iii) ? 'draw' : 'lift';
                break;
            case 'lift':
                var id = this.winningPlayer;
                var i = this.Animations.liftDeck(id, this.game.playerDecks[id - 1].cards.slice(0, this.cardsWon * -1), time);
                this.animationState = (i) ? 'lift' : 'idle';
                break;
            case 'return':
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
            case 76:
                this.ambientLight.visible = !this.ambientLight.visible;
                break;
            case 77:
                console.log('Shadow should change')
                break;
            case 78:
                if (this.game.gameActive) {
                    this.cards = this.game.playRound();
                    // this.game.compareCard();
                    this.animationState = 'draw';
                } else {
                    console.log("The game has ended. You cannot play anymore.");
                }
                break;
            case 80:
                this.pointLight.visible = !this.pointLight.visible
                break;
        }

    }

}

var game = new Main();