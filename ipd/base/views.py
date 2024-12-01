from django.shortcuts import render
from rest_framework.views import APIView
from django.conf import settings
from django.core.mail import send_mail
from datetime import datetime
from rest_framework.response import Response

# Create your views here.
class Notification(APIView):
    def post(self, request):
        subject = 'Emergency Alert'
        message = f'Your child pressed emergency button at time {datetime.now().strftime("%H:%M:%S")}. Please contact them asap'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = ['kaumudi814@gmail.com', 'nehatendulkar3112@gmail.com', 'kulkarniprutha1@gmail.com', 'maansi.rao.201159@gmail.com']

        try:
            send_mail(subject, message, email_from, recipient_list)
            return Response({"status": "success", "message": "Email sent successfully."}, status=200)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=500)