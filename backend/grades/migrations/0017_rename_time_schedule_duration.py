# Generated by Django 4.2.4 on 2023-09-14 22:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('grades', '0016_schedule_ends_schedule_starts_alter_schedule_time'),
    ]

    operations = [
        migrations.RenameField(
            model_name='schedule',
            old_name='time',
            new_name='duration',
        ),
    ]