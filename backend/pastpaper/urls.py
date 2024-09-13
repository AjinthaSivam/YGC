from django.urls import path
from pastpaper import views

urlpatterns = [
    path('api/', views.chat_view, name='pastpaer-chat-view'),
    path('history/', views.get_chat_history, name='get-chat-history'),
]
