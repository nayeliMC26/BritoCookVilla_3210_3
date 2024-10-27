import * as THREE from 'three';

/**
 * Handles all animations
 */
export class Animations {
    constructor() {
        this.flipCardPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.4, 0),
            new THREE.Vector3(0, 5, -5),
            new THREE.Vector3(0, 0, -10)
        ]);
        this.indexOne = -1

    }

    flipCard(object, time) {
        const currIndex = (time / 400 % 4) / 4;
        if (currIndex > this.indexOne) {
            const position = this.flipCardPath.getPointAt(currIndex);
            object.position.copy(position);
            // object.translateX(-1.25);
            if (currIndex >= 0.25) {
                object.rotation.z = ((-Math.PI * ((currIndex - 0.25) / 0.75)) * -1);

                // this.cube.rotateZ((Math.PI * ((t - 0.25) / 0.75)) - this.cube.rotation.z);
            }
            this.indexOne = currIndex;
            return true
        }
        object.rotation.z = Math.PI;
        this.indexOne = -1;
        return false;
    }


}