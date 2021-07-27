from django.urls import path

from . import views

app_name = 'users'
urlpatterns = [
    path('current/', views.current_user),
    path('get_all/', views.get_all_users),
    path('responsible/', views.get_responsible),
]
