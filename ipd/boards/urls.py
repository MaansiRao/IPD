from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BoardViewSet, ButtonViewSet


router = DefaultRouter()
router.register(r'boards', BoardViewSet)
router.register(r'buttons', ButtonViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
]