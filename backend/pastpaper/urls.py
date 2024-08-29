from django.urls import path
from pastpaper import views

urlpatterns = [
    path('api/', views.chat_view, name='pastpaer-chat-view')
]
