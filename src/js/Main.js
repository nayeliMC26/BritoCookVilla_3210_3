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
        this.renderer.shadowMap.enabled = true;

        document.body.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            0.1,
            3000
        );
        this.camera.position.set(0, 30, 50);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        const gridHelper = new THREE.GridHelper(50, 50);
        //this.scene.add(gridHelper);

        const axisHelper = new THREE.AxesHelper(5);
        //this.scene.add(axisHelper);

        this.ambientLight = new THREE.AmbientLight(0x00ffff, 1.0);
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

        const video = document.createElement("video");
        video.src = "public/assets/textures/table/tableScreen.mp4";
        video.load();
        video.play();
        video.loop = true;
        video.muted = true;

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
            0.3, // Bloom strength
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
        const textureLoader = new THREE.TextureLoader();

        // Load the noise texture
        const noiseTexture = textureLoader.load(
            "public/assets/textures/table/noise.jpg"
        );
        noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
        noiseTexture.repeat.set(4, 4); // Adjust tiling as needed for desired noise scale

        // Path to the GLB model
        const modelPath = "public/assets/models/TableEdge.glb";

        // Load the GLB file
        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;

                model.scale.set(19, 19, 19);

                model.position.set(0, 0, 0);

                // Traverse through each child in the model to apply metallic properties with noise
                model.traverse((child) => {
                    if (child.isMesh) {
                        const originalMaterial = child.material;

                        // Only modify material if it exists and is a standard or physical material
                        if (
                            originalMaterial &&
                            (originalMaterial.isMeshStandardMaterial ||
                                originalMaterial.isMeshPhysicalMaterial)
                        ) {
                            child.material = new THREE.MeshStandardMaterial({
                                // Preserve original texture and emissive settings
                                map: originalMaterial.map || null,
                                emissive:
                                    originalMaterial.emissive ||
                                    new THREE.Color(0x000000),
                                emissiveMap:
                                    originalMaterial.emissiveMap || null,
                                emissiveIntensity:
                                    originalMaterial.emissiveIntensity || 1.0,

                                // Apply metallic properties for a metallic appearance
                                color:
                                    originalMaterial.color ||
                                    new THREE.Color(0x333333), // Base color
                                metalness: 0.8,
                                roughness: 0.3,
                                envMapIntensity: 1.0,

                                // Add noise texture for a more natural metal effect
                                roughnessMap: noiseTexture,
                                aoMap: noiseTexture,
                            });

                            // Enable shadows if needed
                            child.castShadow = true;
                            child.receiveShadow = true;
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

        this.composer.render();
        // this.renderer.render(this.scene, this.camera);
        this.stats.end();
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
