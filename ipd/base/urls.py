from django.urls import path
from .views import *

urlpatterns = [
    path('emergency', Notification.as_view(), name='email_notification'),
    path('location', Location.as_view(), name='current_location')
]