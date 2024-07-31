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

# Set your OpenAI API key
openai.api_key = settings.OPENAI_API_KEY

# Directory paths
input_directory = 'pdfs'  # Directory where your PDFs are stored

# Ensure the directory exists
if not os.path.exists(input_directory):
    os.makedirs(input_directory)

# Function to convert PDF to text using PyPDF2
def convert_pdf_to_text(file_path):
    try:
        text = ''
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num, page in enumerate(reader.pages):
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text
                    else:
                        print(f"No text found on page {page_num} of {file_path}")
                except Exception as e:
                    print(f"Error extracting text from page {page_num} of {file_path}: {e}")
        return text
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return ''

# Function to get embeddings
def get_embedding(text):
    return openai.Embedding.create(input=text, model="text-embedding-ada-002")['data'][0]['embedding']

# Function to load and process a specific year's text file
def process_yearly_text(year):
    try:
        file_path = os.path.join(input_directory, f'{year}.txt')
        if not os.path.exists(file_path):
            pdf_path = os.path.join(input_directory, f'{year}.pdf')
            if os.path.exists(pdf_path):
                text = convert_pdf_to_text(pdf_path)
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(text)
            else:
                print(f"Error: PDF file for year {year} not found.")
                return ''
        else:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
        return text
    except Exception as e:
        print(f"Error loading {year}.txt: {e}")
        return ''

# Function to find the most relevant chunks based on the user query
def find_relevant_chunks(query, chunks_and_embeddings, index, top_k=5):
    try:
        if index is None:
            raise ValueError("Index is not initialized correctly.")
        
        query_embedding = get_embedding(query)
        _, I = index.search(np.array([query_embedding]).astype("float32"), top_k)
        return [chunks_and_embeddings[i][0] for i in I[0]]
    
    except Exception as e:
        print("An error occurred in find_relevant_chunks:", str(e))
        return []

# Function to handle the embedding and indexing process
def create_faiss_index(year_text):
    try:
        chunk_size = 4000  # Can increase the chunk size for better context
        dataset_chunks = [year_text[i:i + chunk_size] for i in range(0, len(year_text), chunk_size)]

        # Get embeddings for each chunk
        embeddings = [get_embedding(chunk) for chunk in dataset_chunks]

        # Convert embeddings to a numpy array
        embeddings_np = np.array(embeddings).astype("float32")

        # Create a FAISS index
        index = faiss.IndexFlatL2(embeddings_np.shape[1])
        index.add(embeddings_np)

        # Save the chunks and their embeddings
        chunks_and_embeddings = list(zip(dataset_chunks, embeddings))

        return chunks_and_embeddings, index
    
    except Exception as e:
        print("Error in create_faiss_index:", str(e))
        return [], None

# Define the conversation state variables
conversation_history = {}
selected_year = {}

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def chat_view(request):
#     try:
#         data = json.loads(request.body)
#         user_input = data.get('user_input', '')
#         new_chat = data.get('new_chat', False)
#         chat_id = data.get('chat_id')
#         learner = request.user

#         if new_chat or chat_id is None:
#             # Start a new chat session
#             selected_year[learner.id] = None
#             conversation_history[learner.id] = []

#             # Create a new chat session in the Chat table
#             new_chat = Chat.objects.create(
#                 learner=learner,
#                 chat_title="New Chat",
#                 chat_started_at=timezone.now()
#             )

#             chat_id = new_chat.chat_id

#             prompt = "Welcome! Please select the year of the past paper you want to study."
#             return JsonResponse({'response': prompt, 'chat_id': chat_id}, safe=False)
        
#         if selected_year.get(learner.id) is None:
#             # User selects the year of the past paper
#             selected_year[learner.id] = user_input
#             conversation_history[learner.id].append({"role": "user", "content": user_input})
#             prompt = f"You have selected the year {user_input}. How can I help you with this paper?"
#             return JsonResponse({'response': prompt, 'chat_id': chat_id}, safe=False)
        
#         # Continue existing chat session
#         chat_year = selected_year[learner.id]
#         chat_history = conversation_history.get(learner.id, [])

#         # Process the selected year's text
#         year_text = process_yearly_text(chat_year)
#         if not year_text:
#             return JsonResponse({'response': f"Error: Unable to load text for {chat_year}. Please try again later."}, status=500)

#         chunks_and_embeddings, index = create_faiss_index(year_text)

#         # Find relevant chunks from the dataset
#         relevant_chunks = find_relevant_chunks(user_input, chunks_and_embeddings, index)
#         if relevant_chunks:
#             context_text = ' '.join(relevant_chunks[:5])
#         else:
#             context_text = "No relevant information found in the provided reference material."

#         # Build the message history to provide context
#         messages = [
#             {"role": "system", "content": f"You are an English Teaching Assistant. Guide students through questions by first offering options and checking their understanding of the basics before giving the answer. If they answer incorrectly, explain the concept before proceeding. Use very simple English. Don't use hard words. You may give options to select for their ease."},
#             {"role": "system", "content": f"You selected the {chat_year} past paper."},
#             {"role": "system", "content": "This paper covers various topics in English."},
#         ]
#         for entry in chat_history:
#             messages.append({"role": entry['role'], "content": entry['content']})
#         messages.append({"role": "user", "content": user_input})
#         messages.append({"role": "assistant", "content": f"Reference Material: {context_text}"})

#         # Use OpenAI API to get assistant's response
#         response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",
#             messages=messages
#         )

#         assistant_response = response['choices'][0]['message']['content'].strip()

#         # Validate the assistant's response
#         if "random" in assistant_response or not assistant_response:
#             assistant_response = "I'm sorry, I didn't understand that. Can you please clarify or ask another question?"

#         conversation_history[learner.id].append({"role": "assistant", "content": assistant_response})

#         # Save chat history to database
#         ChatHistory.objects.create(
#             chat_id=chat_id,
#             message=user_input,
#             response=assistant_response
#         )

#         return JsonResponse({'response': assistant_response, 'chat_id': chat_id}, safe=False)
    
#     except Exception as e:
#         print("Error in chat_view:", str(e))
#         return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_view(request):
    try:
        data = json.loads(request.body)
        user_input = data.get('user_input', '')
        new_chat = data.get('new_chat', False)
        chat_id = data.get('chat_id')
        learner = request.user

        if new_chat or chat_id is None:
            # Start a new chat session
            conversation_history[learner.id] = []

            # Create a new chat session in the Chat table
            new_chat = Chat.objects.create(
                learner=learner,
                chat_title="New Chat",
                chat_started_at=timezone.now()
            )

            chat_id = new_chat.chat_id

        # Continue existing chat session
        chat_history = conversation_history.get(learner.id, [])

        # Build the message history to provide context
        messages = [
            {"role": "system", "content": "You are an Grade 11 English Grammar Tutor. Guide students through grammar questions by offering options and checking their understanding of the basics before giving the answer. If they answer incorrectly, explain the concept before proceeding. Use simple English, ask funny questions and include emojis to make the responses engaging."},
        ]
        for entry in chat_history:
            messages.append({"role": entry['role'], "content": entry['content']})
        messages.append({"role": "user", "content": user_input})

        # Use OpenAI API to get assistant's response
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        assistant_response = response['choices'][0]['message']['content'].strip()

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
            response=assistant_response
        )

        return JsonResponse({'response': assistant_response, 'chat_id': chat_id}, safe=False)

    except Exception as e:
        print("Error in chat_view:", str(e))
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
    chats = Chat.objects.filter(learner=learner).order_by('-chat_started_at')
    chat_data = []

    for chat in chats:
        history = ChatHistory.objects.filter(chat=chat).order_by('timestamp')
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