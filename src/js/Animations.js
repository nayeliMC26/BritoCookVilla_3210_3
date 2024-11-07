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
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-14, 0, 0),
                new THREE.Vector3(-9, 3, 0),
                new THREE.Vector3(-4, 0.005, 0)
            ]),
            drawPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(-14, 0, 0),
                new THREE.Vector3(-11.5, 3, 0),
                new THREE.Vector3(-9, 0.005, 0)
            ]),
            drawBackPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(-9, 1, 0),
                new THREE.Vector3(-14, 0.005, 0),
            ]),
            path: "",
            pr: Math.PI / 2,
            s1: 0.005,
            s2: 0.005,
            s3: 0.005,
            count: 0,
            time: 0,
            // Used to track when the animation stars to loop
            index: -1
        };
        // Informataion to animate player two
        this.playerTwo = {
            number: 'TWO',
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(14, 0, 0),
                new THREE.Vector3(9, 3, 0),
                new THREE.Vector3(4, 0.005, 0)
            ]),
            drawPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(14, 0, 0),
                new THREE.Vector3(11.5, 3, 0),
                new THREE.Vector3(9, 0.005, 0)
            ]),
            drawBackPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(9, 1, 0),
                new THREE.Vector3(14, 0.005, 0),
            ]),
            path: "",
            pr: Math.PI / 2,
            s1: 0.005,
            s2: 0.005,
            s3: 0.005,
            count: 1,
            time: 0,
            index: -1
        };
        // Information to animate player three
        this.playerThree = {
            number: 'THREE',
            flipPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, -14),
                new THREE.Vector3(0, 3, -9),
                new THREE.Vector3(0, 0.005, -4)
            ]),
            drawPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, -14),
                new THREE.Vector3(0, 3, -11.5),
                new THREE.Vector3(0, 0.005, -9)
            ]),
            drawBackPath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 1, -9),
                new THREE.Vector3(0, 0.005, -14),
            ]),
            path: "",
            pr: Math.PI,
            s1: 0.005,
            s2: 0.005,
            s3: 0.005,
            count: 2,
            time: 0,
            index: -1
        };
        this.deckCount = 0;
        this.currRotation = 0;
    }
    // Will move the card and flip it 
    flipCard(player, object, war, time) {
        // Which player are we moving the card for
        player = this.#getPlayer(player);
        // console.log(object);
        if ((player === undefined) || object === undefined) {
            return false;
        }
        // if this is the first call of the funtion
        if (player.index === -1) {
            console.log("flip index")
            player.time = time;
            // Set the start of the path to the objects location
            player.flipPath.points[0] = (object.position.clone());
            // Line use for debugging 
            const geo = new THREE.BufferGeometry().setFromPoints(player.flipPath.getPoints(50));
            const mat = new THREE.LineBasicMaterial({ color: 0xffffff * Math.random() });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        }
        // Index used to track where were moving the object to (the percentage of the path)
        // const currIndex = ((time - player.time) / 300 % 4) / 4;
        const currIndex = ((time - player.time) % 4) / 4;
        // If the animation has not started to loop
        if ((currIndex > player.index) && !object.flipped) {
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
        if (!object.flipped) {
            object.flipped = true;
            // Else when the aimation start to loop 
            // Move object to the end of the line
            object.position.copy(player.flipPath.getPointAt(1));
            // Move object to the correct height of the stack
            object.position.y = player.s3;
            player.s3 += 0.01;
            // Make sure the object is flipped correctly
            object.rotation.z = Math.PI;
            // Reseting the player index
            player.index = -2;

        }
        // Retunr false to stop animation
        return this.war(player.number, war, time);
    }

    war(player, cards, time) {
        player = this.#getPlayer(player);
        if (player === undefined) {
            return false;
        }

        if ((cards.length === 0) || (cards.length < 2) || (player.count >= cards.length)) {
            player.index = -1;
            return false;
        }

        const currCard = cards[player.count];
        // console.log(cards);

        // if this is the first call of the funtion
        if (player.index === -2) {
            console.log(`${player.number}: count -> ${player.count}`)
            player.time = time;
            player.inWar = true;
            // Set the start of the path to the objects location
            player.drawPath.points[0] = currCard.position.clone();
            player.path = player.drawPath;
            // Line use for debugging 
            const geo = new THREE.BufferGeometry().setFromPoints(player.drawPath.getPoints(50));
            const mat = new THREE.LineBasicMaterial({ color: 0xffffff * Math.random() });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        } else if (player.index === -3) {
            player.time = time;
            currCard.flipped = true;
            // player.object = object2;
            player.inWar = false;
            // Set the start of the path to the objects location
            player.flipPath.points[0] = currCard.position.clone();
            player.path = player.flipPath;
            // Line use for debugging 
            const geo = new THREE.BufferGeometry().setFromPoints(player.flipPath.getPoints(50));
            const mat = new THREE.LineBasicMaterial({ color: 0xffffff * Math.random() });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        }
        // Index used to track where were moving the object to (the percentage of the path)
        // const currIndex = ((time - player.time) / 300 % 4) / 4;
        const currIndex = ((time - player.time) % 4) / 4;
        // If the animation has not started to loop
        if ((currIndex > player.index) && (player.count < cards.length)) {
            const position = player.path.getPointAt(currIndex);
            // Move the object to the current index position
            currCard.position.copy(position);
            // If were more than 25% into the line
            if ((currIndex >= 0.25) && !player.inWar) {
                // Rotate the object (flipping)
                // Math.PI * the percentage of the rest of the path
                currCard.rotation.z = Math.PI * ((currIndex - 0.25) / 0.75);
            }
            // Updating the player index to the current index
            player.index = currIndex;
            // Return treu to keep the animation going
            return true
        } else if (player.count <= cards.length - 4) {
            currCard.position.copy(player.path.getPointAt(1));
            // currCard.position.y = player.inWar ? player.s2 : player.s3;
            // currCard.rotation.z = Math.PI;
            currCard.rotation.z = player.inWar ? 0 : Math.PI;

            // currCard.rotation.y = player.pr;
            player.index = player.inWar ? -3 : -2;
            player.time = time;
            // player.s1 += 0.01;
            player.count += 3
            // console.log("count increase");
            return true;
        }

        // Else when the aimation start to loop 
        // Move object to the end of the lineF
        currCard.position.copy(player.path.getPointAt(1));
        // Move object to the correct height of the stack
        currCard.position.y = player.s3;
        // player.s2 = player.inWar ? player.s2 += 0.01 : player.s2;
        player.s3 = player.s3 += 0.01;;

        currCard.rotation.z = Math.PI;
        // player.stack = player.inWar ? player.stack += 0.0079 : player.stack;
        // Make sure the object is flipped correctly
        // Reseting the player index
        player.index = -1;
        // Return true if player is in war 
        return false
    }

    liftDeck(player, objects, height, time) {
        player = this.#getPlayer(player);
        if ((player === undefined) || objects === undefined) {
            return false;
        }

        if (player.index === -1) {
            player.time = time;
        }

        // const currIndex = ((time - player.time) / 225 % 3) / 3;
        const currIndex = ((time - player.time) % 3) / 3;
        // If the animation has not started to loop
        if (currIndex > player.index) {
            if (player.index === -1) player.index = 0;
            // Get the vertex at the current index
            objects.forEach((object) => {
                // object.position.y = 0;
                // object.trabs = + position.y

                object.translateY((0.01 * height * currIndex) - (0.01 * height * player.index));
            });
            // console.log((0.01 * height * currIndex) - (0.01 * height * player.index));
            // Move the object to the current index position
            // Updating the player index to the current index
            player.index = currIndex;
            // Return treu to keep the animation going
            return true;
        }
        objects.forEach((object) => {
            // object.position.y = 0;
            // object.trabs = + position.y
            object.translateY((0.01 * height) - (0.01 * height * player.index));
            // object.translateY(-(0.01 * height * player.index));
            // object.translateY((0.01 * height));

        });
        player.index = -1;
        return false;

    }

    drawBack(player, objects, time) {
        player = this.#getPlayer(player);
        if ((player === undefined) || objects === undefined) {
            return false;
        }
        const currCard = objects[this.deckCount];


        if (player.index === -1) {
            console.log("drawBack");
            player.time = time;
            // this.winningDeck = new THREE.Group().add(...objects);
            // this.scene.add(this.winningDeck);
            player.drawBackPath.points[0] = currCard.position.clone();
            player.drawBackPath.points[1] = currCard.position.clone();
            player.drawBackPath.points[1].y = currCard.flipped ? 3 : 0;
            this.currRotation = currCard.rotation.y;
            // console.log(objects);
            // console.log()
            // Set the start of the path to the objects location
            // player.liftPath.points[0] = (this.winningDeck.position.clone());
            // // Line use for debugging 
            const geo = new THREE.BufferGeometry().setFromPoints(player.drawBackPath.getPoints(50));
            const mat = new THREE.LineBasicMaterial({ color: 0xffffff * Math.random() });
            const line = new THREE.Line(geo, mat);
            this.scene.add(line);
        }

        // const currIndex = ((time - player.time) / 375 % 5) / 5;
        const currIndex = ((time - player.time) % 5) / 5;

        // console.log((this.deckCount < objects.length), " ", this.deckCount)
        // console.log(objects.length, " ", this.deckCount)
        if ((currIndex > player.index) && (this.deckCount < objects.length)) {
            // Get the vertex at the current index
            const position = player.drawBackPath.getPointAt(currIndex);
            // Move the object to the current index position
            currCard.position.copy(position);

            if ((currIndex >= 0.25) && (currIndex <= 0.50) && (currCard.flipped)) {
                // Rotate the object (flipping)
                // console.log(this.winningDeck.children[player.count]);
                currCard.rotation.z = Math.PI - (Math.PI * ((currIndex - 0.25) / 0.25));
                // currCard.rotateZ((Math.PI * ((currIndex - 0.25) / 0.25)) - (Math.PI * ((player.index - 0.25) / 0.25)));
            } else if ((currIndex >= 0.50) && (currCard.flipped)) {
                currCard.rotation.z = 0;
            }

            if ((currIndex >= 0.50) && (currIndex <= 0.75) && ((this.currRotation % Math.PI) != player.pr)) {
                // Rotate the object (flipping)
                // console.log(this.winningDeck.children[player.count]);
                currCard.rotation.y = this.currRotation + ((player.pr - this.currRotation) * ((currIndex - 0.50) / 0.25));

            }
            // Updating the player index to the current index
            player.index = currIndex;
            // Return treu to keep the animation going
            return true
        } else if (this.deckCount < objects.length - 1) {
            // console.log(player.count);
            // console.log(this.winningDeck.children.length);
            currCard.flipped = false;
            currCard.position.copy(player.drawBackPath.getPointAt(1));
            currCard.rotation.z = 0;
            currCard.position.y = player.s1;
            currCard.rotation.y = player.pr;
            player.index = -2;
            player.time = time;
            player.s1 += 0.01;
            this.deckCount++
            this.currRotation = objects[this.deckCount].rotation.y;
            player.drawBackPath.points[0] = objects[this.deckCount].position.clone();
            player.drawBackPath.points[1] = objects[this.deckCount].position.clone();
            player.drawBackPath.points[1].y = objects[this.deckCount].flipped ? 3 : 0;
            player.drawBackPath.points[3].y = player.s1;
            // console.log("count increase");
            return true;
        }
        currCard.flipped = false;
        currCard.position.y = player.s1;
        currCard.rotation.y = player.pr;
        objects[this.deckCount].position.copy(player.drawBackPath.getPointAt(1));
        player.index = -1;
        this.deckCount = 0;
        player.s1 = 0.005;

        return false;

    }

    // Used to get the player that were doing the animation to
    #getPlayer(player) {
        switch (player) {
            case 'ONE':
            case 1:
                return this.playerOne;
            case 'TWO':
            case 2:
                return this.playerTwo;
            case 'THREE':
            case 3:
                return this.playerThree;
            default:
                console.log("ERROR! Unknown Player Number: ", player);
                break;
        }
    }
}