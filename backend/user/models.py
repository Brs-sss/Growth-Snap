from django.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    openid = models.CharField(max_length=100, unique=True, null=True, blank=True)
    # label: mom, dad, grandma, grandpa, etc.
    label = models.CharField(max_length=20, null=True, blank=True)
    session_key = models.CharField(max_length=50)
    def __str__(self):
        return self.username
