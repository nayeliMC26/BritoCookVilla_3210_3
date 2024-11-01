import * as THREE from 'three';

/**
 * Handles all animations
 */
export class Animations {

    constructor(scene) {
        this.scene = scene;
        // Information to annimate player one
        this.playerOne = {
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-14, 0, 0),
                new THREE.Vector3(-9, 3, 0),
                new THREE.Vector3(-4, 0, 0)
            ]),
            // Used to track when the animation stars to loop
            index: -1,
            // Tracks the depth o fthe stack location (where is going to end up)
            stack: 0.01,
            // Color of line used for debbuging 
            color: 0xff0000
        };
        // Informataion to animate player two
        this.playerTwo = {
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(14, 0, 0),
                new THREE.Vector3(9, 3, 0),
                new THREE.Vector3(4, 0, 0)
            ]),
            index: -1,
            stack: 0.01,
            color: 0x0000ff
        };
        // Information to animate player three
        this.playerThree = {
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, -14),
                new THREE.Vector3(0, 3, -9),
                new THREE.Vector3(0, 0, -4)
            ]),
            index: -1,
            stack: 0.01,
            color: 0x00ff00
        };
    }

    // Will move the card and flip it 
    flipCard(player, object, time, war) {
        // Which player are we moving the card for
        var player = this.#getPlayer(player);
        if (player === undefined){
            return false;
        }
        // if this is the first call of the funtion
        if (player.index === -1) {
            // Set the start of the path to the objects location
            player.flipPath.points[0] = (object.position.clone());
            // Line use for debugging 
            const geo = new THREE.BufferGeometry().setFromPoints(player.flipPath.getPoints(50));
            const mat = new THREE.LineBasicMaterial({ color: player.color });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        }
        // Index used to track where were moving the object to (the percentage of the path)
        const currIndex = (time / 400 % 4) / 4;
        // If the animation has not started to loop
        if (currIndex > player.index) {
            // Get the vertex at the current index
            const position = player.flipPath.getPointAt(currIndex);
            // Move the object to the current index position
            object.position.copy(position);
            // If were more than 25% into the line
            if (currIndex >= 0.25) {
                // Rotate the object (flipping)
                // Math.PI * the percentage of the rest of the path
                object.rotation.z = -Math.PI * ((currIndex - 0.25) / 0.75);
            }
            // Updating the player index to the current index
            player.index = currIndex;
            // Return treu to keep the animation going
            return true
        }
        // Else when the aimation start to loop 
        // Move object to the end of the line
        object.position.copy(player.flipPath.getPointAt(1));
        // Move object to the correct height of the stack
        object.position.y = player.stack;
        // Make sure the object is flipped correctly
        object.rotation.z = Math.PI;
        // Reseting the player index
        player.index = -1;
        // If theres a war increase the stack height else reset it
        player.stack = war ? player.stack += 0.01 : 0.01;
        // Retunr false to stop animation
        return false;
    }

    // Used to get the player that were doing the animation to
    #getPlayer(player) {
        switch (player) {
            case 'ONE':
                return this.playerOne;
            case 'TWO':
                return this.playerTwo;
            case 'THREE':
                return this.playerThree;
            default:
                console.log("ERROR! Unknown Player Number: ", player);
                break;
        }
    }
}

export default Animations;
