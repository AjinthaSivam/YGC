# Generated by Django 5.0.6 on 2024-10-15 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0006_alter_quiz_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questions',
            name='options',
            field=models.JSONField(),
        ),
    ]