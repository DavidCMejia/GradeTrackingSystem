# Generated by Django 4.2.4 on 2023-09-05 17:26

from django.db import migrations, models
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('grades', '0004_course_professor_remove_grade_description_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='professor',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='professor',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='student',
            name='student_number',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
        migrations.AlterField(
            model_name='course',
            name='course_code',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='course',
            name='course_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='course',
            name='students',
            field=models.ManyToManyField(blank=True, null=True, to='grades.student'),
        ),
        migrations.AlterField(
            model_name='student',
            name='courses_enrolled',
            field=models.ManyToManyField(blank=True, null=True, to='grades.course'),
        ),
        migrations.AlterField(
            model_name='student',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name='student',
            name='student_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
