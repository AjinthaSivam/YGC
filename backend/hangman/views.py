from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.http import JsonResponse
import openai
import re
import random

# Ensure you have your OpenAI API key set up in your environment or settings
openai.api_key = 'YOUR_OPENAI_API_KEY'
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

def choose_category(request):
    categories = ["animals", "fruits", "countries", "colors", "sports", "vegetables", "clothing", "parts of the body", "jobs", "weather", "transportations", "flowers"]
    if request.method == "POST":
        category_choice = int(request.POST.get("category_choice", 1)) - 1
        if 0 <= category_choice < len(categories):
            return JsonResponse({"category": categories[category_choice]})
        return JsonResponse({"error": "Invalid choice"}, status=400)
    return JsonResponse({"categories": categories})

def get_word_from_gpt(category=None):
    while True:
        if category:
            prompt = f"Give me a single word related to '{category}' for a hangman game. The word should have no symbols and should be between 5-8 letters long."
        else:
            prompt = "Give me a single word for a hangman game. The word should have no symbols and should be between 5-8 letters long."

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )

        word = response.choices[0].message['content'].strip()
        word = re.sub(r'[^a-zA-Z]', '', word)
        if len(word.split()) == 1 and 5 <= len(word) <= 8:
            return word.lower()

@csrf_exempt
def play_hangman(request):
    if request.method == "POST":
        category = request.POST.get("category", None)
        if category:
            word = get_word_from_gpt(category)
        else:
            word = get_word_from_gpt()  # Default word if no category is selected

        guessed_letters = set()
        attempts = 6
        revealed_letter = random.choice(word)
        guessed_letters.add(revealed_letter)

        if 'guess' in request.POST:
            guess = request.POST.get('guess').lower()
            if len(guess) != 1 or not guess.isalpha():
                return JsonResponse({"error": "Invalid guess"}, status=400)
            if guess in guessed_letters:
                return JsonResponse({"message": "Already guessed"}, status=400)
            guessed_letters.add(guess)
            if guess in word:
                message = f"Good job! {guess} is in the word."
            else:
                attempts -= 1
                message = f"Sorry, {guess} is not in the word."
            
            if set(word) == guessed_letters:
                return JsonResponse({"message": f"Congratulations! You've guessed the word: {word}"})
            if attempts <= 0:
                return JsonResponse({"message": f"Game over! The word was: {word}"})
            return JsonResponse({
                "display_word": " ".join([letter if letter in guessed_letters else "_" for letter in word]),
                "hangman_stage": display_hangman(attempts),
                "attempts": attempts,
                "guessed_letters": list(guessed_letters),
                "message": message
            })
        return JsonResponse({"error": "No guess provided"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

def display_hangman(attempts):
    stages = [
        """
           -----
           |   |
               |
               |
               |
               |
        ---------
        """,
        """
           -----
           |   |
           O   |
               |
               |
               |
        ---------
        """,
        """
           -----
           |   |
           O   |
           |   |
               |
               |
        ---------
        """,
        """
           -----
           |   |
           O   |
          /|   |
               |
               |
        ---------
        """,
        """
           -----
           |   |
           O   |
          /|\\  |
               |
               |
        ---------
        """,
        """
           -----
           |   |
           O   |
          /|\\  |
          /    |
               |
        ---------
        """,
        """
           -----
           |   |
           O   |
          /|\\  |
          / \\  |
               |
        ---------
        """
    ]
    return stages[6 - attempts]
