from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import TaskSerializer
from .models import Task
from users.models import CustomUser

import datetime

@api_view(['GET'])
def get_tasks(request):
    queryset = Task.objects.order_by('-update_date')
    serializer = TaskSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_task(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def edit_task(request):
    serializer = TaskSerializer()
    return Response(serializer.data)
