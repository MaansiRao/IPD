from django.urls import path, include
from .views import *

urlpatterns = [
    path('register/parent/', ParentRegistrationAPIView.as_view(), name='parent-register'),
    path('login/', LoginView.as_view(), name='login'),  # Login for both parent and child
    path('create_child/', CreateChild.as_view(), name='create_child'),
]