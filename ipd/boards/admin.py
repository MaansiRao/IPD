

from django.contrib import admin
from .models import Board, Button

class ButtonAdmin(admin.ModelAdmin):
    list_display = ('id', 'label', 'button_label', 'image','icon') 
    # search_fields = ('label', 'button_label') 
    # list_filter = ('label',) 

class BoardAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',  'language', 'created_at', 'updated_at')  
    # search_fields = ('name', 'creator', 'language')  
    # list_filter = ('creator', 'language')  
    # inlines = [ButtonAdmin]  

admin.site.register(Board, BoardAdmin)
admin.site.register(Button, ButtonAdmin)



