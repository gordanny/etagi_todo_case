from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import resolve_url

from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework_jwt.views import JSONWebTokenAPIView

from .serializers import CustomJSONWebTokenSerializer, UserSerializer, UserSerializerWithToken
from .forms import CustomAuthenticationForm


class CustomObtainJSONWebToken(JSONWebTokenAPIView):
    serializer_class = CustomJSONWebTokenSerializer


custom_obtain_jwt_token = CustomObtainJSONWebToken.as_view()


@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class CustomLoginView(LoginView):
    form_class = CustomAuthenticationForm
    template_name = 'todo/login.html'
    redirect_authenticated_user = True

    def get_success_url(self):
        return resolve_url('/')


def logout(request):
    login_url = resolve_url('users:login')
    return LogoutView.as_view(next_page=login_url)(request)



