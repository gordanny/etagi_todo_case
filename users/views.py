from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework_jwt.views import JSONWebTokenAPIView

from .serializers import CustomJSONWebTokenSerializer, UserSerializer
from .models import CustomUser


class CustomObtainJSONWebToken(JSONWebTokenAPIView):
    serializer_class = CustomJSONWebTokenSerializer


custom_obtain_jwt_token = CustomObtainJSONWebToken.as_view()


@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
def get_responsible(request):
    queryset = CustomUser.objects.filter(chief=request.user.id)
    serializer = UserSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_all_users(request):
    queryset = CustomUser.objects.all()
    serializer = UserSerializer(queryset, many=True)
    return Response(serializer.data)



