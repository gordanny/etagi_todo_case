from django.urls import path
from . import views

app_name = 'todo'
urlpatterns = [
    path('get/', views.TaskList.as_view()),
    path('get/<int:pk>', views.TaskDetail.as_view()),
    path('create/', views.create_task),
    path('edit/', views.edit_task),
]
