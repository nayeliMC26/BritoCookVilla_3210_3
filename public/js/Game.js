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
     * A function that takes the comparisonPool and returns the position of the card with the highest value
     * @returns winningCardPos
     */
    compareCard() {
        // Initial card and card positiona
        var winningCardDeck = 0;
        var winningCardVal = 0;
        var comparisonPool = this.comparisonPool;
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
            }
        }
        console.log('Winning Card Deck:', winningCardDeck);
        return winningCardDeck
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