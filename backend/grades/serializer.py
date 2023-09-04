from rest_framework import serializers
from .models import Grade

class GradesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'