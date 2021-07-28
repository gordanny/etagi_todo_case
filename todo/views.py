from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, RetrieveAPIView

from .serializers import TaskSerializer
from .models import Task


index = never_cache(TemplateView.as_view(template_name='index.html'))


class TaskList(ListAPIView):
    queryset = Task.objects.order_by('-update_date')
    serializer_class = TaskSerializer


class TaskDetail(RetrieveAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


@api_view(['POST'])
def create_task(request):
    print(request.data)
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def edit_task(request):
    query = Task.objects.get(id=request.data['id'])
    
    serializer = TaskSerializer(instance=query, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)