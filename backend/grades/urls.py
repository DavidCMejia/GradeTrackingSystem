from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from . import views

router = routers.DefaultRouter()
router.register(r'grades', views.GradeView, 'grades')
router.register(r'courses', views.CourseView, 'courses') 
router.register(r'students', views.StudentView, 'students')
router.register(r'professors', views.ProfessorView, 'professors')
router.register(r'schedules', views.ScheduleView, 'schedules')
router.register(r'users', views.UsersView, 'users')

urlpatterns = [
    path('api/', include(router.urls)),
    path('docs/', include_docs_urls(title='Grades Tracking API')),
    path('api/courses/by_professor/<int:professor_id>/', 
         views.CourseView.as_view({'get': 'list'}), 
         name='course-list-by-professor'),
    path('api/professors/by_email/<email>/', 
         views.ProfessorView.as_view({'get': 'list'}), 
         name='professor-list-by-email'),
     path('api/students/by_email/<email>/',
           views.StudentView.as_view({'get': 'list'}),
               name='student-list-by-email'),  
    path('api/users/by_email/<email>/',
           views.UsersView.as_view({'get': 'list'}),
               name='user-list-by-email'),
]
    