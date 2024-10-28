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
            // Return and remove the first card in the array from each playerDeck
            var card = playerDeck.shift()
            // Add these cards to a comparison pool which is an array of cards
            comparisonPool.push(card);
        }

        //console.log('Comparison Pool:', comparisonPool)
        return comparisonPool;
    }

    /**
     * A function which creates a comparison pool and returns a winning card position
     */
    compareCard() {
        console.log(this.comparisonPool)
        var comparisonPool = this.comparisonPool;

        for (var i = 0; i < comparisonPool.length - 1; i++) {
            var card = comparisonPool[i];
            var nextCard = comparisonPool[i + 1];
            var thirdCard = comparisonPool[i + 2];
            console.log('First Card:', card)
            console.log('Second Card:', nextCard)
            console.log('Third Card:', thirdCard);
            if (card.value > nextCard.value || card.value > thirdCard.value) {
                console.log('Winning Card:', card)
                console.log('Winning Value:', card.value)

            }

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