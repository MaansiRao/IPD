
from rest_framework import serializers
from .models import *

class ButtonSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Button
        fields = ['id', 'board','label', 'button_label', 'image','category','icon']

class BoardSerializer(serializers.ModelSerializer):
    buttons = ButtonSerializer(many=True, read_only=True)  
    class Meta:
        model = Board
        fields = ['id', 'name', 'language', 'created_at', 'updated_at', 'buttons', 'child']
        read_only_fields = ['parent'] 

class DefaultButtonSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = DefaultButton
        fields = ['id', 'board','label', 'button_label', 'image','category','icon']


class DefaultBoardSerializer(serializers.ModelSerializer):
    buttons = DefaultButtonSerializer(many=True, read_only=True)  
    class Meta:
        model = DefaultBoard
        fields = ['id', 'name', 'language', 'buttons']
        