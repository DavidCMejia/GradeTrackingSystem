from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from .views import views

router = routers.DefaultRouter()
router.register(r'grades', views.GradeView, 'grades')
router.register(r'courses', views.CourseView, 'courses') 
router.register(r'students', views.StudentView, 'students')
router.register(r'professors', views.ProfessorView, 'professors')

urlpatterns = [
    path('api/', include(router.urls)),
    path('docs/', include_docs_urls(title='Grades Tracking API')),
    path('api/courses/by_professor/<int:professor_id>/', 
         views.CourseView.as_view({'get': 'list'}), 
         name='course-list-by-professor'),
]
    