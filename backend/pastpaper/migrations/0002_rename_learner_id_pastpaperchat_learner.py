# Generated by Django 5.0.6 on 2024-08-18 15:29

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("pastpaper", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="pastpaperchat",
            old_name="learner_id",
            new_name="learner",
        ),
    ]
