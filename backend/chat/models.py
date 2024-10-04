from django.db import models
from learner.models import Learner
from django.conf import settings

class Chat(models.Model):
    
    chat_id = models.AutoField(primary_key=True)
    learner = models.ForeignKey(Learner, on_delete=models.CASCADE)
    chat_title = models.CharField(max_length=255)
    chat_started_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now_add=True)
    chat_ended_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Chat {self.chat_id} - {self.learner}"
    
class ChatHistory(models.Model):
    
    chat = models.ForeignKey(Chat, related_name='history', on_delete=models.CASCADE)
    message = models.TextField()
    response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    input_tokens = models.IntegerField(default=0)
    output_tokens = models.IntegerField(default=0)

    def __str__(self):
        return f"Chat {self.chat.chat_id} History {self.id}"