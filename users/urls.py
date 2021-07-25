from django.urls import path, include

from . import views

app_name = 'users'
urlpatterns = [
    path('user/', views.current_user),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', views.logout, name='logout'),
]
