import * as THREE from "three";
import Deck from './Deck';

class Game {
    constructor() {
        this.deck = new Deck();
        this.playerDecks = this.deck.playerDecks;
        this.comparisonPool = [];
        this.war = false;
        this.warCards = [];
        this.tiedCards = [];
        this.warCount = 0;
        //this.logPlayerDecks();
        this.playCard();
        //this.logPlayerDecks();
        this.compareCard(this.comparisonPool);
    }

    /**
     * A function which removes and returns a card from the top of the deck
     * @returns {Array} comparisonPool
     */
    playCard() {
        //console.log('Play Card:')
        var comparisonPool = this.comparisonPool;
        // For all three player decks
        for (var i = 0; i < this.playerDecks.length; i++) {
            // The current player deck is the deck at the current index of the array of playerDecks
            var playerDeck = this.playerDecks[i];
            // If there are cards remaining in the playerDeck
            if (playerDeck.length > 0) {
                // Return and remove the first card in the array from each playerDeck
                var card = playerDeck.shift();
                // Add these cards to a comparison pool which is an array of cards
                comparisonPool.push(card);
            }
        }
        //console.log('Comparison Pool:', comparisonPool)
        return comparisonPool;
    }
    /**
     * A function that plays the cards face-down and does not add them to the comparison pool
     * @returns {Array} warCards
     */
    playFaceDown() {
        var warCards = this.warCards;
        // For all three player decks
        for (var i = 0; i < this.playerDecks.length; i++) {
            // The current player deck is the deck at the current index of the array of playerDecks
            var playerDeck = this.playerDecks[i];
            // If there are cards remaining in the playerDeck
            if (playerDeck.length > 0) {
                // Return and remove the top card
                var card = playerDeck.shift();
                // Add these cards to the pool of warCards which will be given to the winning Player
                warCards.push(card);
            }
        }
        return warCards;
    }

    /**
     * A function that takes the comparisonPool and returns the position of the card with the highest value
     * @returns {number} winningCardDeck
     */
    compareCard() {
        // Initial card and card positiona
        var winningCardDeck = 0;
        var winningCardVal = 0;
        var comparisonPool = this.comparisonPool;
        this.tiedCards = [];
        this.war = false;
        console.log(comparisonPool);
        for (var i = 0; i < comparisonPool.length; i++) {
            // The cardValue is whatever the value of the current card is
            var cardValue = comparisonPool[i].value;
            console.log(`Card: ${this.comparisonPool[i].value}, Suit: ${this.comparisonPool[i].suit}, Deck: ${this.comparisonPool[i].deck}`);
            // If the value of the current card is greater than that of the winningCardVal, then the winningCardVal is the value of the current card
            if (cardValue > winningCardVal) {
                winningCardVal = cardValue;
                // The winning card deck is i + 1, since deckPosition 0 means it is in the initial deck
                winningCardDeck = i + 1;
                this.tiedCards = [i + 1];
                this.war = false;
            } else if (cardValue === winningCardVal) {
                // Add the tied card values into the tiedCards array
                this.tiedCards.push(i + 1);
                // If there is more than one "tiedCard" then war is true
                this.war = true;
            }
        }
        // If war is true and the length of the tied cards arrray is greater than 1 then War
        if (this.war && this.tiedCards.length > 1) {
            console.log('W A R');
            console.log('P L A Y E R S:', this.tiedCards)
            // For every time we have to go to WAR, increment the war counter
            this.warCount++;
            this.warGame();
            return null;
        } else if (!this.war && this.warCount === 0) {
            // If there is no current war and hasn't been any previous, just print the winningDeck of the normal round
            console.log(`Player ${winningCardDeck} wins`);
            // Add winningCardDEck to the winning Player's deck
            this.playerWin(winningCardDeck);
        }
        return winningCardDeck
    }

    /**
     * A helper function to confirm if the players are in WAR or not 
     * @returns {boolean} 
     */
    isWar() {
        return this.war
    }
    /**
     * A function to play the WAR game
     */
    warGame() {
        // There must be tied cards in order to start the war
        if (this.war === true && this.tiedCards.length > 1) {
            console.log('Starting War...');
            // Play a card face-down for each player
            this.playFaceDown();
            // Reset the comparison pool to prevent infinite looping
            this.comparisonPool = [];
            // Play a card face-up for each player 
            this.playCard();
            // Compare the cards from the new comparisonPool
            var winningCardDeck = this.compareCard()
            // Once the winningCardDeck is determined, print the winner
            if (winningCardDeck) {
                console.log(`Player ${winningCardDeck} wins`);
                console.log('Total wars:', this.warCount);
            }
            // Reset the war state
            this.war = false;
        }
        // Reset the war state
        if (!this.isWar()) {
            this.war = false;
        }
    }

    /**
     * A function which will add the cards won in WAR to the winning player's deck
     * @param {number} winningCardDeck 
     */
    playerWin(winningCardDeck) {

    }

    /**
     * A helper function to log all the cards in each deck to ensure that the correct card is being removed from the array
     */
    logPlayerDecks() {
        this.playerDecks.forEach((deck, i) => {
            console.log(`Player ${i + 1} Deck:`);
            deck.forEach(card => {
                console.log(`${card.value} of ${card.suit}, at position ${card.deck}`);
            });
            console.log(`Total cards for Player ${i + 1}: ${deck.length}\n`);
            console.log('');
            console.log('');
            console.log('');

        });
    }


}

export default Game;