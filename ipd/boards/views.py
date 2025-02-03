
# Create your views here.

from rest_framework import viewsets
from rest_framework.views import APIView
from .models import Board, Button,ButtonClick
from .serializers import BoardSerializer, ButtonSerializer
from datetime import datetime

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
class ButtonViewSet(viewsets.ModelViewSet):
    queryset = Button.objects.all()
    serializer_class = ButtonSerializer


# class DynamicBoardGeneration(APIView):

#     def get_time_keywords():
#         current_time=datetime.now().hour
#         if 6<current_time<12:
#             return "morning"
#         elif 12 <= current_time < 18:
#             return "afternoon"
#         elif 18 <= current_time < 22:
#             return "evening"
#         else:
#             return "night"
#     def generate_dynamic_words(button_label):
#         time_words=self.get_time_keywords()
#         dynamic_words=[f"{button_label}{keyword}" for keyword in time_words]
#         return dynamic_words
#     def 

