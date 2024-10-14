from django.urls import path
from pastpaper import views
#from PastpaperFiles import views

urlpatterns = [
    path('api/', views.chat_view, name='pastpaper-chat-view'),
    path('history/', views.get_chat_history, name='get-chat-history'),
    #path('api/',views.chat_view, name='pastpaper-chat-view'),
]

