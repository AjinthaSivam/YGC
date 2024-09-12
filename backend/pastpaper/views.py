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
from .models import PastPaperChat
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

# Function to process text files and convert PDFs to text if needed
def process_text_file(file_name):
    try:
        file_path = os.path.join(input_directory, file_name)
        if not os.path.exists(file_path):
            pdf_path = file_path.replace('.txt', '.pdf')
            if os.path.exists(pdf_path):
                text = convert_pdf_to_text(pdf_path)
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(text)
            else:
                print(f"Error: PDF file {pdf_path} not found.")
                return ''
        else:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
        return text
    except Exception as e:
        print(f"Error processing file {file_name}: {e}")
        return ''

# Function to find relevant chunks based on the user query
def find_relevant_chunks(query, chunks_and_embeddings, index, top_k=5):
    try:
        if index is None:
            raise ValueError("Index is not initialized correctly.")
        
        query_embedding = get_embedding(query)
        _, I = index.search(np.array([query_embedding]).astype("float32"), top_k)
        
        # Filter chunks based on relevence
        relevent_chunks = [chunks_and_embeddings[i][0] for i in I[0]]
        
        # Implement additional filtering if needed based on query context
        filtered_chunks = filter_chunks_based_on_query(query, relevent_chunks)
        
        return filtered_chunks
        
    except Exception as e:
        print("An error occurred in find_relevant_chunks:", str(e))
        return []
    
def filter_chunks_based_on_query(query, chunks):
    test_keywords = {
        "Test 1": ["Test 1"],
        "Test 2": ["Test 2"],
        "Test 3": ["Test 3"],
    }
    
    for test, keywords in test_keywords.items():
        if any(keyword.lower() in query.lower() for keyword in keywords):
            return [chunk for chunk in chunks if any(keyword in chunk for keyword in keywords)]
        
    return chunks

# Function to handle the embedding and indexing process
def create_faiss_index(text):
    try:
        chunk_size = 4000  # Can increase the chunk size for better context
        dataset_chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

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

# from django.http import JsonResponse
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from django.views.decorators.csrf import csrf_exempt
# import json
# import os
# import openai
# from .models import PastPaperChat  # Ensure to import your model for saving chat history

# Initialize conversation history dictionary
conversation_history = {}

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def chat_view(request):
    try:
        data = json.loads(request.body)
        user_input = data.get('user_input', '')
        
        numberof_input_tokens = count_tokens(user_input)
        
        if numberof_input_tokens > max_input_length :
            return JsonResponse({
                'error': f"Input too long. Please limit your input to {max_input_length} characters."
            }, status=400)
        
        user_input = limit_input_length(user_input)
        selected_year = data.get('selected_year', '')
        learner = request.user

        # Initialize conversation history for the learner if it doesn't exist
        if learner.id not in conversation_history:
            conversation_history[learner.id] = []

        if not selected_year:
            return JsonResponse({'response': "Error: No year selected."}, status=400)

        # Process the text files and create the FAISS index
        all_texts = ''
        input_directory = 'pdfs'  # Replace with your directory path
        for file_name in os.listdir(input_directory):
            if file_name.endswith('.txt') and selected_year in file_name:
                file_text = process_text_file(file_name)
                if file_text:
                    all_texts += file_text
        
        if not all_texts:
            return JsonResponse({'response': "Error: Unable to load any text files."}, status=500)

        chunks_and_embeddings, index = create_faiss_index(all_texts)

        # Find relevant chunks from the dataset
        relevant_chunks = find_relevant_chunks(user_input, chunks_and_embeddings, index)
        context_text = ' '.join(relevant_chunks[:5]) if relevant_chunks else f"No relevant information found for the year {selected_year}"

        # Build the message history to provide context
        messages = [
            {"role": "system", "content": "You are an English Teaching Assistant for Grade 11 students."},
            {"role": "system", "content": f"This is a past paper from the year {selected_year}, covering various topics in English."},
            {"role": "system", "content": "Guide them step by step to reach the answer."},
            {"role": "system", "content": "Use emojis to make it engaging, but keep responses short."},
            {"role": "system", "content": "Guide the student on questions related to a specific test of this paper. Give the answers with explanation"},
        ]

        # Append previous chat history
        messages.extend(conversation_history[learner.id])

        # Add current user input to messages
        messages.append({"role": "user", "content": user_input})
        messages.append({"role": "assistant", "content": f"Reference Material: {context_text}"})

        # Use OpenAI API to get assistant's response
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0,
            max_tokens=200
        )

        assistant_response = response['choices'][0]['message']['content'].strip()
        usage = response['usage']
        input_tokens = usage['prompt_tokens']
        output_tokens = usage['completion_tokens']

        # Add highlights and emojis to the response
        assistant_response = format_response(assistant_response)

        # Validate the assistant's response
        if "random" in assistant_response or not assistant_response:
            assistant_response = "I'm sorry, I didn't understand that. Can you please clarify or ask another question?"
            
        assistant_response = format_response(assistant_response)

        # Save the chat interaction to the database
        PastPaperChat.objects.create(
            learner=learner,
            user_input=user_input,
            response=assistant_response,
            input_tokens = input_tokens,
            output_tokens = output_tokens
        )

        # Update conversation history
        conversation_history[learner.id].append({"role": "user", "content": user_input})
        conversation_history[learner.id].append({"role": "assistant", "content": assistant_response})

        return JsonResponse({'response': assistant_response}, safe=False)
    
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
