from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/login', views.login, name='login'),
    path('api/register', views.register, name='register'),
    path('api/get_familyid', views.getFamilyID, name='get_familyid'),
    path('api/show/event/submit', views.submitEvent, name='submit_event'),
    path('api/show/data/submit', views.submitData, name='submit_data'),
    path('api/show/data/getkeys', views.getKeys, name='submit_data'),
    # path('api/register_family', views.registerFamily, name='register_family'),
    path('api/getSHA256', views.getSHA256, name='getsha256'),
    path('api/show/event/upload_image', views.addEventImage, name='upload_image'),
    path('api/show/all', views.loadShowPage, name='load_showpage'),
    path('api/show/search', views.loadSearchPage, name='load_searchpage'),
    path('api/plan/main', views.loadPlanMain, name='load_plan_main'),
    path('api/plan/all', views.loadAllPlanPage, name='load_all_plan_page'),
    path('api/plan/certain_plan', views.loadCertainPlan, name='load_certain_plan'),
    path('api/plan/delete_plan', views.deletePlan, name='delete_plan'),
    path('api/plan/add_plan', views.addPlan, name='add_plan'),
    path('api/plan/add_todo', views.addTodo, name='add_todo'),
    path('api/plan/update_todo', views.updateTodo, name='update_todo'),
    path('api/register_profile_image', views.registerProfileImage, name='register_profile_image'),
    path('api/user/get_user_info', views.getUserInfo, name='get_user_info'),
    path('api/user/children_info', views.getChildrenInfo, name='get_children_info'),
    path('api/user/child_detail', views.loadChildDetail, name='child_detail'),
    path('api/user/add_child', views.addChild, name='add_child'),
    path('api/user/add_child_image', views.addChildImage, name='add_child_image'),
    path('api/user/get_family_info', views.getFamilyInfo, name='get_family_info'),
    path('api/user/generate_family_token', views.generateFamilyToken, name='generate_family_token'),
    path('api/user/get_activity_id', views.getActivityID, name='get_activity_id'),
    path('api/user/get_family_token', views.getFamilyToken, name='get_family_token'),
    path('api/show/event/detail', views.loadEventDetail, name='event_detail'),
    path('api/show/text/detail', views.loadTextDetail, name='text_detail'),
    path('api/show/data/detail', views.loadDataDetail, name='data_detail'),
    path('api/show/event/delete', views.deleteEvent, name='event_delete'),
    path('api/show/text/delete', views.deleteText, name='text_delete'),
    path('api/show/data/delete', views.deleteData, name='data_delete'),
    path('api/generate/diary', views.generateDiary, name='generate_diary'),
    path('api/generate/diary/preview', views.loadPDFThumbnail, name="diary_preview"),
    path('api/generate/diary/longimage', views.generateDiaryLongImage, name="diary_longimage"),
    path('api/generate/video', views.generateVideo, name="generate_video"),
    path('api/generate/video/preview/<str:openid>/<str:video_title>', views.loadVideoThumbnail, name="video_preview"),
    path('api/generate/timeline', views.loadTimelinePage, name='load_timelinepage'),
    path('api/generate/data', views.loadData, name='load_data'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
