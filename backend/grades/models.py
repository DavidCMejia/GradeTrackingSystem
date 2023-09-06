from django.db import models
import uuid

#TODO Register y login

class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class Student(TimestampedModel):
    student_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True) #AGREGAR PK
    student_name = models.CharField(max_length=100, blank=True, null=True)
    identification_number = models.CharField(max_length=10, blank=True, null=True, unique=True)
    email = models.EmailField(blank=True, null=True, unique=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    courses_enrolled = models.ManyToManyField('Course', blank=True, null=True)
    class Meta:
        verbose_name = 'student'
        verbose_name_plural = 'students'

class Professor(TimestampedModel):
    professor_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    professor_name = models.CharField(max_length=100)
    identification_number = models.CharField(max_length=10, blank=True, null=True, unique=True)
    email= models.EmailField(blank=True, null=True, unique=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    class Meta:
        verbose_name = 'professor'
        verbose_name_plural = 'professors'
class Course(TimestampedModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    course_code = models.CharField(max_length=10, blank=True, null=True)
    course_name = models.CharField(max_length=100, blank=True, null=True)
    professor = models.ForeignKey('Professor', on_delete=models.SET_NULL, null=True, blank=True)
    students = models.ManyToManyField('Student', blank=True, null=True)
    class Meta:
        verbose_name = 'course'
        verbose_name_plural = 'courses'
        
class Grade(TimestampedModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, default=1)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, default=1)
    grade = models.IntegerField(default=1)
    class Meta:
        verbose_name = 'grade'
        verbose_name_plural = 'grades'

    def __str__(self):
        return self.title