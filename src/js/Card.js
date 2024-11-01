import * as THREE from "three";

class Card extends THREE.Mesh {
    constructor(value, suit, deck) {
        // Build geometry (2.5 by 3.5 inches)
        const geometry = new THREE.BoxGeometry(2.5, 3.5, 0.01);

        // Load textures based on value and suit
        const backTexture = new THREE.TextureLoader().load(
            "./assets/textures/cards/back.png"
        );
        const frontTexture = new THREE.TextureLoader().load(
            `./assets/textures/cards/${suit}/${value}.jpg`
        )

        // Create materials for each side of the box: [Right, Left, Top, Bottom, Front, Back]
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // Right side
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // Left side
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // Top side
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // Bottom side
            new THREE.MeshBasicMaterial({ map: frontTexture }), // Front face
            new THREE.MeshBasicMaterial({ map: backTexture }), // Back face
        ];

        // Pass geometry and materials to the super constructor
        super(geometry, materials);

        // Assign value and suit to card object for reference (if needed)
        this.value = value;
        this.suit = suit;
        this.deck = deck;
    }
}

export default Card;
