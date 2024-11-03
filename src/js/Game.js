import { Deck } from './Deck';

class Game {
    constructor() {
        this.deck = new Deck();
        this.playerDecks = this.deck.playerDecks;
        this.comparisonPool = [];
        this.war = false;
        this.warCards = [];
        this.tiedCards = [];
        this.winningPool = [];
        this.warCount = 0;
        this.roundCount = 1;
        this.roundLimit = 5000;

    }
    // a function that plays the rounds until there is one player deck left 
    /*playGame() {
        while (this.playerDecks.length > 1) {
            this.roundCount++;
            console.log(this.roundCount)
            this.playCard();
            var winner = this.compareCard();
            console.log(`Player count after round ${this.roundCount + 1}: ${this.playerDecks.length}`);
            console.log('')
            if (winner !== null) {
                this.playerWin(winner);
            }
            this.removePlayer();
            this.comparisonPool = [];
            if (this.playerDecks.length === 1) {
                this.endGame();
                break;
            }
            /*if (this.roundCount >= 20) {
                this.endGame();
                console.log('Round limit reached. Game Over.');
                break;
            }
        }
    }*/

    /**
     * A function which removes and returns a card from the top of the deck
     * @returns {Array} comparisonPool
     */
    playCard() {
        console.log("Round", this.roundCount)
        //console.log('Play Card:')
        this.comparisonPool = [];
        // For all three player decks
        for (var i = 0; i < this.playerDecks.length; i++) {
            // The current player deck is the deck at the current index of the array of playerDecks
            var playerDeck = this.playerDecks[i];
            // If there are cards remaining in the playerDeck
            if (playerDeck.length > 0) {
                // Return and remove the first card in the array from each playerDeck
                var card = playerDeck.shift();
                // Add these cards to a comparison pool which is an array of cards
                this.comparisonPool.push(card);
            }
            else {
                console.log(`Player ${i + 1} Removed`)
                this.playerDecks.splice(i, 1);
                i--;
            }
        }
        this.roundCount++
        //console.log('Comparison Pool:', comparisonPool)
        return this.comparisonPool;
    }
    /**
     * A function that plays the cards face-down and does not add them to the comparison pool
     * @returns {Array} warCards
     */
    playFaceDown() {
        // For all three player decks
        for (var i = 0; i < this.playerDecks.length; i++) {
            // The current player deck is the deck at the current index of the array of playerDecks
            var playerDeck = this.playerDecks[i];
            // If there are cards remaining in the playerDeck
            if (playerDeck.length > 0) {
                // Return and remove the top card
                var card = playerDeck.shift();
                // Add these cards to the pool of warCards which will be given to the winning Player
                this.warCards.push(card);
            }
            else {
                this.playerDecks.splice(i, 1);
                i--
            }
        }
        return this.warCards;
    }

    /**
     * A function that takes the comparisonPool and returns the position of the card with the highest value
     * @returns {number} winningCardDeck
     */
    compareCard() {
        // Initial card and card positiona
        var winningCardDeck = 0;
        var winningCardVal = 0;
        this.tiedCards = [];
        this.war = false;
        console.log(`Comparison Pool: ${this.comparisonPool.length}`);
        for (var i = 0; i < this.comparisonPool.length; i++) {
            // The cardValue is whatever the value of the current card is
            var card = this.comparisonPool[i];
            var cardValue = card.value
            console.log(`Card: ${this.comparisonPool[i].value}, Suit: ${this.comparisonPool[i].suit}, Player: ${i + 1}`);
            // If the value of the current card is greater than that of the winningCardVal, then the winningCardVal is the value of the current card
            if (cardValue > winningCardVal) {
                winningCardVal = cardValue;
                // The winning card deck is i + 1, since deckPosition 0 means it is in the initial deck
                winningCardDeck = i;
                this.tiedCards = [i];
                this.war = false;
            } else if (cardValue === winningCardVal) {
                // Add the tied card values into the tiedCards array
                this.tiedCards.push(i);
                // If there is more than one "tiedCard" then war is true
                this.war = true;
            }
        }
        // If war is true and the length of the tied cards arrray is greater than 1 then War
        if (this.war && this.tiedCards.length > 1) {
            console.log('');
            console.log('W A R');
            console.log('P L A Y E R S:', this.tiedCards)
            this.warGame();
            return null;
        } else {
            console.log(`Player ${winningCardDeck + 1} wins this round`);
            // Add winningCardDEck to the winning Player's deck
            if (winningCardDeck < this.playerDecks.length) {
                console.log(`Player ${winningCardDeck + 1} wins this round`);
                this.playerWin(winningCardDeck);
            }
        }

        return winningCardDeck
    }

    /**
     * A function to play the WAR game
     */
    warGame() {
        console.log('Starting War...');

        this.warCount++
        this.warCards.push(...this.comparisonPool)

        // Check if each player has enough cards to continue with war
        for (let i = this.playerDecks.length - 1; i >= 0; i--) {
            if (this.playerDecks[i].length < 2) { // 1 face-down, 1 face-up required
                console.log(`Player ${i + 1} does not have enough cards for war and is removed.`);
                this.removePlayer(i);
            }
        }

        // End the game if only one player is left after removing 
        if (this.playerDecks.length === 1) {
            this.endGame();
            return;
        }
        // Play a card face-down for each player
        this.playFaceDown();
        // Play a card face-up for each player 
        this.comparisonPool = this.playCard();
        // Make sure there are no extra players
        this.removePlayer();

        if (this.playerDecks.length === 1) {
            this.endGame();
            return;
        }
        // Compare the cards from the new comparisonPool
        var winner = this.compareCard();
        if (winner !== null && winner < this.playerDecks.length) {
            this.playerWin(winner);
            console.log(`Total wars: ${this.warCount}`);
            console.log('');
        }
    }

    /**
     * A function which will add the cards won in WAR to the winning player's deck
     * @param {number} winningCardDeck 
     */
    playerWin(winningCardDeck) {
        if (this.comparisonPool.length > 0 || this.warCards.length > 0) {
            // An array to store both the winning deck and the extra cards played during war
            // Add all cards played into the winningPool
            var winningPool = [...this.comparisonPool, ...this.warCards];
            console.log(`Player ${winningCardDeck + 1} has won: ${winningPool.length} cards.`)
            // Add the winning pool to the winning Player's deck
            this.playerDecks[winningCardDeck].push(...winningPool)
            // Reset the warCards array
            this.comparisonPool = [];
            this.warCards = [];
            console.log("Player decks after win:", this.playerDecks)
            console.log(`Player count after round ${this.roundCount - 1}: ${this.playerDecks.length}`);
            console.log('');
        }
    }

    removePlayer() {
        for (var i = this.playerDecks.length - 1; i >= 0; i--) {
            var playerDeck = this.playerDecks[i];
            if (playerDeck.length === 0) {
                console.log(`Player ${i + 1} Removed`)
                this.warCards.push(...playerDeck);
                this.playerDecks.splice(i, 1);
            }
        }

    }


    endGame() {
        if (this.playerDecks.length === 1) {
            console.log('Game Over')
            return null;
        }
    }

    /**
     * A helper function to log all the cards in each deck to ensure that the correct card is being removed from the array
     */
    // DEBUG: Function for debugging 
    /*logPlayerDecks() {
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
    }*/

}

export default Game;