from django.db import models

# Create your models here.

# Family class
class Family(models.Model):
    # family id
    familyId = models.CharField(max_length=20, unique=True, default='000000')
    
    def __str__(self):
        return self.familyId

# Child class
class Child(models.Model):
    name = models.CharField(max_length=20)
    # birthday
    birthday = models.DateField()
    # family
    family = models.ForeignKey(Family, on_delete=models.CASCADE)
    def __str__(self):
        return self.name


class User(models.Model):
    username = models.CharField(max_length=20)
    openid = models.CharField(max_length=100, unique=True, null=True, blank=True)
    # label: mom, dad, grandma, grandpa, etc.
    label = models.CharField(max_length=20, null=True, blank=True)
    # session_key = models.CharField(max_length=50)
    # family
    family = models.ForeignKey(Family, on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return self.username


# base class of Event, Thought, and Data
class BaseRecord(models.Model):
    # 每一个用户都有自己的事件、想法、记录和计划，所以这里用外键可以实现一对多的关系(一个用户对应多个事件、想法、记录和计划)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # event, thought, data
    type = models.CharField(max_length=20)
    # date
    date = models.DateField()
    # time
    time = models.TimeField()
    
    def __str__(self):
        return self.type

