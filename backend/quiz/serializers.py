from rest_framework import serializers
from .models import Quiz, Questions

class QuestionRequestSerializer(serializers.Serializer):
    category = serializers.CharField(max_length=100, required=False)
    difficulty = serializers.CharField(max_length=100, required=False)
    
class QuestionsSerializer(serializers.ModelSerializer):
    options = serializers.ListField(
        child=serializers.CharField()
    )
    class Meta:
        model = Questions
        fields = ['quiz', 'id', 'question', 'options', 'correct_answer', 'user_answer', 'explanation']
        
class QuizSerializer(serializers.ModelSerializer):
    quiz = QuestionsSerializer(many=True, read_only=True)
    score = serializers.IntegerField(required=False, default=None)
    feedback = serializers.CharField(max_length=255, required=False, allow_blank=True)
    class Meta:
        model = Quiz
        fields = ['learner', 'title', 'score', 'feedback', 'input_tokens', 'output_tokens', 'quiz']
