# Generated by Django 4.2.5 on 2023-10-28 13:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Base',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=20)),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('content', models.CharField(max_length=200)),
                ('location', models.CharField(blank=True, max_length=100, null=True)),
                ('weather', models.CharField(blank=True, max_length=20, null=True)),
                ('mood', models.CharField(blank=True, max_length=20, null=True)),
                ('tag', models.CharField(blank=True, max_length=20, null=True)),
                ('label', models.CharField(blank=True, max_length=20, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.user')),
            ],
        ),
    ]