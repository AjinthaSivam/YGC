from django.urls import path
from .views import generate_quiz, submit_quiz, get_quiz_history, get_quiz_questions, soft_delete_quiz

urlpatterns = [
    path('generate_questions/', generate_quiz, name='generate_questions'),
    path('submit_questions/<int:quiz_id>/', submit_quiz, name='submit_questions'),
    path('get_quiz_history', get_quiz_history, name='get_quiz_history'),
    path('get_quiz_questions/<int:quiz_id>/', get_quiz_questions, name='get_quiz_questions'),
    path('soft_delete_quiz/<int:quiz_id>/', soft_delete_quiz, name='soft_delete_quiz'),   
]

