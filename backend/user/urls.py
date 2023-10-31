from django.urls import path
from . import views


urlpatterns = [
    path('api/login', views.login, name='login'),
    path('api/register', views.register, name='register'),
    path('api/show/event/submit',views.submitEvent,name='submit_event')
]
