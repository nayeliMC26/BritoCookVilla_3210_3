import * as THREE from "three";
import Card from './Card';

class Deck {
    constructor() {
        this.deck = [];
        this.shuffledDeck = [];
        this.createDeck();
        this.shuffleDeck();
        this.splitDeck();
    }

    /**
     * A function to create the initial deck of cards 
     * @returns {Array} deck
     */
    createDeck() {
        // Nested for-loop which loops through the suits and the values in order to create the cards
        var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
        var values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]
        // For each suit type in the array of suit types
        for (var suit of suits) {
            // For each vallue in the array of values
            for (var value of values) {
                // Create a new card
                var card = new Card(value, suit);
                // Add the new card to the deck
                this.deck.push(card);
            }
        }
        // DEBUG: Log all the cards to ensure the initial deck is being properly made 
        /*this.deck.forEach(card => {
            console.log(`${card.value} of ${card.suit}`);
        });
        console.log('--------------');
        console.log('');*/
        // Return the created deck
        return this.deck;
    }

    /**
     * A function to shuffle the initial deck
     * @param {*} deck 
     * @returns {Array} shuffledDeck
     */
    // Implemented using Fisher-Yates algorithm

    shuffleDeck() {
        // Create a copy of the initial deck to perform shuffling on 
        var deck = this.deck.slice();
        this.shuffledDeck = [];

        // Starting from the end of the deck we decrement until there are no more cards left to swap
        for (var currCard = deck.length - 1; currCard > 0; currCard--) {
            // Create a random index 
            var randCard = Math.floor(Math.random() * (currCard + 1));
            // Swap the card at the current index with a card at a random index
            [deck[currCard], deck[randCard]] = [deck[randCard], deck[currCard]];

            // DEBUG: Assure that we are getting the current card at the current index and swapping with the random index
            /*console.log(`Current Card Index: ${currCard}, ${deck[currCard].value} of ${deck[currCard].suit}`);
            console.log('--------------');
            console.log('');

            console.log(`Random Card Index: ${randCard}, ${deck[currCard].value} of ${deck[currCard].suit}`);
            console.log('--------------');
            console.log('');*/

        }
        // Now all the cards in shuffledDeck are shuffled
        this.shuffledDeck = deck;

        // DEBUG: Log all the cards to ensure they are being shuffled 
        // this.shuffledDeck.forEach(card => {
        //     console.log(`${card.value} of ${card.suit}`);
        // });
        // console.log('--------------');
        // console.log('');

        // Return the shuffledDeck
        return this.shuffledDeck;
    }

    /**
     * A function to split the shuffled decks among the players
     * @param {*} shuffledDeck 
     * @returns {Array} Player Decks
     */
    splitDeck() {
        var players = 3;
        // This is the length of each player deck, determined by the number of players 
        var splitDeckLength = Math.floor(this.shuffledDeck.length / players);
        // Index 0-16
        var p1Deck = this.shuffledDeck.slice(0, splitDeckLength);
        // Index 17-34
        var p2Deck = this.shuffledDeck.slice(splitDeckLength, splitDeckLength * 2);
        // Index 35-51
        var p3Deck = this.shuffledDeck.slice(splitDeckLength * 2);

        var playerDecks = [p1Deck, p2Deck, p3Deck]

        // DEBUG: Ensure that each player deck is composed of pre-existing cards in pre-existing card order of the shuffledDeck
        // console.log('Player 1 Deck:');
        // p1Deck.forEach(card => console.log(`${card.value} of ${card.suit}`));
        // console.log('--------------')

        // console.log('Player 2 Deck:');
        // p2Deck.forEach(card => console.log(`${card.value} of ${card.suit}`));
        // console.log('--------------')

        // console.log('Player 3 Deck:');
        // p3Deck.forEach(card => console.log(`${card.value} of ${card.suit}`));
        // console.log('--------------')

        return playerDecks;
    }


}

export default Deck;