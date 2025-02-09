
from django.db import models
from django.utils.timezone import now

# Create your models here.

class Board(models.Model):
    name=models.CharField(max_length=255)
    #creator==models.ForeignKey(User,on_delete=models.CASCADE,related_name='boards')
    language=models.CharField(max_length=255)
    #description=models.TextField(blank=True,null=True)
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
    
class ButtonClick(models.Model):
    button=models.ForeignKey(Button,on_delete=models.CASCADE)
    clicked_at=models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.button.label} clicked at {self.clicked_at}"