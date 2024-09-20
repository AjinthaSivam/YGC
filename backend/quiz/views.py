from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import QuizSerializer, QuestionsSerializer
from rest_framework.permissions import IsAuthenticated
import openai
from django.conf import settings
import json
from .models import Quiz, Questions
from django.shortcuts import get_object_or_404


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_quiz(request):
    category = request.data.get('category', '')
    difficulty = request.data.get('difficulty', '')
    learner = request.user
    
    if learner.is_anonymous:
        return Response({"error": "User must be authenticated"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate questions using OpenAI API
    openai.api_key = settings.OPENAI_API_KEY
    prompt = (
        f"Generate 5 English MCQ questions with category '{category}' and difficulty '{difficulty}' "
        f"with 4 options each. Format the response as a JSON array of objects with fields 'question', "
        f"'options' (an array of 4 strings), 'answer' (the correct option as a string), and 'explanation' (as a string)"
        
    )

    try:
        response = openai.Completion.create(
            engine="gpt-3.5-turbo-instruct",
            prompt=prompt,
            max_tokens=800,
            n=1,
            stop=None,
        )

        input_tokens = response['usage']['prompt_tokens']
        output_tokens = response['usage']['completion_tokens']
        response_text = response.choices[0].text.strip()
        
        print("response_text: ", response_text)
        
        # validate parse json
        try:
            questions = json.loads(response_text)
            print(questions)
        except json.JSONDecodeError:
            return Response({"error": "Failed to parse questions. Invalid JSON format."}, status=status.HTTP_400_BAD_REQUEST)
        
    except (json.JSONDecodeError, KeyError) as e:
        return Response({"error": "Failed to generate or parse questions."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Save the quiz data
    quiz_data = {
        'learner': learner.id,
        'title': f"{category}-{difficulty}",
        'input_tokens': input_tokens,
        'output_tokens': output_tokens
    }
    quiz_serializer = QuizSerializer(data=quiz_data)
    
    if quiz_serializer.is_valid():
        quiz = quiz_serializer.save()
        
        questions_data = []
        
        # Save each question
        for index, question_data in enumerate(questions):
            print(f"Processing Question {index + 1}: {question_data}")
            question_serializer = QuestionsSerializer(data={
                'quiz': quiz.id,
                'question': question_data['question'],
                'options': question_data['options'],
                'correct_answer': question_data['answer'],
                'explanation': question_data['explanation']
            })
            
            if question_serializer.is_valid():
                question_serializer.save()
                # Append the serialized question data
                questions_data.append(question_serializer.data)
            else:
                quiz.delete()  # Rollback the quiz if any question is invalid
                return Response(question_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        response_data = {
            'quiz': quiz_serializer.data,
            'questions': questions_data
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    else:
        return Response(quiz_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz(request, quiz_id):
    learner = request.user
    quiz = get_object_or_404(Quiz, id=quiz_id, learner=learner)
    
    # Get user answers from the request
    user_answers_data = request.data.get('answers', [])
    
    correct_answers = 0
    
    for answer_data in user_answers_data:
        question_id = answer_data.get('question_id')
        user_answer = answer_data.get('user_answer')
        
        # Get the corresponding question
        question = get_object_or_404(Questions, id=question_id, quiz=quiz)
        
        # Update the question with the user's answer
        question.user_answer = user_answer
        question.save()
        
        # Compare user answer with the correct answer
        if user_answer == question.correct_answer:
            correct_answers += 1
        
    # Calculate the score
    total_questions = quiz.quiz.count()
    score = (correct_answers / total_questions) * 100
    
    # Update the score with the score
    quiz.score = score
    quiz.save()
    
    quiz_serializer = QuizSerializer(quiz)
    
    return Response({
        'quiz': quiz_serializer.data,
        'message': 'Quiz submitted successfully'
    }, status=status.HTTP_200_OK)