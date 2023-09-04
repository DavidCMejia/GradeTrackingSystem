from rest_framework import viewsets
from .serializer import GradesSerializer
from .models import Grade

# Create your views here.

class GradesView(viewsets.ModelViewSet):
    serializer_class = GradesSerializer
    queryset = Grade.objects.all()
