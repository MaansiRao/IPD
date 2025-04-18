from django.shortcuts import render
from rest_framework.views import APIView
from django.conf import settings
from django.core.mail import send_mail
from datetime import datetime
from rest_framework.response import Response
from decouple import config
import json
import requests
from users.permissions import *

# Create your views here.
class Notification(APIView):
    permission_classes = [IsChild]

    def post(self, request):
        subject = 'Emergency Alert'
        message = f'Your child pressed emergency button at time {datetime.now().strftime("%H:%M:%S")}. Please contact them asap'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = ['kaumudi814@gmail.com', 'nehatendulkar3112@gmail.com', 'kulkarniprutha1@gmail.com', 'maansi.rao.201159@gmail.com']

        try:
            send_mail(subject, message, email_from, recipient_list)
            return Response({"status": "success", "message": "Email sent successfully."}, status=200)
        except Exception as e:
            return Response({"status": "fail", "message": str(e)}, status=500)
        

class Location(APIView):
    permission_classes = [IsChild]
    
    def get(self, request):
        try:
            ip_res = requests.get(config('GET_IP_ADDRESS_API'))
            ip_res.raise_for_status()  
            ip = json.loads(ip_res.text)
            if not ip["ip"]:
                raise ValueError("IP address not found")
            
            loc_res = requests.get(config('GET_LOCATION_API').format(IP_ADDRESS=ip["ip"]))
            loc_res.raise_for_status()
            location = json.loads(loc_res.text)
            
            return Response({"status": "success", "data": location})
        except Exception as e:
            return Response({"status": "fail", "message": str(e)}, status=500)
