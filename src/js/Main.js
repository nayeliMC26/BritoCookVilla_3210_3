import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
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
            65,
            window.innerWidth / window.innerHeight,
            0.1,
            3000
        );
        this.camera.position.set(0, 20, 30);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        // Enable auto-rotation on the controls
        this.controls.enableDamping = true; // Smooth transition when rotating
        this.controls.dampingFactor = 0.25; // Adjust damping for a smoother effect
        this.controls.enableZoom = true; // Enable zoom if needed
        this.controls.autoRotate = true; // Enable auto-rotation
        this.controls.autoRotateSpeed = -0.3; // Control the speed of the auto-rotation

        // Set the center of the orbit (usually the center of the scene)
        this.controls.target.set(0, 0, 0); // Look at the center

        const gridHelper = new THREE.GridHelper(50, 50);
        //this.scene.add(gridHelper);

        const axisHelper = new THREE.AxesHelper(5);
        //this.scene.add(axisHelper);

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
        //this.scene.add(this.pointLightHelper, 1.0)

        //const testCard = new Card('3', 'diamonds', 0);
        //this.scene.add(testCard);

        // Create a spotlight with white color and set its intensity
        const spotlight = new THREE.SpotLight(0xffffff, 500); // Adjust intensity as needed
        spotlight.position.set(0, 300, 0); // Position the spotlight above and to the side of the model
        spotlight.angle = Math.PI / 4; // Spotlight spread angle
        spotlight.penumbra = 0.5; // Soft edges
        spotlight.decay = 1; // Decay rate, for realistic falloff
        spotlight.distance = 400; // Maximum range of the light

        // Enable shadow casting
        spotlight.castShadow = true;
        spotlight.shadow.mapSize.width = 2048; // Shadow resolution
        spotlight.shadow.mapSize.height = 2048;

        // Add the spotlight to the scene
        this.scene.add(spotlight);

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
            new THREE.Vector3(-9, 0, 0),
        ]);
        const geo = new THREE.BufferGeometry().setFromPoints(
            this.testPath.getPoints(50)
        );
        const mat = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(geo, mat);
        this.scene.add(line);

        // Object to call different animations
        this.Animations = new Animations(this.scene);

        this.game = new Game(this.scene);
        console.log("Game initialized:", this.game, "\n\n");

        window.addEventListener("resize", () => this.onWindowResize(), false);
        window.addEventListener(
            "keydown",
            (event) => this.keydown(event),
            false
        );
        this.test = true;

        /*var testDeck = new Deck(this.scene);
        this.t1 = false;
        this.t2 = false;
        this.t3 = false;
        this.t4 = false;
        this.t5 = false;
        this.t6 = false;
*/

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

    // Our animate function
    animate(time) {
        this.stats.begin();
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

        this.updateEmissions();  // Always call this during war
        //this.updateEmissions();

        this.composer.render();
        // this.renderer.render(this.scene, this.camera);
        this.stats.end();
    }

    updateEmissions() {
        const color = this.game.getWarStatus()
                        ? 0xfe4649
                        : 0x73d2d9; // Red if war is true, teal blue if false
        this.ambientLight.color.set(color);

        this.scene.traverse((object) => {
            if (object.isMesh && object.material) {
                // If object material is emissive, change its color based on war state
                if (object.material.emissive && object.material.emissive.getHex() != 0x000000) {
                    const color = this.game.getWarStatus()
                        ? 0xfeabad
                        : 0x73d2d9; // Red if war is true, teal blue if false
                    object.material.emissive.set(color);
                    if (this.game.getWarStatus()) {
                        console.log("HEY I WORK!")
                    }
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
            case "1":
                this.t1 = true;
                break;
            case "2":
                this.t2 = true;
                break;
            case "3":
                this.t3 = true;
                break;
            case "4":
                this.t4 = true;
                break;
            case "5":
                this.t5 = true;
                break;
            case "6":
                this.t6 = true;
                break;
            case "a":
                if (this.pointLight.visible) {
                    this.pointLight.position.x += 0.5;
                }
                break;
            case "d":
                if (this.pointLight.visible) {
                    this.pointLight.position.x -= 0.5;
                }
                break;
            case "l":
                this.ambientLight.visible = !this.ambientLight.visible;
                break;
            case "m":
                this.pointLight.castShadow = !this.pointLight.castShadow;
                break;
            case "n":
                if (this.game.gameActive) {
                    this.game.playRound();
                    this.game.compareCard();
                    console.log("Game state:", this.game, "\n\n");
                } else {
                    console.log("The game has ended. You cannot play anymore.");
                }
                break;
            case "p":
                this.pointLight.visible = !this.pointLight.visible;
                break;
            case "s":
                if (this.pointLight.visible) {
                    this.pointLight.position.z -= 0.5;
                }
                break;
            case "w":
                if (this.pointLight.visible) {
                    this.pointLight.position.z += 0.5;
                }
                break;
        }
    }
}

var game = new Main();
