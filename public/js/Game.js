import * as THREE from "three";
import Deck from './Deck';

class Game {
    constructor() {
        this.deck = new Deck();
        this.playerDecks = this.deck.playerDecks;
        this.comparisonPool = [];
        //this.logPlayerDecks();
        this.playCard();
        //this.logPlayerDecks();
        this.compareCard(this.comparisonPool);
    }

    /**
     * 
     * @returns {Array} comparisonPool
     */
    playCard() {
        console.log('Play Card:')
        var comparisonPool = this.comparisonPool;
        // For all three player decks
        for (var i = 0; i < this.playerDecks.length; i++) {
            // The current player deck is the deck at the current index of the array of playerDecks
            var playerDeck = this.playerDecks[i];
            // Return and remove the first card in the array from each playerDeck
            var card = playerDeck.shift()
            // Add these cards to a comparison pool which is an array of cards
            comparisonPool.push(card);
        }

        console.log('Comparison Pool:', comparisonPool)
        return comparisonPool;
    }

    /**
     * A function which creates a comparison pool and returns a winning card position
     */
    compareCard(comparisonPool) {
        for (var i = 0; i < this.comparisonPool.length; i++) {
            var card = this.comparisonPool[i];
            console.log(card);
        }
    }

    /**
     * A helper function to log all the cards in each deck to ensure that the correct card is being removed from the array
     */
    logPlayerDecks() {
        this.playerDecks.forEach((deck, i) => {
            console.log(`Player ${i + 1} Deck:`);
            deck.forEach(card => {
                console.log(`${card.value} of ${card.suit}`);
            });
            console.log(`Total cards for Player ${i + 1}: ${deck.length}\n`);
            console.log('');
            console.log('');
            console.log('');

        });
    }


}

export default Game;