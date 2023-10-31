from django.urls import path
from . import views


urlpatterns = [
    path('api/login', views.login, name='login'),
    path('api/register', views.register, name='register'),
    path('api/show/event/submit',views.submitEvent,name='submit_event'),
    path('api/getSHA256',views.getSHA256,name='getsha256'),
    path('api/show/event/upload_image',views.addEventImage,name='upload_image'),
]
