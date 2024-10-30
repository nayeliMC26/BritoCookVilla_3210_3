import * as THREE from 'three';

/**
 * Handles all animations
 */
export class Animations {

    constructor(scene) {
        this.scene = scene;
        // Path to flip the cards of the first player
        this.flipCardPathOne = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-14, 0.0079, 0),
            new THREE.Vector3(-9, 3, 0),
            new THREE.Vector3(-4, 0, 0)
        ]);
        // Used to simulate the start and end of animation for player ONE
        this.indexOne = -1;
        // Thickness of the first players stacked flip cards for player ONE
        this.stackOne = 0.0079 / 2;

        // Path to flip the cards of the first player for player TWO
        this.flipCardPathTwo = new THREE.CatmullRomCurve3([
            new THREE.Vector3(14, 0.0079, 0),
            new THREE.Vector3(9, 3, 0),
            new THREE.Vector3(4, 0, 0)
        ]);
        // Used to simulate the start and end of animation for player TWO
        this.indexTwo = -1;
        // Thickness of the first players stacked flip cards for player TWO
        this.stackTwo = 0.0079 / 2;

    }

    flipCard(player, object, time, war) {
        switch (player) {
            case 'ONE':
                return this.#flipCardInterface(object, time, war, this.flipCardPathOne, this.indexOne, this.stackOne);
            case 'TWO':
                break;
            case 'THREE':
                break;
            default:
                console.log("Unknown Player Number: ", player);
                break;
        }
    }

    #flipCardOne(object, time, war) {
        if (this.indexOne === -1) {
            this.flipCardPathOne = new THREE.CatmullRomCurve3([
                object.position.clone(),
                new THREE.Vector3(-9, 3, 0),
                new THREE.Vector3(-4, 0, 0)
            ]);
            console.log(this.flipCardPathOne.getPointAt(0));
            const geo = new THREE.BufferGeometry().setFromPoints(this.flipCardPathOne.getPoints(50));
            const mat = new THREE.LineBasicMaterial({ color: 0xff00ff });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        }

        const currIndex = (time / 400 % 4) / 4;
        if (currIndex > this.indexOne) {
            const position = this.flipCardPathOne.getPointAt(currIndex);
            object.position.copy(position);
            // object.translateX(-1.25);
            if (currIndex >= 0.25) {
                object.rotation.z = ((-Math.PI * ((currIndex - 0.25) / 0.75)) * -1);
            }
            this.indexOne = currIndex;
            return true
        }

        object.rotation.z = Math.PI;
        this.indexOne = -1;
        if (war) {
            this.stackOne += 0.0079;
        } else {
            this.stackOne = 0.0079 / 2;
        }
        return false;
    }

    #flipCardInterface(object, time, war, path, index, stack) {
        if (index === -1) {
            path = new THREE.CatmullRomCurve3([
                object.position.clone(),
                new THREE.Vector3(-9, 3, 0),
                new THREE.Vector3(-4, 0, 0)
            ]);
            console.log(path.getPointAt(0));
            const geo = new THREE.BufferGeometry().setFromPoints(path.getPoints(50));
            const mat = new THREE.LineBasicMaterial({ color: 0xff0000 });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        }

        const currIndex = (time / 400 % 4) / 4;
        if (currIndex > index) {
            const position = path.getPointAt(currIndex);
            object.position.copy(position);
            // object.translateX(-1.25);
            if (currIndex >= 0.25) {
                object.rotation.z = ((-Math.PI * ((currIndex - 0.25) / 0.75)) * -1);
            }
            index = currIndex;
            return true
        }

        object.rotation.z = Math.PI;
        index = -1;
        if (war) {
            stack += 0.0079;
        } else {
            stack = 0.0079 / 2;
        }
        return false;
    }

}