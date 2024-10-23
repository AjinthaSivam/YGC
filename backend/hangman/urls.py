from django.urls import path
from .views import choose_category, play_hangman, guess_letter

urlpatterns = [
    path('choose-category/', choose_category, name='choose_category'),
    path('play-hangman/', play_hangman, name='play_hangman'),
    path('guess-letter/', guess_letter, name='guess_letter'),
]
