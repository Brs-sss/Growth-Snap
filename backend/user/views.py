
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
import requests
import json
from .models import User, Family, Event

# Create your views here.


def login(request):
    print('here')
    if request.method == 'POST':
        data = json.loads(request.body)
        code = data.get('code')
        print(code)
        url = f'https://api.weixin.qq.com/sns/jscode2session?appid={settings.APP_ID}&secret={settings.APP_SECRET}&js_code={code}&grant_type=authorization_code'
        response = requests.get(url)
        data = response.json()

        # 处理响应数据
        openid = data.get('openid')
        session_key = data.get('session_key')
        unionid = data.get('unionid')
        errcode = data.get('errcode')
        errmsg = data.get('errmsg')

        # 检查这个用户是否已经存在
        if User.objects.filter(openid=openid).exists():
            # 如果存在，就直接返回响应数据
            return JsonResponse({
                'openid': openid,
                'errcode': errcode,
                'errmsg': errmsg,
                'exists': 'true'
            })
        else:
            
            # 返回响应数据
            return JsonResponse({
                'openid': openid,
                'errcode': errcode,
                'errmsg': errmsg,
                'exists': 'false'
            })
        
# todo: 家庭口令的设置和验证
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        openid = data.get('openid')
        label = data.get('label')
        familyId = data.get('familyId')
        print(username)
        print(openid)
        print(label)
        print(familyId)
        # 检查这个fammily是否已经存在
        if not Family.objects.filter(familyId=familyId).exists():
            Family.objects.create(familyId=familyId)
        family = Family.objects.get(familyId=familyId)

        # 检查这个用户是否已经存在
        if User.objects.filter(username=username).exists():
            # 如果存在，报错：username already exists
            return JsonResponse({
                'msg': 'username already exists'
            })
        else:
            # 如果不存在，就创建新用户
            user = User.objects.create(
                username=username,
                openid=openid,
                label=label,
                family=family
            )
            # 返回响应数据
            return JsonResponse({
                'msg': 'register success'
            })

def submitEvent(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        title = data.get('title')
        content = data.get('content')
        date = data.get('date')
        time = data.get('time')
        tags = data.get('tags') #现在的tags是这样的：{'info': 'dd', 'checked': True}, {'info': 'ff', 'checked': False}
        tags=[tag['info'] for tag in tags if tag['checked']]
        #print(title,content,tags)  #aa ss ['j j j', 'dd']
        new_event=Event(user=,date=date,time=time,title=title,content=content,tags=tags)
        new_event.save()
        filtered_records = Event.objects.all()
        print(filtered_records)
        return JsonResponse({'message': 'Data submitted successfully'})
    