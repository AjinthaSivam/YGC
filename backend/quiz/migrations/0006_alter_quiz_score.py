# Generated by Django 5.0.6 on 2024-09-19 15:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0005_alter_questions_quiz'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quiz',
            name='score',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
