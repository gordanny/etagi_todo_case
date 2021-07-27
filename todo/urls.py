from django.urls import path
from . import views

app_name = 'todo'
urlpatterns = [
    path('get/', views.get_tasks),
    path('create/', views.create_task),
    path('edit/', views.edit_task),
]
