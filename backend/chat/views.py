from django.http import JsonResponse
import openai
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
import logging
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

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
        
        print(f"Received data: learner= {learner}, user_input= {user_input}, new_chat= {new_chat}, chat_id= {chat_id}")
        
        # Handle free and premium users
        can_chat, error_message, remaining_quota = check_and_update_quota(learner=learner, bot_type=bot_type)
        if not can_chat:
            return JsonResponse({'error': error_message, 'remaining_quota': remaining_quota}, status=403)

        if new_chat or chat_id is None:
            # Create a new chat
            new_chat = Chat.objects.create(
                learner=learner,
                chat_title=user_input[:30] + "..." if len(user_input) > 35 else user_input,
                chat_started_at=timezone.now()
            )
            chat_id = new_chat.chat_id
            conversation_history[learner.id] = []
        else:
            try:
                # Retrieve existing chat session
                chat = Chat.objects.get(chat_id=chat_id, learner=learner)
                print(f"Retrieved chat: {chat}")
                chat_history = ChatHistory.objects.filter(chat=chat).order_by('timestamp')
                
                print(f"Retrieved chat history: {len(chat_history)}")
                conversation_history[learner.id] = []
                for entry in chat_history:
                    logger.debug(f"Processing chat history entry: message={entry.message}, response={entry.response}")
                    conversation_history[learner.id].append({"role": "user", "content": entry.message})
                    conversation_history[learner.id].append({"role": "assistant", "content": entry.response})
            except Chat.DoesNotExist:
                return JsonResponse({'error': 'Chat not found.'}, status=404)


        # Truncate conversation history to fit within token limits
        conversation_history[learner.id] = truncate_conversation(conversation_history[learner.id], max_tokens=3000)

        # Build the message history to provide context
        messages = [
            {"role": "system", "content": (
                "You are an AI-powered English tutor designed to help G.C.E. O/L students in Sri Lanka improve their grammar and conversational English. Your tasks include:\n\n"
                "1. Grammar Assistance:\n"
                "   - Explain grammar concepts step-by-step, breaking down each rule into smaller, manageable parts.\n"
                "   - Provide examples for practice and guide students to correct their errors without directly giving answers.\n"
                # "   - Before providing a response, please review the user's prompt or chat for big mistakes and present a Grammarly-corrected version. Indicate the correction with: 'Your sentence has a small mistake or can be improved like this: [corrected version].' Omit corrections for minor errors related to article usage and sentence structure."
                "2. Conversational Skills:\n"
                "   - Engage in real-world dialogues to help students practice spoken English and build confidence.\n"
                "   - Offer feedback on sentence structure, vocabulary, and pronunciation, breaking down suggestions into smaller steps for clarity.\n\n"
                "3. Interactive Learning:\n"
                "   - Include quizzes, 'find the odd one out,' and fill-in-the-blank exercises to make learning engaging.\n"
                "   - Award points for correct answers and track progress on a leaderboard to encourage improvement.\n\n"
                "4. Self-Study Support:\n"
                "   - Be available anytime for questions on grammar, vocabulary, comprehension, and conversation practice.\n"
                "   - Offer personalized guidance, allowing students to revisit challenging topics and break down complex concepts into smaller leads for easier understanding.\n\n"
                "Your goal is to help students build strong foundations in both written and spoken English, preparing them for exams and enhancing their communication skills.\n\n"
                "Remember to:\n"
                "- Use simple, clear language suitable for O/L students.\n"
                "- Provide specific, actionable feedback.\n"
                "- Encourage and motivate students throughout their learning journey.\n"
                "- Adapt your teaching style to each student's needs and proficiency level.\n"
                "- Use examples and scenarios relevant to Sri Lankan culture and daily life.\n\n"
                "- Include appropriate emojis in your responses to make them more engaging and friendly.\n\n"
                "Always maintain a friendly, patient, and supportive tone in your interactions."
            )},
        ]
        # Only include truncated history if it's not a new chat
        if not new_chat:
            for entry in chat_history:
                messages.append({"role": "user", "content": entry.message})
                messages.append({"role": "assistant", "content": entry.response})
                
        # Include truncated history
        messages.extend(conversation_history[learner.id])

        # Add current user input to the messages
        messages.append({"role": "user", "content": user_input})
        # Use OpenAI API to get assistant's response
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=messages,
            # max_tokens=150  # Set a limit for the response
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
    # Convert Markdown headers to HTML
    response = re.sub(r'^###\s+(.*?)$', r'<h3>\1</h3>', response, flags=re.MULTILINE)
    response = re.sub(r'^##\s+(.*?)$', r'<h2>\1</h2>', response, flags=re.MULTILINE)
    response = re.sub(r'^#\s+(.*?)$', r'<h1>\1</h1>', response, flags=re.MULTILINE)

    # Bold text
    response = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', response)
    
    # Bullet points
    response = re.sub(r'\n- (.*?)(?=\n|$)', r'<li>\1</li>', response)
    response = re.sub(r'<li>(.*?)</li>(?=<li>)', r'</ul>\n<li>\1</li>', response)
    response = re.sub(r'<li>(.*?)</li>', r'<ul>\n<li>\1</li></ul>', response)

    # Numbered lists
    # response = re.sub(r'\n\d+\. (.*?)(?=\n|$)', r'<li>\1</li>', response)
    # response = re.sub(r'<li>(.*?)</li>(?=<li>)', r'</ol>\n<li>\1</li>', response, flags=re.DOTALL)
    # response = re.sub(r'<li>(.*?)</li>', r'<ol>\n<li>\1</li></ol>', response, flags=re.DOTALL)
    
    # Remove extra spaces and newlines
    response = re.sub(r'\s*<li>', '<li>', response)
    response = re.sub(r'</li>\s*', '</li>', response)
    response = re.sub(r'\s*</?[uo]l>\s*', lambda m: m.group().strip(), response)
    # response = re.sub(r'\n+', '\n', response).strip()
    
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
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_sessions(request):
    learner = request.user
    
    chats = Chat.objects.filter(learner=learner, is_deleted=False).order_by('-last_message_at')[:10]
    
    chat_sessions = []
    for chat in chats:
        chat_history = ChatHistory.objects.filter(chat=chat).order_by('timestamp')
        
        conversation = [
            {
                'message': entry.message,
                'response': entry.response,
                'timestamp': entry.timestamp.isoformat()
            }
            for entry in chat_history
        ]
        
        chat_sessions.append({
            'chat_id': chat.chat_id,
            'chat_title': chat.chat_title,
            'chat_started_at': chat.chat_started_at.isoformat(),
            'chat_ended_at': chat.chat_ended_at.isoformat() if chat.chat_ended_at else None,
            'conversation': conversation
        })
        
    return JsonResponse(chat_sessions, safe=False)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def rename_chat_session(request, chat_id):
    try:
        chat = get_object_or_404(Chat, chat_id=chat_id, learner=request.user)
        new_title = request.data.get('new_title')
        
        if not new_title:
            return JsonResponse({'error': 'New title is required.'}, status=400)
        
        chat.chat_title = new_title
        chat.save()
        
        return JsonResponse({'success': 'Chat session renamed successfully.'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_chat_session(request, chat_id):
    try:
        chat = get_object_or_404(Chat, chat_id=chat_id, learner=request.user)
        chat.delete()
        
        return JsonResponse({'success': 'Chat session deleted successfully.'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def soft_delete_chat_session(request, chat_id):
    try:
        chat = get_object_or_404(Chat, chat_id=chat_id, learner=request.user)
        chat.is_deleted = True
        chat.save()
        
        return JsonResponse({'success': 'Chat session marked as deleted successfully.'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
