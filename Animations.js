import * as THREE from 'three';
import { color } from 'three/webgpu';

/**
 * Handles all animations
 */
export class Animations {

    constructor(scene) {
        this.scene = scene;
        this.playerOne = {
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-14, 0.0079, 0),
                new THREE.Vector3(-9, 3, 0),
                new THREE.Vector3(-4, 0, 0)
            ]),
            index: -1,
            stack: 0.0079 / 2,
            color: 0xff0000
        };

        this.playerTwo = {
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(14, 0.0079, 0),
                new THREE.Vector3(9, 3, 0),
                new THREE.Vector3(4, 0, 0)
            ]),
            index: -1,
            stack: 0.0079 / 2,
            color: 0x0000ff
        };
        // Path to flip the cards of the first player
        this.flipCardPathOne = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-14, 0.0079, 0),
            new THREE.Vector3(-9, 3, 0),
            new THREE.Vector3(-4, 0, 0)
        ]);

    }

    flipCard(player, object, time, war) {
        var player = this.#getPlayer(player);
        const obPosition = object.position.clone();
        if (player.index === -1) {
            player.flipPath.points[0] = (object.position.clone());
            const geo = new THREE.BufferGeometry().setFromPoints(player.flipPath.getPoints(50));
            const mat = new THREE.LineBasicMaterial({ color: player.color });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        }

        const currIndex = (time / 400 % 4) / 4;
        if (currIndex > player.index) {
            const position = player.flipPath.getPointAt(currIndex);
            object.position.copy(position);
            // object.translateX(-1.25);
            if (currIndex >= 0.25) {
                object.rotation.z = ((-Math.PI * ((currIndex - 0.25) / 0.75)) * -1);
            }
            player.index = currIndex;
            return true
        }

        object.rotation.z = Math.PI;
        player.index = -1;
        if (war) {
            player.stack += 0.0079;
        } else {
            player.stack = 0.0079 / 2;
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

    #getPlayer(player) {
        switch (player) {
            case 'ONE':
                return this.playerOne
            case 'TWO':
                return this.playerTwo
            case 'THREE':
                break;
            default:
                console.log("Unknown Player Number: ", player);
                break;
        }
    }

    #getFlipPath(player) {
        switch (player) {
            case 'ONE':
                return this.flipCardPathOne
            case 'TWO':
                return this.flipCardPathTwo
            case 'THREE':
                break;
            default:
                console.log("Unknown Player Number: ", player);
                break;
        }
    }

    #getIndex(player) {
        switch (player) {
            case 'ONE':
                return this.indexOne
            case 'TWO':
                return this.indexTwo
            case 'THREE':
                break;
            default:
                console.log("Unknown Player Number: ", player);
                break;
        }
    }

    #getStack(player) {
        switch (player) {
            case 'ONE':
                return this.stackOne
            case 'TWO':
                return this.stackTwo
            case 'THREE':
                break;
            default:
                console.log("Unknown Player Number: ", player);
                break;
        }
    }

}