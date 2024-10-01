from django.conf import settings
from .models import LearnerQuota
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_premium(request):
    learner = request.user
    return Response({'learner_id': learner.id, 'is_premium': learner.is_premium}, status=status.HTTP_200_OK)

def check_and_update_quota(learner, bot_type):
    
    # for premium users - unlimited access
    if learner.is_premium:
        return True, None, None  # Added None for remaining_quota

    # Get the learner's quota record
    try:
        quota = LearnerQuota.objects.get(learner=learner)
    except LearnerQuota.DoesNotExist:
        quota = LearnerQuota.objects.create(learner=learner)
        
    # Reset daily quota
    today = timezone.now().date()
    if quota.last_reset_date != today:
        quota.general_bot_quota = settings.BOT_QUOTAS['general_bot']
        quota.pastpaper_bot_quota = settings.BOT_QUOTAS['pastpaper_bot']
        quota.historical_bot_quota = settings.BOT_QUOTAS['historical_bot']
        quota.last_reset_date = today
        quota.save()
        
    
    # Fetch the corresponding quota limit from settings
    if bot_type == 'general_bot':
        remaining_quota = quota.general_bot_quota
    elif bot_type == 'pastpaper_bot':
        remaining_quota = quota.pastpaper_bot_quota
    elif bot_type == 'historical_bot':
        remaining_quota = quota.historical_bot_quota
    else:
        return False, "Invalid bot type.", None

    
    # Check if the user has used up their quota
    if remaining_quota <= 0:
        return False, f"You've reached your daily chat limit. Please try again tomorrow or upgrade your plan.", 0
    
    
    if bot_type == 'general_bot':
        quota.general_bot_quota -= 1
    elif bot_type == 'pastpaper_bot':
        quota.pastpaper_bot_quota -= 1
    elif bot_type == 'historical_bot':
        quota.historical_bot_quota -= 1
    else:
        # Fallback error if somehow an invalid bot type was passed (shouldn't be reached)
        return False, "Error updating quota. Invalid bot type.", None
    
    # Increment the appropriate bot's call count
    if bot_type == 'general_bot':
        quota.general_bot_calls += 1
    elif bot_type == 'pastpaper_bot':
        quota.pastpaper_bot_calls += 1
    elif bot_type == 'historical_bot':
        quota.historical_bot_calls += 1
    else:
        # Fallback error if somehow an invalid bot type was passed (shouldn't be reached)
        return False, "Error updating quota. Invalid bot type.", None

    quota.save()
    
    return True, None, remaining_quota - 1

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_learner_quota(request):
    learner = request.user
    try:
        quota = LearnerQuota.objects.get(learner=learner)
    except LearnerQuota.DoesNotExist:
        quota = LearnerQuota.objects.create(learner=learner)
    
    response_data = {
        'learner_id': learner.id,
        'general_bot_quota': quota.general_bot_quota,
        'pastpaper_bot_quota': quota.pastpaper_bot_quota,
        'historical_bot_quota': quota.historical_bot_quota,
        'last_reset_date': quota.last_reset_date,
    }
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_quota(request):
    learner = request.user
    try:
        quota = LearnerQuota.objects.get(learner=learner)
    except LearnerQuota.DoesNotExist:
        return Response({'error': 'Quota not found for this learner'}, status=status.HTTP_404_NOT_FOUND)
    
    # Reset daily quota
    today = timezone.now().date()
    if quota.last_reset_date is None or quota.last_reset_date != today:
        quota.general_bot_quota = settings.BOT_QUOTAS['general_bot']
        quota.pastpaper_bot_quota = settings.BOT_QUOTAS['pastpaper_bot']
        quota.historical_bot_quota = settings.BOT_QUOTAS['historical_bot']
        quota.last_reset_date = today
    else:
        return Response({'message': 'Quota already reset for today'}, status=status.HTTP_200_OK)
    
    quota.save()
    
    return Response({'message': 'Quota reset successfully'}, status=status.HTTP_200_OK)
    
