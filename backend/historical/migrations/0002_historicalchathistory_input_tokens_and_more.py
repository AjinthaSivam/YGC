# Generated by Django 4.2.15 on 2024-09-11 11:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('historical', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalchathistory',
            name='input_tokens',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='historicalchathistory',
            name='output_tokens',
            field=models.IntegerField(default=0),
        ),
    ]
