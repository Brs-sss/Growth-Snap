# Generated by Django 4.2.5 on 2023-11-12 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("user", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="todo",
            name="todo_id",
            field=models.CharField(default="", max_length=65),
        ),
    ]