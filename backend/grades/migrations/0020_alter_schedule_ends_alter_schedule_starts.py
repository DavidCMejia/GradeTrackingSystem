# Generated by Django 4.2.4 on 2023-09-18 22:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grades', '0019_alter_schedule_ends_alter_schedule_starts'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedule',
            name='ends',
            field=models.TimeField(default='00:00'),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='starts',
            field=models.TimeField(default='00:00'),
        ),
    ]
