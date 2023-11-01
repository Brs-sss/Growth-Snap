from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('api/login', views.login, name='login'),
    path('api/register', views.register, name='register'),
    path('api/show/event/submit',views.submitEvent,name='submit_event'),
    path('api/register_family',views.registerFamily,name='register_family'),
    path('api/getSHA256',views.getSHA256,name='getsha256'),
    path('api/show/event/upload_image',views.addEventImage,name='upload_image'),
    path('api/show/all',views.loadShowPage,name='load_showpage'),
    path('api/plan/add_plan',views.addPlan,name='add_plan'),
    path('api/register_profile_image',views.registerProfileImage,name='register_profile_image'),
    path('api/user/get_user_info',views.getUserInfo,name='get_user_info'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)