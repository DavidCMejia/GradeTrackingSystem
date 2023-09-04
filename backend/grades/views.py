from rest_framework import viewsets
from .serializer import GradesSerializer

# Create your views here.

class GradesView(viewsets.ModelViewSet):
    serializer_class = GradesSerializer
    queryset = GradesSerializer.Meta.model.objects.all()
