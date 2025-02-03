from django.urls import path
from .views import *

urlpatterns = [
    path('parental-report', ParentalReport.as_view(), name='parental_report'),
]