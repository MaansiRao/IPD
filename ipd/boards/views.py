from rest_framework import viewsets
from django.utils.timezone import now, timedelta
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Board, Button,ButtonClick
from django.http import JsonResponse
from collections import defaultdict
from .serializers import BoardSerializer, ButtonSerializer
from datetime import datetime
from django.shortcuts import get_object_or_404
import random

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
class ButtonViewSet(viewsets.ModelViewSet):
    queryset = Button.objects.all()
    serializer_class = ButtonSerializer
class ParentRecommendation(APIView):
    def post(self,request):
        board=Board.objects.filter(name__exact="Weekly Dynamic Board").order_by('-created_at').first()
        #board=Board.objects.order_by('-created_at').first()
        if not board:
            return Response({"error": "Board not found"}, status=status.HTTP_404_NOT_FOUND)
        button=Button(board=board)
        serializer=ButtonSerializer(button,data=request.data,partial=True)
        if serializer.is_valid():

            serializer.save()
            return JsonResponse({"message":"button added sucessfully","button_id":button.id},status=201)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LogButtonClickView(APIView):
    def post(self, request, button_id):
        button = get_object_or_404(Button, id=button_id)
        ButtonClick.objects.create(button=button, clicked_at=now())

        return JsonResponse({
            "message": f"Button '{button.label}' clicked successfully",
            "button_id": button.id
        })


class DynamicBoardGeneration(APIView):

    def get_time_category(self,hour):
        
        if 6<hour<12:
            return "morning"
        elif 12 <= hour < 18:
            return "afternoon"
        elif 18 <= hour < 22:
            return "evening"
        else:
            return "night"
    
    # def log_button_click(button_id):
    #     from django.shortcuts import get_object_or_404
    #     button = get_object_or_404(Button, id=button_id)
    #     ButtonClick.objects.create(button=button)
    def post(self,request, button_id=None):
        one_week_ago=now()-timedelta(days=7)
        clicks = ButtonClick.objects.filter(clicked_at__gte=one_week_ago)
        

        time_category_buttons=defaultdict(list)
        for click in clicks:
            time_category=self.get_time_category(click.clicked_at.hour)
            time_category_buttons[time_category].append(click.button.id)

            button=click.button
            if not isinstance(button.category, list) or button.category is None:
                button.category = []

            if time_category not in button.category:
                button.category.append(time_category)
                button.save()
            
            

        if not clicks.exists():
            return JsonResponse({"message": "No button clicks recorded in the past week."}, status=400)
        new_board = Board.objects.create(
            name=f"Weekly Dynamic Board {now().strftime('%Y-%m-%d')}",
            language="English",
            description="Generated from last week's usage patterns."
        )
        added_buttons = set()
        for time_category, button_ids in time_category_buttons.items():
            most_frequent_buttons = set(button_ids)  
            for button_id in most_frequent_buttons:
                if button_id not in added_buttons:
                    button = get_object_or_404(Button, id=button_id)
                    button.board = new_board
                    button.save()
                    added_buttons.add(button_id)
        return JsonResponse({
            "message": f"New dynamic board '{new_board.name}' created",
            "board_id": new_board.id,
            "time_categories": {time: list(set(buttons)) for time, buttons in time_category_buttons.items()}
        })

    
    def get_dynamic_board(self):
        time_category = self.get_time_category(now().hour)
        board = Board.objects.filter(name__contains="Weekly Dynamic Board").order_by('-created_at').first()
        buttons = Button.objects.filter(board=board)
        
        print(f"Board: {board.name}, Buttons: {list(buttons.values('id', 'label', 'category'))}")

        if not board:
            return JsonResponse({"message": "No weekly dynamic board found yet. Use default board."}, status=404)

        
        buttons = [btn for btn in Button.objects.filter(board=board) if time_category in btn.category]

        return JsonResponse({
            "board_name": board.name,
            "time_of_day": time_category,
            "buttons": [button.label for button in buttons]
        })

    def get(self,request):
        
        return self.get_dynamic_board()
    



