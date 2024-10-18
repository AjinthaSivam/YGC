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
        f"Generate 5 multiple-choice English grammar questions for Grade 11 Sri Lankan students. The category is '{category}', and the difficulty is '{difficulty}'. "
        f"Each question should test grammar, usage, or vocabulary suitable for intermediate learners. Provide exactly 4 answer options for each question, "
        f"and ensure that the correct answer is one of the provided options. "
        f"The correct answer must follow proper English grammar rules, and the explanation must accurately explain why the selected answer is correct. "
        f"Format the output as a JSON array where each object has the fields: "
        f"'question' (the question as a string), 'options' (an array of 4 strings, each representing an answer choice), 'answer' (the correct option as a string), "
        f"and 'explanation' (a clear and concise explanation of the correct answer). "
        f"Double-check the consistency between the correct answer and its explanation, ensuring no contradictions."
        
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
        
        try:
            questions = json.loads(response_text)
            # Ensure options are correctly formatted as lists of strings
            for question in questions:
                question['options'] = [option.strip() for option in question['options']]
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
    
    if learner.is_anonymous:
        return Response({"error": "User must be authenticated"}, status=status.HTTP_400_BAD_REQUEST)
    
    quiz = get_object_or_404(Quiz, id=quiz_id, learner=learner)
    
    # Get user answers from the request
    user_answers_data = request.data.get('answers', [])
    
    correct_answers = 0
    
    response_data = []
    
    for answer_data in user_answers_data:
        question_id = answer_data.get('question_id')
        user_answer = answer_data.get('user_answer')
        
        # Get the corresponding question
        question = get_object_or_404(Questions, id=question_id, quiz=quiz)
        
        # Update the question with the user's answer
        question.user_answer = user_answer
        question.save()
        
        # Compare user answer with the correct answer
        if user_answer.lower() == question.correct_answer.lower():
            correct_answers += 1
            
        response_data.append({
            'question': question.question,
            'user_answer': user_answer,
            'correct_answer': question.correct_answer,
            'explanation': question.explanation,
            'options': question.options
        })
        
    # Calculate the score
    total_questions = quiz.questions.count()
    score = (correct_answers / total_questions) * 100
    
    # Update the score with the score
    quiz.score = score
    quiz.save()
    
    quiz_serializer = QuizSerializer(quiz)
    
    return Response({
        'quiz': quiz_serializer.data,
        'questions': response_data,
        'message': 'Quiz submitted successfully'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])    
def get_quiz_history(request):
    learner = request.user
    
    if learner.is_anonymous:
        return Response({ "error": "User must be authenticated" }, status=status.HTTP_400_BAD_REQUEST)
    
    quizzes = Quiz.objects.filter(learner=learner, is_deleted=False).order_by('-id')
    
    serializer = QuizSerializer(quizzes, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz_questions(request, quiz_id):
    learner = request.user
    
    if learner.is_anonymous:
        return Response({ "error": "User must be authenticated" }, status=status.HTTP_400_BAD_REQUEST)
    
    quiz = get_object_or_404(Quiz, id=quiz_id, learner=learner)
    
    questions = quiz.questions.all()
    
    serializer = QuestionsSerializer(questions, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def soft_delete_quiz(request, quiz_id):
    try:
        quiz = get_object_or_404(Quiz, id=quiz_id, learner=request.user)
        quiz.is_deleted = True
        quiz.save()
        
        return Response({'success': 'Quiz marked as deleted successfully.', 'quiz_id': quiz.id}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
