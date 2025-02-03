from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BoardViewSet, ButtonViewSet,LogButtonClickView,DynamicBoardGeneration


router = DefaultRouter()
router.register(r'boards', BoardViewSet)
router.register(r'buttons', ButtonViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    path('buttonclick/<int:button_id>/click',LogButtonClickView.as_view(), name='log_button_click'),  #add this in fe whenever a button is beoin clicked
    path('generate-weekly-board/', DynamicBoardGeneration.as_view(), name='generate_weekly_board'), #this gives weekly board ka creation
    path('current-dynamic/',DynamicBoardGeneration.as_view(),name='current_board_holder') #current board which will be needed

]