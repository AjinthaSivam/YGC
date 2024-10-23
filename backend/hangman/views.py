#views.py
from django.http import JsonResponse
import openai
import random
import re
import os
from dotenv import load_dotenv
from django.views.decorators.http import require_GET
from django.shortcuts import get_object_or_404

load_dotenv()  # Load environment variables from .env


openai.api_key = os.getenv('OPENAI_API_KEY')  # Assuming you have it in the .env file.


# Function to choose a category
def choose_category(request):
    categories = ["Animals", "Fruits", "Countries", "Colors", "Sports", "Vegetables", "Clothing", "Parts of the body", "Jobs", "Weather", "Transportations", "Flowers"]
    return JsonResponse({"categories": categories})

# Updated function to get a word from GPT-3.5 based on the chosen category
def get_word_from_gpt(category=None):
    while True:
        if category:
            prompt = f"Give me a single word related to '{category}' for a hangman game. The word should have no symbols and should be between 4-12 letters long."
        else:
            prompt = "Give me a single word for a hangman game. The word should have no symbols and should be between 4-12 letters long."

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )

        # Log the response for debugging purposes
        print("GPT response:", response)

        try:
            message_content = response['choices'][0]['message']['content'].strip()
            match = re.search(r'\b[a-zA-Z]{4,12}\b', message_content)
            if match:
                word = match.group(0).lower()  # Ensure it's in lowercase
                print(f"Valid word found: {word}")
                return word
            else:
                print(f"No valid word found in response: {message_content}")
                continue

        except (KeyError, IndexError) as e:
            print("Error fetching word from GPT response:", e)
            continue


# Function to handle playing the hangman game
# Function to handle playing the hangman game
def play_hangman(request):
    category = request.GET.get('category')
    word = get_word_from_gpt(category)  # Get word from GPT
    
    if not word:
        return JsonResponse({"error": "No word found"}, status=400)
    
    # Store the word in session
    request.session['word'] = word  # Store as-is, already in lowercase
    request.session['guessed_letters'] = []
    request.session['attempts'] = 6
    print(f"Game started with word: {word}")  # Log the word

    # Mark session as modified
    request.session.modified = True

    # Choose a letter as a clue from the word
    clue_index = random.randint(0, len(word) - 1)  # Random index in the range of the word
    clue_letter = word[clue_index].lower()  # Get the letter at that index
    
    # Create the masked word, revealing the clue letter
    masked_word = ''.join([letter if letter == clue_letter else '_' for letter in word])

    return JsonResponse({"word": word, "masked_word": masked_word, "clue_letter": clue_letter, "attempts": 6})


# Function to handle guessing a letter
@require_GET
def guess_letter(request):
    letter = request.GET.get('letter', '').lower()
    print(f"Received guess: {letter}")  # Log the guessed letter

    # Get the word and other session data
    word = request.session.get('word')
    
    if word is None:  # Check if the word is None
        return JsonResponse({"error": "Game has not been started or word not found"}, status=400)

    guessed_letters = request.session.get('guessed_letters', [])
    attempts = request.session.get('attempts', 6)

    # Validate the guessed letter
    if not letter.isalpha() or len(letter) != 1:
        return JsonResponse({"error": "Invalid letter"}, status=400)

    # Check if the letter has already been guessed
    if letter in guessed_letters:
        return JsonResponse({"error": "Letter already guessed"}, status=400)

    # Add guessed letter to the list
    guessed_letters.append(letter)
    request.session['guessed_letters'] = guessed_letters

    # Check if the guessed letter is in the word
    if letter not in word:
        attempts -= 1  # Decrement attempts if the guess is wrong

    # Update the session with new attempts
    request.session['attempts'] = attempts

    # Create the updated masked word
    masked_word = ''.join([letter if letter in guessed_letters else '_' for letter in word])

    # Check for game-over conditions
    wrong_guesses = [g for g in guessed_letters if g not in word]

    # End the game if attempts run out or the word is fully guessed
    if attempts == 0 or masked_word == word:
        return JsonResponse({
            "masked_word": masked_word,
            "guessed_letters": guessed_letters,
            "wrong_guesses": wrong_guesses,
            "attempts": attempts,
            "game_over": True
        })

    # Return the updated masked word and game state
    return JsonResponse({
        "masked_word": masked_word,
        "guessed_letters": guessed_letters,
        "wrong_guesses": wrong_guesses,
        "attempts": attempts
    })
