from rest_framework import viewsets, filters
from .serializer import GradeSerializer, StudentSerializer, CourseSerializer, ProfessorSerializer, ScheduleSerializer
from .models import Grade, Student, Course, Professor, Schedule

class GradeView(viewsets.ModelViewSet):
    serializer_class = GradeSerializer
    queryset = Grade.objects.all()

class StudentView(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()

    def get_queryset(self):
        email = self.kwargs.get('email')
        if email:
            return Student.objects.filter(email=email)
        return Student.objects.all()

class CourseView(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['professor']

    def get_queryset(self):
        professor_id = self.kwargs.get('professor_id')
        if professor_id:
            return Course.objects.filter(professor=professor_id)
        return Course.objects.all()

class ProfessorView(viewsets.ModelViewSet):
    serializer_class = ProfessorSerializer
    queryset = Professor.objects.all()

    def get_queryset(self):
        email = self.kwargs.get('email')
        if email:
            return Professor.objects.filter(email=email)
        return Professor.objects.all()
    
class ScheduleView(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    queryset = Schedule.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['course']

    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        if course_id:
            return Schedule.objects.filter(course=course_id)
        return Schedule.objects.all()