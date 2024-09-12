from django.db import models
from learner.models import Learner

class PastPaperChat(models.Model):
    learner = models.ForeignKey(Learner, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    user_input = models.TextField()
    response = models.TextField()
    input_tokens = models.IntegerField(default=0)
    output_tokens = models.IntegerField(default=0)
