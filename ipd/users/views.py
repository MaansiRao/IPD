from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from .permissions import *

class ParentRegistrationAPIView(APIView):
    def post(self, request):
        # Deserialize the data
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid():
            # Add the 'parent' role before saving
            serializer.save(role='parent')
            return Response({
                "message": "Parent registered successfully",
                "user": serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateChild(APIView):
    permission_classes = [IsParent]

    def post(self, request):
        if request.user.role != 'parent':
            return Response({"error": "Only parents can create children."}, status=status.HTTP_403_FORBIDDEN)

        # Ensure that the parent is the one creating the child
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(role='child', parent=request.user)  # Set the parent for the child
            return Response({
                "message": "Child created successfully",
                "child": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # User is authenticated, generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return Response({
                "message": "Login successful",
                "access_token": str(access_token),
                "refresh_token": str(refresh)
            }, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
