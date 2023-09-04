from django.db import models

# Create your models here.
class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True
class Student(TimestampedModel):
    student_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    courses_enrolled = models.ManyToManyField('Course', blank=True, null=True)

class Course(TimestampedModel):
    course_name = models.CharField(max_length=100)
    course_code = models.CharField(max_length=10)
    professor = models.ForeignKey('Professor', on_delete=models.SET_NULL, null=True, blank=True)
    students = models.ManyToManyField('Student', blank=True, null=True)

class Grade(TimestampedModel):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, default=1)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, default=1)
    grade = models.IntegerField(default=1)

class Professor(models.Model):
    professor_name = models.CharField(max_length=100)

    def __str__(self):
        return self.title