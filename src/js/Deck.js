import Card from './Card';

class Deck {
    constructor(scene, playerId = null) {
        this.scene = scene;
        this.cards = [];
        this.playerId = playerId;
        // DEBUG: Make sure all decks are initialized 
        // console.log(`Deck initialized for Player ${playerId ?? 'Initial Deck'}`);

    }

    /**
     * A function to create the initial deck of cards 
     */
    createDeck() {
        var A = 14;
        var J = 11;
        var Q = 12;
        var K = 13;
        // Nested for-loop which loops through the suits and the values in order to create the cards
        this.suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
        this.values = [A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K]
        // For each suit type in the array of suit types
        for (var suit of this.suits) {
            // For each vallue in the array of values
            for (var value of this.values) {
                // Create a new card
                this.cards.push(new Card(value, suit));
            }
        }
        // DEBUG: Ensure that we are initially creating a deck of 52 cards
        // console.log(`Deck created with ${this.cards.length} cards.`);

    }
    /**
     * A function to shuffle the initial deck
     * @param {*} deck 
     * @returns {Array} shuffledDeck
     */
    // Implemented using Fisher-Yates algorithm

    shuffleDeck() {
        // DEBUG: Make sure that the initial deck is properly being created 
        // console.log('Deck before shuffle:', this.cards.map(card => `${card.value} of ${card.suit}`).join(', '));
        // Starting from the end of the deck we decrement until there are no more cards left to swap
        for (var currCard = this.cards.length - 1; currCard > 0; currCard--) {
            // Create a random index 
            var randCard = Math.floor(Math.random() * (currCard + 1));
            // Swap the card at the current index with a card at a random index
            [this.cards[currCard], this.cards[randCard]] = [this.cards[randCard], this.cards[currCard]];

        }
        // DEBUG: Make sure that the initial deck has been shuffled
        // console.log('Deck after shuffle:', this.cards.map(card => `${card.value} of ${card.suit}`).join(', '));

    }

    /**
     * A function to deal cards to the playerDecks
     * @param {*} numCards 
     * @returns {Array}
     */
    dealCards(numCards) {
        // DEBUG: Make sure that the cards are being dealt to the players properly
        // console.log(`Dealing ${numCards} cards. Remaining cards in deck: ${this.cards.length}`);
        return this.cards.splice(0, numCards);
    }

    /**
     * A function to add cards to a players deck whether it be for dealing or in-game actions
     * @param {*} newCards 
     */
    addCards(newCards) {
        this.cards.push(...newCards);
        // DEBUG: Check how many cards are being added to a players deck
        // console.log(`Added ${newCards.length} cards to Player ${this.playerId ?? 'Main Deck'}. Total cards now: ${this.cards.length}`);
    }

    /**
     * A function to play a card from the player's deck
     * @returns {Object} card
     */
    playCard() {
        // If there are cards remaining in a player's deck
        if (this.cards.length > 0) {
            // Play the card by drawing it from the top of the deck
            return this.cards.shift();
        }
        // If there are not any cards remaining in the player's, do not draw 
        return null;
    }

    addToScene() {
        this.cards.forEach(card => {
            this.scene.add(card);
        });
        // DEBUG: Make sure all cards are being added to the scene
        // console.log(`Added ${this.cards.length} cards to the scene.`);
    }
}

export default Deck;