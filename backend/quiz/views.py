from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import openai
from django.conf import settings
import json

class GenerateQuestionsView(APIView):
    def post(self, request):
        category = request.data.get('category', '')
        difficulty = request.data.get('difficulty', '')

        questions = self.generate_questions(category, difficulty)
        return Response({'questions': questions}, status=status.HTTP_200_OK)

    def generate_questions(self, category, difficulty):
        openai.api_key = settings.OPENAI_API_KEY
        prompt = (
            f"Generate 5 English MCQ questions with category '{category}' and difficulty '{difficulty}' "
            f"with 4 options each. Format the response as a JSON array of objects with fields 'question', "
            f"'options' (an array of 4 strings), and 'answer' (the correct option as a string)."
        )

        response = openai.Completion.create(
            engine="gpt-3.5-turbo-instruct",
            prompt=prompt,
            max_tokens=500,
            n=1,
            stop=None,
        )
        response_text = response.choices[0].text.strip()

        print("Raw response from OpenAI:", response_text)

        try:
            questions = json.loads(response_text)
            return questions

        except json.JSONDecodeError as e:
            print("Failed to parse response as JSON:", str(e))
            return []

