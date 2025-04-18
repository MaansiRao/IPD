# # users/serializers.py

# from rest_framework import serializers
# from .models import User
# from django.contrib.auth.password_validation import validate_password

# class ParentRegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, validators=[validate_password])

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'password', 'role']
#         extra_kwargs = {'role': {'default': 'parent'}}

#     def create(self, validated_data):
#         validated_data['role'] = 'parent'
#         user = User.objects.create_user(**validated_data)
#         return user

# class ChildRegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, validators=[validate_password])
#     # Remove parent field from here
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'password', 'age', 'preferred_language', 'role']

#     def create(self, validated_data):
#         validated_data['role'] = 'child'
#         # Link child to the parent (authenticated user)
#         user = User.objects.create_user(**validated_data)
#         user.parent = self.context['request'].user  # Link parent from the request user
#         user.save()
#         return user




from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'age', 'language', 'parent']
        extra_kwargs = {
            'parent': {'read_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
