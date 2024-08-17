from django.contrib import admin
from django.urls import path, include
from chat.views import chat_view, get_chat_history, end_conversation
from learner import views as learner_views
import quiz.urls as quiz_urls
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from historical.views import historical_chat_view

urlpatterns = [
    path("admin/", admin.site.urls),
    
    # Chat-related endpoints
    path('api/chat/', chat_view, name='chat-view'),
    path('api/chat/history', get_chat_history, name='get_chat_history'),
    path('api/end_conversation/', end_conversation, name='end_conversation'),
    
    # Learner-related endpoints
    path('api/register/', learner_views.register_view, name='register'),
    path('api/login/', learner_views.login_view, name='login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Quiz-related endpoints
    path('quiz/', include(quiz_urls)),
    
    # Historical chat related
    path('api/historical/chat/', historical_chat_view, name='historical_chat_view'),

    # Pastpaper Related
    

]
