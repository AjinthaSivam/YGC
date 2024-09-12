from rest_framework import serializers
from .models import HistoricalChat, HistoricalChatHistory

class HistoricalChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalChatHistory
        fields = ['message', 'response', 'timestamp', 'input_tokens', 'output_tokens']
        
class HistoricalChatSerializer(serializers.ModelSerializer):
    history = HistoricalChatHistorySerializer(many=True, read_only=True)
    class Meta:
        model = HistoricalChat
        fields = ['chat_id', 'learner', 'chat_title', 'chat_started_at', 'chat_ended_at', 'history']
