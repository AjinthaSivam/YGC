import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hangman.css';  // This will be the CSS file for the Hangman component

const Hangman = () => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [guess, setGuess] = useState("");
    const [csrfToken, setCsrfToken] = useState('');

    // Fetch CSRF token on load
    useEffect(() => {
        axios.get('http://localhost:8000/get-csrf-token/')
            .then(response => setCsrfToken(response.data.csrfToken))
            .catch(error => console.error('Error fetching CSRF token', error));
    }, []);

    // Fetch categories from backend on component load
    useEffect(() => {
        axios.post('http://localhost:8000/choose-category/', {}, {
            headers: { 'X-CSRFToken': csrfToken }
        })
        .then(response => setCategories(response.data.categories))
        .catch(error => console.error(error));
    }, [csrfToken]);

    const startGame = (selectedCategory) => {
        axios.post('http://localhost:8000/play-hangman/', { category: selectedCategory }, {
            headers: { 'X-CSRFToken': csrfToken }
        })
        .then(response => setGameState(response.data))
        .catch(error => console.error(error));
        setCategory(selectedCategory);
    };

    const makeGuess = () => {
        axios.post('http://localhost:8000/play-hangman/', { category, guess }, {
            headers: { 'X-CSRFToken': csrfToken }
        })
        .then(response => {
            setGameState(response.data);
            setGuess("");  // Reset input after each guess
        })
        .catch(error => console.error(error));
    };

    return (
        <div className="hangman-container">
            {category === null ? (
                <div className="category-selection">
                    <h2>Select a Category</h2>
                    {categories.map((cat, index) => (
                        <button key={index} onClick={() => startGame(cat)}>
                            {cat}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="game-play">
                    <h2>Hangman Game</h2>
                    <div className="hangman-stage">
                        {gameState && <pre>{gameState.hangman_stage}</pre>}
                    </div>
                    <div className="word-display">
                        {gameState && gameState.display_word}
                    </div>
                    <div className="attempts">
                        Attempts Remaining: {gameState && gameState.attempts}
                    </div>
                    <input
                        type="text"
                        maxLength="1"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Guess a letter"
                    />
                    <button onClick={makeGuess}>Submit Guess</button>
                    <div className="guessed-letters">
                        Guessed Letters: {gameState && gameState.guessed_letters.join(', ')}
                    </div>
                    <div className="message">
                        {gameState && gameState.message}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hangman;
