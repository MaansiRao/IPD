
from rest_framework import serializers
from .models import Board, Button

class ButtonSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Button
        fields = ['id', 'label', 'button_label', 'image','category','icon']

class BoardSerializer(serializers.ModelSerializer):
    
    buttons = ButtonSerializer(many=True, read_only=True)  

    class Meta:
        model = Board
        fields = ['id', 'name', 'language', 'created_at', 'updated_at', 'buttons']