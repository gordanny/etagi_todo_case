from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = (
            'id',
            'title',
            'description',
            'expiration_date',
            'creation_date',
            'update_date',
            'priority',
            'status',
            'creator',
            'responsible',
        )
