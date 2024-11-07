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
            time: 0,
            index: -1,
            rotation: Math.PI / 2,
            spawnP1: 0.005,
            spawnP2: 0.005,
            spawnP3: 0.005,
            count: 0
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
            time: 0,
            index: -1,
            rotation: Math.PI / 2,
            spawnP1: 0.005,
            spawnP2: 0.005,
            spawnP3: 0.005,
            count: 1
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
            time: 0,
            index: -1,
            rotation: Math.PI,
            spawnP1: 0.005,
            spawnP2: 0.005,
            spawnP3: 0.005,
            count: 2,
        };
        this.deckCount = 0;
        this.currRotation = 0;
    }

    flipCard(player, card, warCards, time) {
        // Getting player
        player = this.#getPlayer(player);
        if ((player === undefined) || card === undefined) {
            return false;
        }
        // if this is the first call of the funtion
        if (player.index === -1) {
            // start time of animation
            player.time = time;
            // Set the start of the path to the objects location
            player.flipPath.points[0] = (card.position.clone());
        }
        // Index used to track where were moving the object to (the percentage of the path)
        const currIndex = ((time - player.time) / 200 % 4) / 4;
        // If the animation has not started to loop and card is not flipped
        if ((currIndex > player.index) && !card.flipped) {
            // Get the vertex at the current index
            const position = player.flipPath.getPointAt(currIndex);
            // Move the object to the current index position
            card.position.copy(position);
            // Rotate the object (flipping) ff were more than 25% into the line
            if (currIndex >= 0.25) {
                card.rotation.z = Math.PI * ((currIndex - 0.25) / 0.75);
            }
            player.index = currIndex;
            // Return true to keep the animation going
            return true
        } else if (!card.flipped) {
            card.flipped = true;
            // Making sure card is placed properly at the end
            card.position.copy(player.flipPath.getPointAt(1));
            card.rotation.z = Math.PI;
            card.position.y = player.spawnP3;
            player.spawnP3 += 0.01;
            // Setting player index to be ready in case of war
            player.index = -2;
        }
        // Call war animation to be make sure we dont skip it
        return this.#war(player.number, warCards, time);
    }

    #war(player, cards, time) {
        // Getting player 
        player = this.#getPlayer(player);
        if (player === undefined) {
            return false;
        }
        // Making sure we're in a war
        if ((cards.length === 0) || (cards.length < 2) || (player.count >= cards.length)) {
            player.index = -1;
            return false;
        }
        // Card we're currently working with
        const currCard = cards[player.count];

        // if this is the first call of the funtion (draw card)
        if (player.index === -2) {
            // Start time of animation
            player.time = time;
            // Setting player to in war
            player.inWar = true;
            // Set the start of the path to the objects location
            player.drawPath.points[0] = currCard.position.clone();
            // Used to track path we're working with
            player.path = player.drawPath;
        } else if (player.index === -3) {
            // Start time of animation
            player.time = time;
            // Setting card to flipped
            currCard.flipped = true;
            // Setting player to not in war
            player.inWar = false;
            // Set the start of the path to the objects location
            player.flipPath.points[0] = currCard.position.clone();
            // Used to track path we're working with
            player.path = player.flipPath;
        }
        // Index used to track where were moving the object to (the percentage of the path)
        const currIndex = ((time - player.time) / 200 % 4) / 4;
        // If the animation has not started to loop and count can be found in the cards
        if ((currIndex > player.index) && (player.count < cards.length)) {
            const position = player.path.getPointAt(currIndex);
            // Move the object to the current index position
            currCard.position.copy(position);
            // Rotate the object (flipping) ff were more than 25% into the line
            if ((currIndex >= 0.25) && !player.inWar) {
                currCard.rotation.z = Math.PI * ((currIndex - 0.25) / 0.75);
            }
            player.index = currIndex;
            // Return true to keep the animation going
            return true
            // If animation is looping but we still have cards to go through
        } else if (player.count <= cards.length - 4) {
            // Making sure cards are placed properly
            currCard.position.copy(player.path.getPointAt(1));
            currCard.rotation.z = player.inWar ? 0 : Math.PI;
            // Wether to draw or flip a card
            player.index = player.inWar ? -3 : -2;
            // Going to the next card for the player
            player.count += 3
            // Return true to keep the animation going
            return true;
        }
        // Making sure last card is placed properly
        currCard.position.copy(player.path.getPointAt(1));
        currCard.position.y = player.spawnP3;
        currCard.rotation.z = Math.PI;
        player.spawnP3 += 0.01;
        // Reseting index
        player.index = -1;
        // Stopping animation
        return false
    }

    liftDeck(player, cards, height, time) {
        player = this.#getPlayer(player);
        if ((player === undefined) || cards === undefined) {
            return false;
        }

        if (player.index === -1) {
            player.time = time;
        }
        // Index used to track where were moving the object to (perctange of distance to desired height)
        const currIndex = ((time - player.time) / 150 % 3) / 3;
        // If the animation has not started to loop
        if (currIndex > player.index) {
            if (player.index === -1) player.index = 0;
            // Slowly moving the cards up
            cards.forEach((object) => {
                object.translateY((0.01 * height * currIndex) - (0.01 * height * player.index));
            });
            // Updating the player index to the current index
            player.index = currIndex;
            // Return true to keep the animation going
            return true;
        }
        // Making sure cards are at the correct height
        cards.forEach((object) => {
            object.translateY((0.01 * height) - (0.01 * height * player.index));
        });
        // Reseting player index
        player.index = -1;
        // Stopping animation
        return false;
    }

    drawBack(player, cards, time) {
        // Getting player 
        player = this.#getPlayer(player);
        if ((player === undefined) || cards === undefined) {
            return false;
        }
        // Card we're currently working with
        const currCard = cards[this.deckCount];

        // Start of card animation
        if (player.index === -1) {
            // Setting start time of animation
            player.time = time;
            // Getting a new rotation start and path to follow
            this.currRotation = currCard.rotation.y;
            player.drawBackPath.points[0] = currCard.position.clone();
            player.drawBackPath.points[1] = currCard.position.clone();
            // Whether the path should adjust for flipping or not
            player.drawBackPath.points[1].y = currCard.flipped ? 3 : 0;
            // Updating the end height of the path
            player.drawBackPath.points[3].y = player.spawnP1;
        }

        // Index used to track where were moving the object to (the percentage of the path)
        const currIndex = ((time - player.time) / 250 % 5) / 5;
        // If the animation has not started to loop and deckCount can be found in the cards
        if ((currIndex > player.index) && (this.deckCount < cards.length)) {
            // Get the vertex at the current index
            const position = player.drawBackPath.getPointAt(currIndex);
            // Move the object to the current index position
            currCard.position.copy(position);

            // Flip card if neccessary between 25% to 50% of the path
            if ((currIndex >= 0.25) && (currIndex <= 0.50) && (currCard.flipped)) {
                currCard.rotation.z = Math.PI - (Math.PI * ((currIndex - 0.25) / 0.25));
            } else if ((currIndex >= 0.50) && (currCard.flipped)) {
                currCard.rotation.z = 0;
            }

            // Rotate card if neccessary between 50% to 75% of the path
            if ((currIndex >= 0.50) && (currIndex <= 0.75) && ((this.currRotation % Math.PI) != player.rotation)) {
                currCard.rotation.y = this.currRotation + ((player.rotation - this.currRotation) * ((currIndex - 0.50) / 0.25));
            }
            // Current index becomes players new index
            player.index = currIndex;
            // Return true to keep the animation going
            return true
            // If animation is looping but we still have carsd to go through
        } else if (this.deckCount < cards.length - 1) {
            currCard.flipped = false;
            // Making sure cards are placed properly
            currCard.position.copy(player.drawBackPath.getPointAt(1));
            currCard.rotation.z = 0;
            currCard.position.y = player.spawnP1;
            currCard.rotation.y = player.rotation;
            // Resetting index to get the rest of the cards
            player.index = -1;
            // Increasing the height where cards should come back to
            player.spawnP1 += 0.01;
            // Going to the next card
            this.deckCount++
            // Return true to keep the animation going
            return true;
        }
        currCard.flipped = false;
        // Making sure last card is places properly
        currCard.position.copy(player.drawBackPath.getPointAt(1));
        currCard.rotation.z = 0;
        currCard.position.y = player.spawnP1;
        currCard.rotation.y = player.rotation;
        // Resetting all player settings
        player.index = -1;
        this.deckCount = 0;
        player.spawnP1 = 0.005;
        player.spawnP2 = 0.005;
        player.spawnP3 = 0.005;

        // Stopping animation
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