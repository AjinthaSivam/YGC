from rest_framework import serializers

class QuestionRequestSerializer(serializers.Serializer):
    category = serializers.CharField(max_length=100, required=False)
    difficulty = serializers.CharField(max_length=100, required=False)
