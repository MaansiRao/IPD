
from django.db import models
from django.utils.timezone import now
from users.models import User

# Create your models here.


class DefaultBoard(models.Model):
    name = models.CharField(max_length=255)
    language = models.CharField(max_length=255,null=True)
    description = models.TextField(blank=True,null=True)
    # created_at = models.DateTimeField(auto_now_add=True) 
    # updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

class Board(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'parent'}, related_name='parent_boards')
    child = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'child'}, related_name='child_boards')
    language = models.CharField(max_length=255,null=True)
    description = models.TextField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name


class Button(models.Model):
    board=models.ForeignKey(Board,on_delete=models.CASCADE)
    label=models.CharField(max_length=300)
    button_label=models.CharField(max_length=50)
    image=models.ImageField(upload_to='board_buttons/images/', blank=True, null=True)
    category=models.JSONField(default=list,null=True)
    icon=models.CharField(max_length=100,null=True)

    def __str__(self):
        return self.label
    

class DefaultButton(models.Model):
    board=models.ForeignKey(DefaultBoard,on_delete=models.CASCADE)
    label=models.CharField(max_length=300)
    button_label=models.CharField(max_length=50)
    image=models.ImageField(upload_to='board_buttons/images/', blank=True, null=True)
    category=models.JSONField(default=list,null=True)
    icon=models.CharField(max_length=100,null=True)
    def __str__(self):
        return self.label
    
class ButtonClick(models.Model):
    button=models.ForeignKey(Button,on_delete=models.CASCADE,null=True,blank=True)
    default_button=models.ForeignKey(DefaultButton,on_delete=models.CASCADE,null=True,blank=True)
    clicked_at=models.DateTimeField(default=now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.button.label} clicked at {self.clicked_at}"
