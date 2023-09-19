from django.db import models
import uuid

class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True
class MainInfoModel(models.Model):    
    name = models.CharField(max_length=100, blank=True, null=True)
    identification_number = models.CharField(max_length=10, blank=True, null=True, unique=True)
    role = models.CharField(max_length=10, blank=True, null=True)
    email = models.EmailField(blank=True, null=True, unique=True)
    class Meta:
        abstract = True

class Student(TimestampedModel, MainInfoModel):
    student_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    courses_enrolled = models.ManyToManyField('Course', blank=True)
    class Meta:
        verbose_name = 'student'
        verbose_name_plural = 'students'

class Professor(TimestampedModel, MainInfoModel):
    professor_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    admin = models.BooleanField(default=False)
    class Meta:
        verbose_name = 'professor'
        verbose_name_plural = 'professors'

class Course(TimestampedModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    course_code = models.CharField(max_length=10, blank=True, null=True)
    course_name = models.CharField(max_length=100, blank=True, null=True)
    professor = models.ForeignKey('Professor', on_delete=models.SET_NULL, null=True, blank=True)
    students = models.ManyToManyField('Student', blank=True)
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

class Schedule(TimestampedModel):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, default=1)
    date = models.DateField()
    starts = models.TimeField(default='00:00')
    ends = models.TimeField(default='00:00')
    duration = models.IntegerField(blank=True, null=True)
    students = models.ManyToManyField('Student', blank=True)
    professor = models.ForeignKey('Professor', on_delete=models.SET_NULL, null=True, blank=True)
    link = models.CharField(max_length=100, blank=True, null=True)
    description = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.title