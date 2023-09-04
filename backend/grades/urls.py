from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'grades', views.GradeView, 'grades')
router.register(r'courses', views.CourseView, 'courses') 
router.register(r'students', views.StudentView, 'students')

urlpatterns = [
    path('api/', include(router.urls)),
]
