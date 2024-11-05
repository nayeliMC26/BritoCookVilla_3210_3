import * as THREE from 'three';
import Deck from './Deck';

class Game {
    constructor(scene) {
        this.scene = scene;
        // Game variables
        this.comparisonPool = [];
        this.warCards = [];
        this.winningPlayerId = null;
        // Counters
        this.roundCount = 0;
        this.warCount = 0;
        // Flag for userInput toggle
        this.gameActive = true;
        // Initializing the game
        this.initGame();
        // DEBUG: Allows us to make sure no cards "disappear" during the game
        this.totalCardsInPlay = this.calculateTotalCards();
        console.log(`Total cards in play at round ${this.roundCount}: ${this.totalCardsInPlay}`);

    }
    /**
     * A function to initialize our game by initializing an initDeck and by initializing our players
     */
    initGame() {
        // Create a new Deck object
        this.initDeck = new Deck(this.scene);
        // Create the standard 52-card deck
        this.initDeck.createDeck();
        // Shuffle the initial deck
        this.initDeck.shuffleDeck();
        // Creat4e player decks by initializing new deck objects
        this.playerDecks = this.initPlayers();
        this.removeLeftoverCard();
        // Create a list of vectors for player positions
        var playerPositions = [
            // Player 1 position
            new THREE.Vector3(-14, 0, 0),
            // Player 2 position 
            new THREE.Vector3(14, 0, 0),
            // Player 3 position
            new THREE.Vector3(0, 0, -14)
        ];
        // For each player, set the playerDeck's position
        this.playerDecks.forEach((deck, index) => {
            deck.setPosition(playerPositions[index]);
            // Rotate Player 3's deck to face the appropriate direction
            if (index === 2) {
                deck.cards.forEach(card => {
                    card.rotation.set(Math.PI / 2, 0, 0);
                })
            }
        });

    }

    /**
     * A function to initialize the player decks 
     * @returns {Array} players
     */
    initPlayers() {
        // Initialize empty array to hold players
        var players = [];
        // The number of cards needed to be dealt to each player (should be of equal length)
        var cardsPerPlayer = Math.floor(this.initDeck.cards.length / 3);
        // For each player in the array of players (in this game it will be 3)
        for (var i = 0; i < 3; i++) {
            // Create a new player deck using the playerId
            var playerDeck = new Deck(this.scene, i + 1);
            // Deal the cards to the playerDecks
            playerDeck.addCards(this.initDeck.dealCards(cardsPerPlayer));
            // Add the playerDecks to the players
            players.push(playerDeck);
        }
        return players;
    }

    /**
     * A function to calculate the total number of cards in play
     * @returns {number} total cards in play
     */
    calculateTotalCards() {
        let total = 0;
        // Iterate over each player's deck and add the total number of cards
        for (let i = 0; i < this.playerDecks.length; i++) {
            total += this.playerDecks[i].cards.length;
        }
        return total;
    }

    /**
     * A function to play a round of the wawr game
     * @returns {Array} comparison pool
     */
    playRound() {
        console.log('R O U N D:', this.roundCount + 1)
        // Initialize empty array to hold cards to compare 
        this.comparisonPool = [];
        // Do a check to make sure there are more than one players in the game
        if (this.checkGameState()) return;
        // FOr each player in the array of playerDecks
        for (var i = 0; i < this.playerDecks.length; i++) {
            // A player deck is one value from the array of playerDecks
            var playerDeck = this.playerDecks[i]
            // A card is a card that gets played from each player deck
            var card = playerDeck.playCard();
            // If the card exists, push the card into the comparison pool
            if (card !== null) {
                this.comparisonPool.push(card);
            } else {
                // If the player is out of cards, remove them and decrement the array of playerDecks
                console.log(`Player ${playerDeck.playerId} removed`)
                this.playerDecks.splice(i, 1);
                i--;
                if (this.checkGameState()) return;
            }

        }
        // Round has ended, increment the count
        this.roundCount++
        return this.comparisonPool;
    }
    /**
     * A function that takes the comparisonPool and returns the position of the card with the highest value
     * @returns {number} winningPlayerId
     */
    compareCard() {
        // If there are less than two players in the game (AKA one) then no comparison is needed, the game is over
        if (this.checkGameState()) return null;

        // Initial winning Card value
        var winningCardVal = 0;
        // Initial winner ID 
        this.winningPlayerId = null;
        // Empty array to hold the tied cards
        var tiedCards = [];
        var war = false;
        console.log(`Comparison Pool: ${this.comparisonPool.length}`);
        for (var i = 0; i < this.comparisonPool.length; i++) {
            // The cardValue is whatever the value of the current card is
            var card = this.comparisonPool[i];
            var cardValue = card.value
            console.log(`Card: ${this.comparisonPool[i].value}, Suit: ${this.comparisonPool[i].suit}, Player: ${this.playerDecks[i].playerId}`);
            // If the value of the current card is greater than that of the winningCardVal, then the winningCardVal is the value of the current card
            if (cardValue > winningCardVal) {
                winningCardVal = cardValue;
                // The winning player id is the id of the player that has the card with the same value as the winning card value
                this.winningPlayerId = this.playerDecks[i].playerId;
                // There is no tie so war is false
                war = false;
            } else if (cardValue === winningCardVal) {
                // Add the tied card values into the tiedCards array
                tiedCards.push(this.winningPlayerId);
                tiedCards.push(this.playerDecks[i].playerId);
                war = true;
            }
        }
        // If war is true and the length of the tied cards arrray is greater than 1 then War
        if (war) {
            console.log('\nW A R');
            console.log('P L A Y E R S:', tiedCards)
            this.warGame();
            return null;
        } else {
            console.log(`Player ${this.winningPlayerId} wins this round`);
            // Add winningCardDEck to the winning Player's deck
            this.playerWin(this.winningPlayerId);
        }
        return this.winningPlayerId
    }

    /**
     * A function to initiate war status during the game
     */
    warGame() {
        console.log('Starting War...');
        // War is starting, incremenet the count
        this.warCount++
        // Push the original compared cards into the war cards array
        this.warCards.push(...this.comparisonPool)
        // Clear the comparison pool
        this.comparisonPool = [];

        // Check if each player has enough cards to continue with war
        for (let i = 0; i < this.playerDecks.length; i++) {
            // A player deck is one deck of the player decks array
            var playerDeck = this.playerDecks[i];
            // A player requires at least two cards to play WAR
            if (this.playerDecks[i].cards.length < 2) {
                console.log(`Player ${playerDeck.playerId} does not have enough cards for war and is removed.`);
                // Fallen player's cards get added to the warCards pool
                this.warCards.push(...playerDeck.cards);
                this.removePlayer(playerDeck.playerId);
                i--
                continue;
            }
            // Play one card face down for each player
            this.warCards.push(playerDeck.playCard());
            // Play one card face up for each player and compare
            this.comparisonPool.push(playerDeck.playCard());
        }
        // If there is only one player left after war end the game
        this.checkGameState();
        // Compare the cards from the new comparisonPool
        var winner = this.compareCard();
        if (winner !== null && winner < this.playerDecks.length) {
            console.log(`Total wars: ${this.warCount}\n`);
        }
    }


    /**
     * A function which will add the cards won in WAR to the winning player's deck
     * @param {number} winningPlayerId 
     */
    playerWin(winningPlayerId) {
        if (this.comparisonPool.length > 0 || this.warCards.length > 0) {
            // Add all cards played into the winningPool including compared cards and fallen player cards
            var winningPool = [...this.comparisonPool, ...this.warCards];
            console.log(`Player ${winningPlayerId} has won: ${winningPool.length} cards.`)
            // For each playerDeck in the array of players
            for (let i = 0; i < this.playerDecks.length; i++) {
                // If the current playersId is the same as the winningPLayer's Id
                if (this.playerDecks[i].playerId === winningPlayerId) {
                    // Add the winningPool to the winning player's deck
                    this.playerDecks[i].addCards(winningPool);
                }
                console.log("Player", this.playerDecks[i].playerId, " deck after round:", [...this.playerDecks[i].cards]);


            }
            // Reset the warCards array and the comparisonPool
            this.comparisonPool = [];
            this.warCards = [];
            this.totalCardsInPlay = this.calculateTotalCards();

        }
        console.log(`Player count after round ${this.roundCount}: ${this.playerDecks.length}\n`);
        console.log(`Total cards in play after round ${this.roundCount}: ${this.totalCardsInPlay}\n\n`);
    }
    /**
     * A function which will remove a player ffrom the game when they no longer have enough cards to play
     * @param {*} playerId 
     */
    removePlayer(playerId) {
        // Iterate backwards through the array of plauyers
        for (var i = this.playerDecks.length - 1; i >= 0; i--) {
            // If the current player is the one that needs to be removed
            if (this.playerDecks[i].playerId === playerId) {
                console.log(`Player ${playerId} Removed`)
                // Add the fallen players cards to the warCards array
                this.warCards.push(...this.playerDecks[i].cards);
                // Remove the player from the players
                this.playerDecks.splice(i, 1);
                break;
            }
        }

    }

    /**
     * A function to end the game once there is only one player remaining 
     * @returns null
     */
    endGame() {
        // If the game is over, the game is no longer active
        this.gameActive = false;
        // If there is only one player left in the game then they are the winner of the game
        if (this.playerDecks.length === 1) {
            console.log(`Game Over! Player ${this.playerDecks[0].playerId} is the winner!`);
            return null;
        }
    }
    /**
     * A function to check if the game still has trh appropriate number of players
     * @returns {boolean}
     */
    checkGameState() {
        if (this.playerDecks.length === 1) {
            this.endGame();
            return true;
        }
        return false;
    }

    /**
     * A function to handle the leftover card that will always exist after dealing playerDecks
     */
    removeLeftoverCard() {
        this.initDeck.cards = [];
    }


}

export default Game;