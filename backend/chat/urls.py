from django.urls import path
from . import views

urlpatterns = [
    path('rename_chat_session/<str:chat_id>/', views.rename_chat_session, name='rename_chat_session'),
    path('delete_chat_session/<str:chat_id>/', views.delete_chat_session, name='delete_chat_session'),
    path('soft_delete_chat_session/<str:chat_id>/', views.soft_delete_chat_session, name='soft_delete_chat_session'),
]
