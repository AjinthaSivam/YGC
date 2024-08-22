from django.urls import path
from . import views

urlpatterns = [
    path('choose-category/', views.choose_category, name='choose_category'),
    path('play-hangman/', views.play_hangman, name='play_hangman'),
]
