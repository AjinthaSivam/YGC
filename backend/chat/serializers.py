from rest_framework import serializers
from .models import Chat, ChatHistory

class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ['message', 'response', 'timestamp', 'input_tokens', 'output_tokens']
        
class ChatSerializer(serializers.ModelSerializer):
    history = ChatHistorySerializer(many=True, read_only=True)
    class Meta:
        model = Chat
        fields = ['chat_id', 'learner', 'chat_title', 'chat_started_at', 'chat_ended_at', 'history']
