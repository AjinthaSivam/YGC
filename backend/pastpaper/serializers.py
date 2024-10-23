from rest_framework import serializers
from .models import PastPaperChat

class PastPaperChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = PastPaperChat
        fields = '__all__'