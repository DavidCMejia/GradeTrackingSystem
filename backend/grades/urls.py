from django.urls import path, include
from rest_framework import routers
from grades import views

router = routers.DefaultRouter()
router.register(r'grades', views.GradesView, 'grades')

urlpatterns = [
    path('api/', include(router.urls)),
]
