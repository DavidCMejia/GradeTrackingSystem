# Generated by Django 4.2.4 on 2023-09-04 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grades', '0002_rename_grades_grade'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grade',
            name='description',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]