# Generated by Django 4.2.5 on 2023-11-21 03:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="BaseRecord",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("record_type", models.CharField(default="event", max_length=10)),
                ("date", models.DateField(null=True)),
                ("time", models.TimeField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name="Child",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=20)),
                ("child_id", models.CharField(default="", max_length=65)),
            ],
        ),
        migrations.CreateModel(
            name="Family",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "familyId",
                    models.CharField(default="000000", max_length=20, unique=True),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Plan",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "title",
                    models.CharField(blank=True, default="", max_length=128, null=True),
                ),
                ("icon", models.CharField(blank=True, max_length=128, null=True)),
                ("children", models.ManyToManyField(to="user.child")),
            ],
        ),
        migrations.CreateModel(
            name="Data",
            fields=[
                (
                    "baserecord_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="user.baserecord",
                    ),
                ),
                ("title", models.CharField(max_length=128)),
                ("content", models.CharField(max_length=128)),
                ("full_keys", models.CharField(max_length=128)),
                ("full_values", models.CharField(max_length=128)),
                ("data_id", models.CharField(default="", max_length=65)),
            ],
            bases=("user.baserecord",),
        ),
        migrations.CreateModel(
            name="Event",
            fields=[
                (
                    "baserecord_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="user.baserecord",
                    ),
                ),
                ("title", models.CharField(max_length=128)),
                ("content", models.CharField(max_length=1024)),
                ("tags", models.CharField(max_length=200)),
                ("event_id", models.CharField(default="", max_length=65)),
            ],
            bases=("user.baserecord",),
        ),
        migrations.CreateModel(
            name="Text",
            fields=[
                (
                    "baserecord_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="user.baserecord",
                    ),
                ),
                ("title", models.CharField(max_length=128)),
                ("content", models.CharField(max_length=1024)),
                ("tags", models.CharField(max_length=200)),
                ("text_id", models.CharField(default="", max_length=65)),
            ],
            bases=("user.baserecord",),
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("username", models.CharField(max_length=20)),
                (
                    "openid",
                    models.CharField(
                        blank=True, max_length=100, null=True, unique=True
                    ),
                ),
                ("label", models.CharField(blank=True, max_length=20, null=True)),
                (
                    "family",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="user.family",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Todo",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "title",
                    models.CharField(blank=True, default="", max_length=128, null=True),
                ),
                (
                    "is_finished",
                    models.BooleanField(blank=True, default=False, null=True),
                ),
                ("deadline", models.DateField(blank=True, null=True)),
                ("todo_id", models.CharField(default="", max_length=65)),
                (
                    "plan",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="user.plan",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="user.user",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Record",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date", models.DateField(null=True)),
                ("time", models.TimeField(null=True)),
                ("key", models.CharField(max_length=24)),
                ("value", models.FloatField(max_length=24)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="user.user"
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="plan",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="user.user",
            ),
        ),
        migrations.AddField(
            model_name="child",
            name="family",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="user.family"
            ),
        ),
        migrations.AddField(
            model_name="baserecord",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="user.user"
            ),
        ),
    ]
