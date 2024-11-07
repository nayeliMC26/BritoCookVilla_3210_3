import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Animations } from "./Animations.js";
import Game from "./Game.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// For bloom effect
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";

class Main {
    constructor() {
        this.warPopup = document.getElementById("warPopup");
        this.prevWar = 0;
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
        this.gameStarted = false;  // Flag to track if game has started
        this.gamePaused = false;   // Flag to track if game is paused
        // Initializing the scene, renderer, and camera
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x272727);
        this.renderer.setAnimationLoop((time) => this.animate(time));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        document.body.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            3000
        );
        this.camera.position.set(0, 25, 45);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);

        // Create the EffectComposer
        this.composer = new EffectComposer(this.renderer);

        // Create the RenderPass
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Create the UnrealBloomPass for bloom effect
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight), // Resolution
            0.4, // Bloom strength
            0.4, // Bloom radius
            1.0 // Bloom threshold
        );
        this.composer.addPass(this.bloomPass);

        // Optional: Create a ShaderPass to copy the result to the screen
        const copyPass = new ShaderPass(CopyShader);
        copyPass.renderToScreen = true;
        this.composer.addPass(copyPass);

        this.ambientLight = new THREE.AmbientLight(0x00ffff, 0.5);
        this.scene.add(this.ambientLight);

        // Temporary pointLight
        this.pointLight = new THREE.PointLight(0xffffff, 100, 0);
        this.pointLight.position.set(0, 10, 0);
        this.pointLight.castShadow = true;

        this.pointLight.shadow.mapSize.width = 2048;
        this.pointLight.shadow.mapSize.height = 2048;

        this.scene.add(this.pointLight);

        this.pointLightHelper = new THREE.PointLightHelper(this.pointLight);

        // Create a spotlight with white color and set its intensity
        this.spotlight = new THREE.SpotLight(0xffffff, 500); // Adjust intensity as needed
        this.spotlight.position.set(0, 300, 0); // Position the spotlight above and to the side of the model
        this.spotlight.angle = Math.PI / 4; // Spotlight spread angle
        this.spotlight.penumbra = 0.5; // Soft edges
        this.spotlight.decay = 1; // Decay rate, for realistic falloff
        this.spotlight.distance = 400; // Maximum range of the light
        this.spotlight.shadow.bias = -0.00005; // Prevents weird lines from appearing

        // Enable shadow casting
        this.spotlight.castShadow = true;
        this.spotlight.shadow.mapSize.width = 2048; // Shadow resolution
        this.spotlight.shadow.mapSize.height = 2048;

        // Add the spotlight to the scene
        this.scene.add(this.spotlight);

        const video = document.createElement("video");
        video.src = "public/assets/textures/table/tableScreen.mp4";
        video.load();
        video.loop = true;
        video.muted = true;
        video.play();

        const videoTexture = new THREE.VideoTexture(video);
        const blackMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const tableTopGeometry = new THREE.CylinderGeometry(18, 18, 1.75, 40);

        const tableTopMaterial = new THREE.MeshPhongMaterial({
            map: videoTexture,
            emissive: 0xffffff,
            emissiveMap: videoTexture,
            emissiveIntensity: 1.0,
        });

        const tableTop = new THREE.Mesh(tableTopGeometry, [
            blackMaterial, // Bottom material (black)
            tableTopMaterial, // Top material (with video)
            blackMaterial, // Side material (black)
        ]);

        tableTop.castShadow = true;
        tableTop.receiveShadow = true;
        tableTop.translateY(-1.75 / 2);
        this.scene.add(tableTop);

        this.loadTableEdge();
        this.loadDrone();
        this.createWarPlane();

        // Object to call different animations
        this.Animations = new Animations(this.scene);

        this.cards = [];
        this.animationState = 'idle';
        this.indexONE = 0;
        this.indexTWO = 1;
        this.indexTHREE = 2;

        this.game = new Game(this.scene);
        console.log("Game initialized:", this.game, "\n\n");

        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('keydown', (event) => this.keydown(event), false);

        /*
         * Adapted with the help of Chat GPT
         */
        // Adding event listeners for all of the CSS
        document.addEventListener('DOMContentLoaded', () => {
            const startButton = document.getElementById('startButton');
            const rulesButton = document.getElementById('rulesButton');
            const controlsButton = document.getElementById('controlsButton');
            const rulesContainer = document.getElementById('rulesContainer');
            const controlsContainer = document.getElementById('controlsContainer');
            const initialGUI = document.getElementById('initialGUI');
            const guiCanvas = document.getElementById('guiCanvas');
            const closeRulesX = document.getElementById('closeRulesX');
            const closeControlsX = document.getElementById('closeControlsX');
            const pauseMenu = document.getElementById('pauseMenu');
            const resumeButton = document.getElementById('resumeButton');
            const closePauseX = document.getElementById('closePauseX');
            const pauseMenuButtons = document.getElementById('pauseMenuButtons');

            // Start Game Button: Hide initial GUI and show game canvas
            startButton.addEventListener('click', () => {
                initialGUI.style.display = 'none';
                guiCanvas.style.display = 'block';
                this.gameStarted = true;
            });

            // Show Rules container
            function showRules() {
                initialGUI.style.display = 'none';
                pauseMenu.style.display = 'none';
                rulesContainer.style.display = 'block';
                rulesContainer.classList.add('show');
            }

            // Show Controls container
            function showControls() {
                initialGUI.style.display = 'none';
                pauseMenu.style.display = 'none';
                controlsContainer.style.display = 'block';
                controlsContainer.classList.add('show');
            }

            // Hide Rules and show initial GUI or pause menu
            closeRulesX.addEventListener('click', () => {
                rulesContainer.classList.remove('show');
                rulesContainer.style.display = 'none';
                if (this.gamePaused) {
                    pauseMenu.style.display = 'block';
                } else {
                    initialGUI.style.display = 'block';
                }
            });

            // Hide Controls and show initial GUI or pause menu
            closeControlsX.addEventListener('click', () => {
                controlsContainer.classList.remove('show');
                controlsContainer.style.display = 'none';
                if (this.gamePaused) {
                    pauseMenu.style.display = 'block';
                } else {
                    initialGUI.style.display = 'block';
                }
            });

            // Attach event listeners for Rules and Controls buttons
            rulesButton.addEventListener('click', showRules);
            controlsButton.addEventListener('click', showControls);

            // If user presses escape then show pause menu
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && this.gameStarted) {
                    this.togglePauseMenu();
                }
            });

            // Resume game from the pause menu
            resumeButton.addEventListener('click', () => {
                this.togglePauseMenu();
            });
            closePauseX.addEventListener('click', () => {
                this.togglePauseMenu();
            });
        });
    }

    togglePauseMenu() {
        if (!this.gameStarted) return;

        this.gamePaused = !this.gamePaused;
        pauseMenu.style.display = this.gamePaused ? "block" : "none";
        pauseMenu.classList.toggle("show", this.gamePaused);

        if (this.gamePaused) {
            // Move the rules and controls buttons to the pause menu
            pauseMenuButtons.appendChild(rulesButton);
            pauseMenuButtons.appendChild(controlsButton);
        } else {
            // Move buttons back to their original position in the initial GUI
            document.querySelector(".gui-content").appendChild(rulesButton);
            document.querySelector(".gui-content").appendChild(controlsButton);
        }
    }


    loadTableEdge() {
        // Create a loader for the GLTF/GLB model
        const loader = new GLTFLoader();

        // Path to the GLB model
        const modelPath = "public/assets/models/TableEdge.glb";

        // Load the GLB file
        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;

                model.scale.set(19, 19, 19);

                model.position.set(0, 0, 0);

                // Traverse the model and identify materials that are emissive
                model.traverse((object) => {
                    if (object.isMesh) {
                        object.castShadow = true; // Enable shadow casting for this mesh
                        object.receiveShadow = true; // Enable shadow receiving for this mesh
                    }

                    if (object.isMesh && object.material) {
                        const material = object.material;

                        // Check if the material has an emissive property that is not black
                        if (
                            material.emissive &&
                            !material.emissive.equals(new THREE.Color(0, 0, 0))
                        ) {
                            // Only modify emissive color if it is not black
                            material.emissive.set(0x73d2d9); // Set to blue
                        } else {
                            // If material is not emissive, ensure it doesn't have an emissive color
                            material.emissive.set(0x000000); // Ensuring non-emissive materials have black emissive value
                        }
                    }

                    if (
                        object.material &&
                        object.material.name === "Material.003"
                    ) {
                        object.material.roughness = 0.0; // Very glossy
                        object.material.metalness = 0.1; // Slightly metallic, adjust if needed
                    }

                    if (
                        object.material &&
                        object.material.name === "Material.001"
                    ) {
                        object.material.roughness = 0.5; // Some roughness for the brushed look
                        object.material.metalness = 0.7; // Fully metallic
                    }
                });

                // Add the loaded model to the scene
                this.scene.add(model);
            },
            undefined,
            (error) => {
                console.error("Error loading GLB model:", error);
            }
        );
    }

    loadDrone() {
        // Create a loader for the GLTF/GLB model
        const loader = new GLTFLoader();

        // Path to the GLB model
        const modelPath = "public/assets/models/Drone.glb";

        // Load the GLB file
        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;

                model.scale.set(1, 1, 1);

                model.position.set(0, 0, 0);

                // Add the loaded model to the point light
                this.pointLight.add(model);
            },
            undefined,
            (error) => {
                console.error("Error loading GLB model:", error);
            }
        );
    }

    createWarPlane() {
        // Create the plane geometry (same width and length as the table)
        const planeGeometry = new THREE.CylinderGeometry(18, 18, 0.1); // Adjust size to match the table

        // Create a transparent red material
        const redMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000, // Red color
            opacity: 0.6, // Transparent
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
            transparent: true, // Enable transparency
            depthTest: true,
            depthWrite: true,
        });

        // Create the plane mesh and position it above the table
        this.warPlane = new THREE.Mesh(planeGeometry, redMaterial);
        this.warPlane.position.set(0, -0.04, 0); // Position it above the table (adjust the y value to match the table height)
        this.warPlane.visible = false; // Start with the plane hidden

        // Add the plane to the scene
        this.scene.add(this.warPlane);
    }

    // Our animate function
    animate(time) {
        this.stats.begin();
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

        var curWar = this.game.warCount;

        if (this.game.getWarStatus() && this.prevWar != curWar) {
            this.prevWar = this.game.warCount;
            this.showWarPopUp();
        }

        this.updateEmissions();

        this.composer.render();
        this.stats.end();
    }

    showWarPopUp() {
        // Set the popup text
        console.log("Popup function called");
        this.warPopup.innerText = `WW${this.game.warCount}`;
        // Make the popup visible and start fade-in
        this.warPopup.style.display = "block";
        this.warPopup.style.opacity = "1";

        // After 1.5 seconds, fade out the popup
        setTimeout(() => {
            this.warPopup.style.opacity = "0";
            // After fade-out animation, hide it completely
            setTimeout(() => {
                this.warPopup.style.display = "none";
            }, 500); // Match this to the CSS transition duration
        }, 1500); // Display time
    }

    updateEmissions() {
        const color = this.game.getWarStatus() ? 0xfe4649 : 0x73d2d9; // Red if war is true, teal blue if false
        this.ambientLight.color.set(color);

        if (this.game.war) {
            this.warPlane.visible = true;
        } else {
            this.warPlane.visible = false;
        }

        this.scene.traverse((object) => {
            if (object.isMesh && object.material) {
                // If object material is emissive, change its color based on war state
                if (
                    object.material.emissive &&
                    object.material.emissive.getHex() != 0x000000
                ) {
                    const color = this.game.getWarStatus()
                        ? 0xfeabad
                        : 0x73d2d9; // Red if war is true, teal blue if false
                    object.material.emissive.set(color);
                }
            }
        });
    }

    // A function to update the projection matrix when the window is resized
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    keydown(event) {
        switch (event.key.toLowerCase()) {
            case "a":
                if (this.pointLight.visible) {
                    this.pointLight.position.x -= 0.5;
                }
                break;
            case "d":
                if (this.pointLight.visible) {
                    this.pointLight.position.x += 0.5;
                }
                break;
            case "l":
                this.ambientLight.visible = !this.ambientLight.visible;
                break;
            case "m":
                this.pointLight.castShadow = !this.pointLight.castShadow;
                this.spotlight.castShadow = !this.spotlight.castShadow;
                break;
            case "n":
                if (this.game.gameActive && (this.animationState == 'idle')) {

                    this.game.playRound();
                    this.cards = this.game.comparisonPool;
                    this.animationState = 'draw';
                } else if (this.animationState == 'idle') {
                    console.log("The game has ended. You cannot play anymore.");
                }
                break;
            case "p":
                this.pointLight.visible = !this.pointLight.visible;
                break;
            case "s":
                if (this.pointLight.visible) {
                    this.pointLight.position.z += 0.5;
                }
                break;
            case "w":
                if (this.pointLight.visible) {
                    this.pointLight.position.z -= 0.5;
                }
                break;
        }
    }
}

var game = new Main();
