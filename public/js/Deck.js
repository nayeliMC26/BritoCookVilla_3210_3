import * as THREE from "three";
import Card from './card';

class Deck {
    constructor() {

    }

    /**
     * A function to create the initial deck of cards 
     * @returns deck
     */
    createDeck() {
        this.deck = [];
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
        this.deck.forEach(card => {
            console.log(`${card.value} of ${card.suit}`);
        });
        console.log('--------------')
        // Return the created deck
        return this.deck;
    }

    /**
     * 
     * @param {*} deck 
     * @returns shuffledDeck
     */
    // Implemented using Fisher-Yates algorithm

    shuffleDeck(deck) {
        // Create a copy of the initial deck to perform shuffling on 
        var deck = this.deck.slice();
        // Initialize an empty array that our shuffled deck will go into
        this.shuffledDeck = [];
        // Starting from the end of the deck we decrement until there are no more cards left to swap
        for (var currCard = deck.length - 1; currCard > 0; currCard--) {
            // Create a random index 
            var randCard = Math.floor(Math.random() * (currCard + 1));
            // Swap the card at the current index with a card at a random index
            [deck[currCard], deck[randCard]] = [deck[randCard], deck[currCard]]
        }
        // Now all the cards in shuffledDeck are shuffled
        this.shuffledDeck = deck;

        // DEBUG: Log all the cards to ensure they are being shuffled 
        this.shuffledDeck.forEach(card => {
            console.log(`${card.value} of ${card.suit}`);
        });
        console.log('--------------')

        // Return the shuffledDeck
        return this.shuffledDeck;
    }

    /**
     * 
     * @param {*} shuffledDeck 
     * @returns Player 1 Deck, Player 2 Deck, Player 3 Deck
     */
    splitDeck(shuffledDeck) {
        var shuffledDeck = this.shuffledDeck;
        var players = 3;
        // This is the length of each player deck, determined by the number of players 
        var splitDeckLength = Math.floor(shuffledDeck.length / players);
        // Index 0-17
        var p1Deck = shuffledDeck.slice(0, splitDeckLength);
        // Index 17-34
        var p2Deck = shuffledDeck.slice(splitDeckLength, splitDeckLength * 2)
        // Index 34-52
        var p3Deck = shuffledDeck.slice(splitDeckLength * 2, (splitDeckLength * 2) + shuffledDeck.length)

        // DEBUG: Ensure that each player deck is composed of pre-existing cards in pre-existing card order of the shuffledDeck
        console.log('Player 1 Deck:');
        p1Deck.forEach(card => console.log(`${card.value} of ${card.suit}`));
        console.log('--------------')

        console.log('Player 2 Deck:');
        p2Deck.forEach(card => console.log(`${card.value} of ${card.suit}`));
        console.log('--------------')

        console.log('Player 3 Deck:');
        p3Deck.forEach(card => console.log(`${card.value} of ${card.suit}`));
        console.log('--------------')

        return p1Deck, p2Deck, p3Deck
    }


}

export default Deck;