from typing import Any
from django.db import models
from django.contrib.postgres.fields import ArrayField


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
    child_id = models.CharField(max_length=65, default='')
    # birthday
    # birthday = models.DateField(null=True)
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
    # event, text, data
    record_type = models.CharField(max_length=10, default='event')
    # date
    date = models.DateField(null=True)
    # time
    time = models.TimeField(null=True)


class Event(BaseRecord):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.record_type = 'event'

    title = models.CharField(max_length=128)
    content = models.CharField(max_length=1024)
    tags = models.CharField(max_length=200)
    event_id = models.CharField(max_length=65, default="")

    def __str__(self):
        return str(
            self.user) + " " + self.record_type + " " + self.title + " " + self.content + " " + self.tags + " " + \
            str(self.date) + " " + str(self.time)


class Text(BaseRecord):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.record_type = 'text'

    title = models.CharField(max_length=128)
    content = models.CharField(max_length=1024)
    tags = models.CharField(max_length=200)
    text_id = models.CharField(max_length=65, default="")


class Data(BaseRecord):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.record_type = 'data'

    title = models.CharField(max_length=128)
    content = models.CharField(max_length=128)
    data_id = models.CharField(max_length=65, default="")

    def __str__(self):
        return str(self.user) + " " + self.record_type


class Record(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(null=True)
    time = models.TimeField(null=True)
    key = models.CharField(max_length=24)
    value = models.FloatField(max_length=24)


class Plan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    children = models.ManyToManyField(Child)
    title = models.CharField(max_length=128, default="", null=True, blank=True)
    icon = models.CharField(max_length=128, null=True, blank=True)


class Todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=128, default="", null=True, blank=True)
    # 是否完成
    is_finished = models.BooleanField(default=False, null=True, blank=True)
    # deadline
    deadline = models.DateField(null=True, blank=True)
