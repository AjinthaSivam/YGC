from django.urls import path
from . import utils

urlpatterns = [
    path('check_premium', utils.check_premium, name='check_premium'),
    path('get_learner_quota', utils.get_learner_quota, name='get_learner_quota'),
    path('reset_quota/', utils.reset_quota, name='reset_quota'),
]