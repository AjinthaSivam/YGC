from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from .serializers import LearnerSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    serializer = LearnerSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        access = AccessToken.for_user(user)
        user_data = {
            'id': user.id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email,
            'grade': user.grade,
            'mobile_no': user.mobile_no,
            'address': user.address,
            'username': user.username,
        }
        return Response({
            'access': str(access),
            'user': user_data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def refresh_token_view(request):
    try:
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate and create a RefreshToken object
        refresh = RefreshToken(refresh_token)

        # Check if the token is valid and retrieve the access token
        access = str(refresh.access_token)

        return Response({
            'access': access,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@csrf_exempt
def login_view(request):
    username_or_email = request.data.get('username_or_email')
    password = request.data.get('password')

    user = authenticate(request, username=username_or_email, password=password)

    if user:
        access = AccessToken.for_user(user)
        refresh = RefreshToken.for_user(user)
        
        user_data = {
            'id': user.id,
            'firstname': user.firstname,  # Include fullname in response
            'lastname': user.lastname,
            'email': user.email,
            'grade': user.grade,
            'mobile_no': user.mobile_no,
            'address': user.address,
            'username': user.username,
        }

        return Response({
            'access': str(access),
            'refresh': str(refresh),
            'user': user_data,  # Include user_data in response
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)