from rest_framework import serializers
from .models import Learner

class LearnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Learner
        fields = ['id', 'firstname', 'lastname', 'email', 'grade', 'username', 'mobile_no', 'address', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Learner.objects.create_user(**validated_data)
        return user
