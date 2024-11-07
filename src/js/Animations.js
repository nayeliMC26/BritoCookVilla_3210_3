import * as THREE from 'three';

/**
 * Handles all animations
 */
export class Animations {

    constructor(scene) {
        this.scene = scene;
        // Information to annimate player one
        this.playerOne = {
            number: 'ONE',
            object: "",
            path: "",
            time: 0,
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-14, 0, 0),
                new THREE.Vector3(-9, 3, 0),
                new THREE.Vector3(-4, 0.025, 0)
            ]),
            drawPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-14, 0, 0),
                new THREE.Vector3(-11.5, 3, 0),
                new THREE.Vector3(-9, 0.025, 0)
            ]),
            // Used to track when the animation stars to loop
            index: -1,
            // Tracks the depth o fthe stack location (where is going to end up)
            flippedStack: 0.025,
            stack: 0.025,
            // Color of line used for debbuging 
            color: 0xff0000
        };
        // Informataion to animate player two
        this.playerTwo = {
            number: 'TWO',
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(14, 0, 0),
                new THREE.Vector3(9, 3, 0),
                new THREE.Vector3(4, 0.025, 0)
            ]),
            drawPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(14, 0, 0),
                new THREE.Vector3(11.5, 3, 0),
                new THREE.Vector3(9, 0.025, 0)
            ]),
            index: -1,
            flippedStack: 0.025,
            stack: 0.025,
            color: 0x0000ff
        };
        // Information to animate player three
        this.playerThree = {
            number: 'THREE',
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, -14),
                new THREE.Vector3(0, 3, -9),
                new THREE.Vector3(0, 0.025, -4)
            ]),
            drawPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, -14),
                new THREE.Vector3(0, 3, -11.5),
                new THREE.Vector3(0, 0.025, -9)
            ]),
            index: -1,
            flippedStack: 0.025,
            stack: 0.025,
            color: 0x00ff00
        };
    }
    // Will move the card and flip it 
    flipCard(player, object, time) {
        // Which player are we moving the card for
        player = this.#getPlayer(player);

        if (player === undefined) {
            return false;
        }
        // if this is the first call of the funtion
        if (player.index === -1) {
            player.time = time;
            // Set the start of the path to the objects location
            player.flipPath.points[0] = (object.position.clone());
            // Line use for debugging 
            const geo = new THREE.BufferGeometry().setFromPoints(player.flipPath.getPoints(50));
            const mat = new THREE.LineBasicMaterial({ color: player.color });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        }
        // Index used to track where were moving the object to (the percentage of the path)
        const currIndex = ((time - player.time) / 400 % 4) / 4;
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
                object.rotation.z = Math.PI * ((currIndex - 0.25) / 0.75);
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
        object.position.y = player.flippedStack;
        player.flippedStack += 0.05;
        // Make sure the object is flipped correctly
        object.rotation.z = Math.PI;
        // Reseting the player index
        player.index = -1;
        // Retunr false to stop animation
        return false;
    }

    war(player, object1, object2, time) {
        player = this.#getPlayer(player);
        if (player === undefined) {
            return false;
        }

        // if this is the first call of the funtion
        if (player.index === -1) {
            player.time = time;
            player.object = object1;
            player.inWar = true;
            // Set the start of the path to the objects location
            player.drawPath.points[0] = (player.object.position.clone());
            player.path = player.drawPath;
            // Line use for debugging 
            const geo = new THREE.BufferGeometry().setFromPoints(player.flipPath.getPoints(50));
            const mat = new THREE.LineBasicMaterial({ color: player.color });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        } else if (player.index === -2) {
            player.object = object2;
            player.inWar = false;
            // Set the start of the path to the objects location
            player.flipPath.points[0] = (player.object.position.clone());
            player.path = player.flipPath;
            // Line use for debugging 
            const geo = new THREE.BufferGeometry().setFromPoints(player.flipPath.getPoints(50));
            const mat = new THREE.LineBasicMaterial({ color: player.color });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        }
        // Index used to track where were moving the object to (the percentage of the path)
        const currIndex = ((time - player.time) / 400 % 4) / 4;
        // If the animation has not started to loop
        if (currIndex > player.index) {
            // Get the vertex at the current index
            const position = player.path.getPointAt(currIndex);
            // Move the object to the current index position
            player.object.position.copy(position);
            // If were more than 25% into the line
            if ((currIndex >= 0.25) && !player.inWar) {
                // Rotate the object (flipping)
                // Math.PI * the percentage of the rest of the path
                player.object.rotation.z = Math.PI * ((currIndex - 0.25) / 0.75);
            }
            // Updating the player index to the current index
            player.index = currIndex;
            // Return treu to keep the animation going
            return true
        }

        // Else when the aimation start to loop 
        // Move object to the end of the line
        player.object.position.copy(player.path.getPointAt(1));
        // Move object to the correct height of the stack
        player.object.position.y = player.inWar ? player.stack : player.flippedStack;
        if (player.inWar){
            player.stack += 0.05
        } else {
            player.flippedStack += 0.05
        }
        // player.stack = player.inWar ? player.stack += 0.0079 : player.stack;
        // Make sure the object is flipped correctly
        player.object.rotation.z = player.inWar ? 0 : Math.PI;
        // Reseting the player index
        player.index = player.inWar ? -2 : -1;
        // Return true if player is in war 
        return player.inWar ? true : false;
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

    resetPlayer() {
        this.playerOne = {
            number: 'ONE',
            object: "",
            path: "",
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-14, 0, 0),
                new THREE.Vector3(-9, 3, 0),
                new THREE.Vector3(-4, 0.025, 0)
            ]),
            drawPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-14, 0, 0),
                new THREE.Vector3(-11.5, 3, 0),
                new THREE.Vector3(-9, 0.025, 0)
            ]),
            // Used to track when the animation stars to loop
            index: -1,
            // Tracks the depth o fthe stack location (where is going to end up)
            flippedStack: 0.025,
            // Color of line used for debbuging 
            color: 0xff0000
        };
        // Informataion to animate player two
        this.playerTwo = {
            number: 'TWO',
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(14, 0, 0),
                new THREE.Vector3(9, 3, 0),
                new THREE.Vector3(4, 0.025, 0)
            ]),
            drawPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(14, 0, 0),
                new THREE.Vector3(11.5, 3, 0),
                new THREE.Vector3(9, 0.025, 0)
            ]),
            index: -1,
            flippedStack: 0.025,
            color: 0x0000ff
        };
        // Information to animate player three
        this.playerThree = {
            number: 'THREE',
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, -14),
                new THREE.Vector3(0, 3, -9),
                new THREE.Vector3(0, 0.025, -4)
            ]),
            drawPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, -14),
                new THREE.Vector3(0, 3, -11.5),
                new THREE.Vector3(0, 0.025, -9)
            ]),
            index: -1,
            flippedStack: 0.025,
            color: 0x00ff00
        };
    }
}