import * as THREE from "three";
import Card from './card';

class Deck {
    constructor(players) {
        this.players = players;
    }

    // A function to create the initial deck of cards 
    createDeck() {
        this.deck = [];
        // Nested for-loop which loops through the suits and the values in order to create the cards
        var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
        var values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]

        for (var suit of suits) {
            for (var value of values) {
                var card = new Card(value, suit);
                this.deck.push(card);
                //console.log(`Created card: ${value} of ${suit}`);
            }
        }
        //console.log(`Deck length: ${this.deck.length}`);

        return this.deck;
    }

    // A function to shuffle the cards from the original deck
    shuffleDeck(deck) {

    }




    splitDeck() { }




}

export default Deck;