from django.db import models
from learner.models import Learner

class Quiz(models.Model):
    learner = models.ForeignKey(Learner, on_delete=models.CASCADE, default=1)
    title = models.CharField(max_length=255)
    score = models.FloatField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    input_tokens = models.IntegerField(default=0)
    output_tokens = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Quiz {self.id}"
    
class Questions(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    question = models.TextField()
    options = models.JSONField()
    correct_answer = models.TextField()
    user_answer = models.TextField(null=True, blank=True)
    explanation = models.TextField()

    def __str__(self):
        return f"Quiz {self.quiz.quiz_id} questions {self.id}"