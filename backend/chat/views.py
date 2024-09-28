from django.http import JsonResponse
import os
import PyPDF2
import openai
import numpy as np
import faiss
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import Chat, ChatHistory
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
import re
import tiktoken
from learner.utils import check_and_update_quota
from learner.models import LearnerQuota


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

# Define the conversation state variables
conversation_history = {}
selected_year = {}

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_view(request):
    try:
        data = json.loads(request.body)
        user_input = data.get('user_input', '')
        bot_type = 'general_bot'
        
        numberof_input_tokens = count_tokens(user_input)
        
        if numberof_input_tokens > max_input_length :
            return JsonResponse({
                'error': f"Input too long. Please limit your input to {max_input_length} characters."
            }, status=400)    
        
        user_input = limit_input_length(user_input)
        new_chat = data.get('new_chat', False)
        chat_id = data.get('chat_id')
        learner = request.user
        
        # Handle free and premium users
        can_chat, error_message, remaining_quota = check_and_update_quota(learner=learner, bot_type=bot_type)
        if not can_chat:
            return JsonResponse({'error': error_message, 'remaining_quota': remaining_quota}, status=403)

        if new_chat or chat_id is None:
            # Start a new chat session
            conversation_history[learner.id] = []  # New chat, no history passed
            new_chat = Chat.objects.create(
                learner=learner,
                chat_title="New Chat",
                chat_started_at=timezone.now()
            )
            chat_id = new_chat.chat_id
        else:
            # Retrieve existing chat session
            chat_history = conversation_history.get(learner.id, [])

            # Truncate conversation history to fit within token limits
            chat_history = truncate_conversation(chat_history, max_tokens=3000)

        # Build the message history to provide context
        messages = [
            {"role": "system", "content": (
                "You are an assistant for grade 11 students learning English. "
                "Ask questions to gauge their understanding and guide them with hints. Provide full answers only when necessary. "
                "Use clear language and emojis. If the user goes off-topic, gently guide them back."
            )},
        ]
        # Only include truncated history if it's not a new chat
        if not new_chat:
            for entry in chat_history:
                messages.append({"role": entry['role'], "content": entry['content']})

        # Add current user input to the messages
        messages.append({"role": "user", "content": user_input})
        # Use OpenAI API to get assistant's response
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=150  # Set a limit for the response
        )

        assistant_response = response['choices'][0]['message']['content'].strip()
        usage = response['usage']
        input_tokens = usage['prompt_tokens']
        output_tokens = usage['completion_tokens']

        # Add highlights and emojis to the response
        assistant_response = format_response(assistant_response)

        # Validate the assistant's response
        if not assistant_response or "random" in assistant_response:
            assistant_response = "⚠️ I'm sorry, I didn't understand that. Can you please clarify or ask another question? 🤔"

        conversation_history[learner.id].append({"role": "user", "content": user_input})
        conversation_history[learner.id].append({"role": "assistant", "content": assistant_response})

        # Save chat history to database
        ChatHistory.objects.create(
            chat_id=chat_id,
            message=user_input,
            response=assistant_response,
            input_tokens = input_tokens,
            output_tokens = output_tokens
        )
        
        return JsonResponse({
            'response': assistant_response, 
            'chat_id': chat_id, 
            'remaining_quota': remaining_quota
        }, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def format_response(response):
    # Bold text
    response = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', response)
    
    # Bullet points
    response = re.sub(r'\n- (.*?)\n', r'<li>\1</li>\n', response)
    response = re.sub(r'- (.*?)\n', r'<li>\1</li>\n', response)
    response = re.sub(r'<li>(.*?)</li>\n<li>', r'</ul>\n<li>', response, flags=re.DOTALL)
    response = re.sub(r'<li>(.*?)</li>', r'</ul>\n<ul>\n<li>\1</li>', response, flags=re.DOTALL)
    response = "<ul>" + response + "</ul>"

    # Numbered lists
    response = re.sub(r'\n\d+\. (.*?)\n', r'<li>\1</li>\n', response)
    response = re.sub(r'\d+\. (.*?)\n', r'<li>\1</li>\n', response)
    response = re.sub(r'<li>(.*?)</li>\n<li>', r'</ol>\n<li>', response, flags=re.DOTALL)
    response = re.sub(r'<li>(.*?)</li>', r'</ol>\n<ol>\n<li>\1</li>', response, flags=re.DOTALL)
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
    
    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def end_conversation(request):
    try:
        learner = request.user

        # Clear conversation state for the learner
        selected_year.pop(learner.id, None)
        conversation_history.pop(learner.id, None)

        return JsonResponse({'success': 'Chat ended successfully.'})

    except Exception as e:
        print("Error in end_conversation:", str(e))
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request):
    learner = request.user
    chat_id = request.GET.get('chat_id')  # Retrieve chat_id from query parameters

    if chat_id:
        try:
            # Fetch the specific chat and its history
            chat = Chat.objects.get(learner=learner, chat_id=chat_id)
            history = ChatHistory.objects.filter(chat=chat).order_by('timestamp')
            
            chat_data = {
                'chat_id': chat.chat_id,
                'chat_title': chat.chat_title,
                'chat_started_at': chat.chat_started_at,
                'chat_ended_at': chat.chat_ended_at,
                'history': [
                    {'message': entry.message, 'response': entry.response, 'timestamp': entry.timestamp}
                    for entry in history
                ]
            }
            
            return JsonResponse(chat_data, safe=False)
        
        except Chat.DoesNotExist:
            return JsonResponse({'error': 'Chat not found.'}, status=404)
    else:
        # Handle the case when chat_id is not provided
        return JsonResponse({'error': 'chat_id parameter is required.'}, status=400)