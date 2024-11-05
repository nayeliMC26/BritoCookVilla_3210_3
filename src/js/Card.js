import * as THREE from "three";

class Card extends THREE.Mesh {
    constructor(value, suit) {
        // Build geometry (2.5 by 3.5 inches)
        const geometry = new THREE.BoxGeometry(2.5, 0.01, 3.5);

        // Load textures based on value and suit
        const backTexture = new THREE.TextureLoader().load(
            "./assets/textures/cards/back.png"
        );
        backTexture.colorSpace = THREE.SRGBColorSpace;

        const frontTexture = new THREE.TextureLoader().load(
            `./assets/textures/cards/${suit}/${value}.PNG`
        )
        frontTexture.colorSpace = THREE.SRGBColorSpace;

        // Create materials for each side of the box: [Right, Left, Top, Bottom, Front, Back]
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // Right side
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // Left side
            new THREE.MeshBasicMaterial({ map: backTexture }), // Top side
            new THREE.MeshBasicMaterial({ map: frontTexture }), // Bottom side
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // Front face
            new THREE.MeshBasicMaterial({ color: 0xffffff }), // Back face
        ];

        // Pass geometry and materials to the super constructor
        super(geometry, materials);
        super.translateY(0.005);

        // Assign value and suit to card object for reference (if needed)
        this.value = value;
        this.suit = suit;
        this.flipped = false;
    }
}

export default Card;
