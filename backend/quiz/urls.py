from django.urls import path
from .views import GenerateQuestionsView

urlpatterns = [
    path('generate_questions/', GenerateQuestionsView.as_view(), name='generate_questions'),
]
