from django.urls import path
from .views import generate_quiz, submit_quiz

urlpatterns = [
    path('generate_questions/', generate_quiz, name='generate_questions'),
    path('submit_questions/', submit_quiz, name='submit_questions')
]

