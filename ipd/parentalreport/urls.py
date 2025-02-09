from django.urls import path
from .views import *

urlpatterns = [
    path('parental-report', ParentalReport.as_view(), name='parental_report'),
    path('emotion-tracking-report', EmotionTrackingReport.as_view(), name='emotion_tracking_report'),
    path('unique-words-report', UniqueWordsReport.as_view(), name='unique_words_report'),
]