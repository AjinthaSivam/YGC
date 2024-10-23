from django.http import JsonResponse
import json
import openai
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import HistoricalChat, HistoricalChatHistory
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
import re
import tiktoken

# Set your OpenAI API key
openai.api_key = settings.OPENAI_API_KEY

max_input_length = 200

def limit_input_length(user_input, max_length=max_input_length):
    if len(user_input) > max_length:
        user_input = user_input[:max_length] + "..."
        print(f"Input was too long. Truncated to {max_length} characters.")
    return user_input

# count tokens for a text
def count_tokens(text, model='gpt-4o-mini'):
    enc = tiktoken.encoding_for_model(model)
    return len(enc.encode(text))

# Function to truncate conversation history based on token count
def truncate_conversation(history, max_tokens=3000):
    total_tokens = 0
    truncated_history = []

    # Iterate from the most recent to the oldest message
    for entry in reversed(history):
        message_tokens = count_tokens(entry['content'])
        if total_tokens + message_tokens > max_tokens:
            break  # Stop adding messages if the limit is exceeded
        total_tokens += message_tokens
        truncated_history.insert(0, entry)  # Insert in reverse order to preserve history

    return truncated_history



# Use a cache or database for conversation history instead of a global variable
from django.core.cache import cache

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def historical_chat_view(request):
    try:
        data = json.loads(request.body)
        user_input = data.get('user_input', '')
        
        number_of_input_tokens = count_tokens(user_input)
        
        if number_of_input_tokens > max_input_length:
            return JsonResponse({
                'error': f"Input too long. Please limit your input to {max_input_length} characters."
            }, status=400)
        
        user_input = limit_input_length(user_input)
        new_chat = data.get('new_chat', False)
        chat_id = data.get('chat_id')
        learner = request.user

        if new_chat or chat_id is None:
            # Start a new chat session
            cache.set(f'conversation_history_{learner.id}', [])

            # Initialize chat history
            chat_history = []

            # Create a new chat session in the HistoricalChat table
            new_chat = HistoricalChat.objects.create(
                learner=learner,
                chat_title="New Chat",
                chat_started_at=timezone.now()
            )

            chat_id = new_chat.chat_id
        else:
            # Continue existing chat session
            chat_history = cache.get(f'conversation_history_{learner.id}', [])

            # Truncate conversation history to fit within token limits
            chat_history = truncate_conversation(chat_history, max_tokens=3000)

        # Build the message history to provide context
        messages = [
            {
                "role": "system",
                "content": (
                    "You are Dr. A.P.J. Abdul Kalam. Provide clear, motivational responses with emojis and bullet points. Keep replies concise, inspire excellence, and guide users back to relevant topics if needed."
                )
            }
        ]

        for entry in chat_history:
            messages.append({"role": entry['role'], "content": entry['content']})
        messages.append({"role": "user", "content": user_input})

        # Use OpenAI API to get assistant's response
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens = 150
        )

        assistant_response = response['choices'][0]['message']['content'].strip()
        usage = response['usage']
        input_tokens = usage['prompt_tokens']
        output_tokens = usage['completion_tokens']

        # Add motivational touch to the response
        assistant_response = format_response(assistant_response)

        # Validate the assistant's response
        if not assistant_response or "random" in assistant_response:
            assistant_response = "🌟 Remember, every challenge is an opportunity to grow. Please ask your question again or let me know how I can assist you further. 🌟"

        # Update conversation history
        chat_history.append({"role": "user", "content": user_input})
        chat_history.append({"role": "assistant", "content": assistant_response})
        cache.set(f'conversation_history_{learner.id}', chat_history)

        # Save chat history to the database
        HistoricalChatHistory.objects.create(
            chat=HistoricalChat.objects.get(chat_id=chat_id),
            message=user_input,
            response=assistant_response,
            input_tokens=input_tokens,
            output_tokens=output_tokens
        )

        return JsonResponse({'response': assistant_response, 'chat_id': chat_id}, safe=False)

    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error("Error in historical_chat_view:", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)


import re

def format_response(response):
    # Bold text
    response = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', response)
    
    # Bullet points
    response = re.sub(r'\n- (.*?)\n', r'\n<li>\1</li>\n', response)
    response = re.sub(r'- (.*?)\n', r'<li>\1</li>\n', response)
    response = re.sub(r'(<li>.*?</li>)\n(<li>)', r'\1</ul>\n<ul>\n\2', response, flags=re.DOTALL)
    response = re.sub(r'\n<ul>\n<li>', r'<ul>\n<li>', response, flags=re.DOTALL)
    response = re.sub(r'</li>\n<ul>', r'</li>\n</ul>\n<ul>', response, flags=re.DOTALL)
    response = re.sub(r'</li>\n</ul>\n<ul>', r'</li>\n', response, flags=re.DOTALL)
    if response.count('<ul>') > 0:
        response = "<ul>" + response + "</ul>"
    
    # Numbered lists
    response = re.sub(r'\n\d+\. (.*?)\n', r'\n<li>\1</li>\n', response)
    response = re.sub(r'\d+\. (.*?)\n', r'<li>\1</li>\n', response)
    response = re.sub(r'(<li>.*?</li>)\n(<li>)', r'\1</ol>\n<ol>\n\2', response, flags=re.DOTALL)
    response = re.sub(r'\n<ol>\n<li>', r'<ol>\n<li>', response, flags=re.DOTALL)
    response = re.sub(r'</li>\n<ol>', r'</li>\n</ol>\n<ol>', response, flags=re.DOTALL)
    response = re.sub(r'</li>\n</ol>\n<ol>', r'</li>\n', response, flags=re.DOTALL)
    if response.count('<ol>') > 0:
        response = "<ol>" + response + "</ol>"

    # Emojis
    response = response.replace("important", "🚨 Important")
    response = response.replace("practice", "📝 Practice")
    response = response.replace("explanation", "📖 Explanation")
    response = response.replace("examples", "🔍 Examples")
    
    # Remove extra spaces between list items and tags
    response = re.sub(r'(\s+<li>)', r'<li>', response)
    response = re.sub(r'(<li>\s+)', r'<li>', response)
    response = re.sub(r'(\s+</ul>)', r'</ul>', response)
    response = re.sub(r'(\s+</ol>)', r'</ol>', response)
    response = re.sub(r'(\s+<ul>)', r'<ul>', response)
    response = re.sub(r'(\s+<ol>)', r'<ol>', response)
    
    return response



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def end_historical_conversation(request):
    try:
        learner = request.user

        # Clear conversation state for the learner
        cache.delete(f'conversation_history_{learner.id}')

        return JsonResponse({'success': 'Chat ended successfully.'})

    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error("Error in end_conversation:", exc_info=True)
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_historical_chat_history(request):
    learner = request.user
    chat_id = request.GET.get('chat_id')
    
    if chat_id:
        try:
            chat = HistoricalChat.objects.get(learner=learner, chat_id=chat_id)
            chats = HistoricalChat.objects.filter(learner=learner).order_by('-chat_started_at')
            chat_data = []

            for chat in chats:
                history = HistoricalChatHistory.objects.filter(chat=chat).order_by('timestamp')
                chat_data.append({
                    'chat_id': chat.chat_id,
                    'chat_title': chat.chat_title,
                    'chat_started_at': chat.chat_started_at,
                    'chat_ended_at': chat.chat_ended_at,
                    'history': [
                        {'message': entry.message, 'response': entry.response, 'timestamp': entry.timestamp}
                        for entry in history
                    ]
                })
                return JsonResponse(chat_data, safe=False)
        except HistoricalChat.DoesNotExist:
            return JsonResponse({'error': 'Chat not found.'}, status=404)

    else:
        # Handle the case when chat_id is not provided
        return JsonResponse({'error': 'chat_id parameter is required.'}, status=400)
