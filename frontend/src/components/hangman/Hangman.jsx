// Hangman.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hangman.css';  // Import your CSS styles

const Hangman = () => {
    // State variables for managing game state
    const [categories, setCategories] = useState([]); // Store categories
    const [selectedCategory, setSelectedCategory] = useState(''); // Currently selected category
    const [word, setWord] = useState(''); // Word to guess
    const [revealedLetter, setRevealedLetter] = useState(''); // Revealed letters
    const [guessedLetters, setGuessedLetters] = useState([]); // Letters guessed so far
    const [wrongGuesses, setWrongGuesses] = useState([]); // Wrong guesses
    const [attempts, setAttempts] = useState(6); // Remaining attempts
    const [gameStarted, setGameStarted] = useState(false); // Whether the game has started
    const [gameOver, setGameOver] = useState(false); // Whether the game is over
    const [loading, setLoading] = useState(false); // Loading state for fetching data
    const [loadingProgress, setLoadingProgress] = useState(0); // Loading progress percentage

    // Fetch categories on component mount
    useEffect(() => {
        axios.get('http://localhost:8000/hangman/choose-category/')
            .then(response => {
                setCategories(response.data.categories); // Set categories from the response
            })
            .catch(error => {
                console.error('Error fetching categories:', error); // Log error if fetching fails
            });
    }, []);

    // Handle category selection change
    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value); // Update selected category
    };

    // Start the game with the selected category
    const startGame = () => {
        if (selectedCategory) {
            setLoading(true); // Set loading state
            let progress = 0;

            // Simulate loading progress
            const loadingInterval = setInterval(() => {
                progress += 10;
                setLoadingProgress(progress);
                if (progress >= 100) {
                    clearInterval(loadingInterval); // Clear interval when loading completes
                }
            }, 200);

            // Fetch a random word based on the selected category
            axios.get(`http://localhost:8000/hangman/play-hangman/?category=${selectedCategory}`)
                .then(response => {
                    clearInterval(loadingInterval); // Clear loading interval
                    setLoading(false); // Reset loading state
                    setLoadingProgress(100); // Complete loading progress

                    // Set game state based on the response
                    setWord(response.data.word);
                    setRevealedLetter(response.data.masked_word);
                    setGuessedLetters([]);
                    setWrongGuesses([]);
                    setAttempts(response.data.attempts);
                    setGameOver(false);
                    setGameStarted(true);
                })
                .catch(error => {
                    console.error('Error starting game:', error); // Log error if starting fails
                    setLoading(false); // Reset loading state
                    clearInterval(loadingInterval); // Clear loading interval
                });
        }
    };

    // Handle letter guess
    const handleGuess = (guess) => {
        if (guessedLetters.includes(guess) || gameOver) {
            return; // Ignore if already guessed or game is over
        }

        // Send guess to the server
        axios.get(`http://localhost:8000/hangman/guess-letter/?letter=${guess}`)
            .then(response => {
                const { attempts: newAttempts, guessed_letters, masked_word, wrong_guesses, error } = response.data;

                if (error) {
                    console.error("Error:", error); // Log any error received
                    return;
                }

                // Update game state based on response
                setGuessedLetters(guessed_letters);
                setWrongGuesses(wrong_guesses);
                setAttempts(newAttempts);
                setRevealedLetter(masked_word);

                // Check for game over conditions
                if (newAttempts === 0 || !masked_word.includes('_')) {
                    setGameOver(true);
                }
            })
            .catch(error => {
                console.error('Error guessing letter:', error); // Log error if guessing fails
            });
    };

    // Display the current word with guessed letters revealed
    const displayWord = () => {
        return revealedLetter.split('').map((letter, index) => (
            <span key={index} className="word-letter">
                {letter}
            </span>
        ));
    };

    // Get the path for the hangman image based on attempts left
    const getHangmanImage = () => {
        return `/static/images/stage${6 - attempts}.png`; // Assuming images are named stage0.png to stage6.png
    };

    // Handle virtual keyboard button press
    const handleVirtualKeyPress = (letter) => {
        handleGuess(letter); // Make a guess based on button pressed
    };

    // Handle back button click
    const handleBackButton = () => {
        setGameStarted(false); // Reset game state
        setSelectedCategory('');
        setGuessedLetters([]);
        setWrongGuesses([]);
        setAttempts(6);
        setGameOver(false);
    };

    return (
        <div className="hangman-container">
            <h1 className="hangman-title">Hangman Game</h1>
            <br />

            {/* Show loading screen if loading */}
            {loading && (
                <div className="loading-screen">
                    <p>Loading... {loadingProgress}%</p>
                    <img src="/static/images/loading.png" alt="Loading..." /> {/* Replace with your loading image path */}
                </div>
            )}

            {/* Game area if game is started and not over */}
            {!loading && gameStarted && !gameOver && (
                <div className="game-area">
                    <p>Category: <strong>{selectedCategory}</strong></p>
                    <img src={getHangmanImage()} alt="Hangman stage" className="hangman-image" />
                    <div className="word-display">
                        {displayWord()}
                    </div>
                    <div className="guessed-letters">
                        <p>Guessed Letters: {guessedLetters.join(', ')}</p>
                    </div>
                    <div className="wrong-guesses">
                        <p>Wrong Guesses:</p>
                        <div className="wrong-guess-box">
                            {wrongGuesses.map((letter, index) => (
                                <span key={index} className="wrong-letter">{letter}</span>
                            ))}
                        </div>
                    </div>
                    <p>Attempts Remaining: {attempts}</p>
                    {/* Virtual keyboard */}
                    <div className="virtual-keyboard">
                        {Array.from(Array(26)).map((_, i) => {
                            const letter = String.fromCharCode(65 + i); // 'A' to 'Z'
                            return (
                                <button key={letter} className="key" onClick={() => handleVirtualKeyPress(letter.toLowerCase())}>
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Category selection area if game is not started */}
            {!gameStarted && (
                <div className="category-selection">
                    <h2>Select a Category</h2>
                    <br />
                    <div className="category-area">
                        <select value={selectedCategory} onChange={handleCategoryChange} className="category-dropdown">
                            <option value="" disabled>{categories.length === 0 ? 'Error loading categories...' : 'Select a category'}</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <button className="start-button" onClick={startGame} disabled={!selectedCategory}>
                            Start Game
                        </button>
                    </div>
                </div>
            )}

            {/* Show game over message */}
            {gameOver && (
                <div className="game-over-message">
                    <h2>Game Over!</h2>
                    <p>{revealedLetter.includes('_') ? "You lost!" : "Congratulations, you won!"}</p>
                    <button className="restart-button" onClick={handleBackButton}>Play Again</button>
                </div>
            )}
        </div>
    );
};

export default Hangman;
