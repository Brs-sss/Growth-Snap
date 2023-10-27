from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
import requests
import json

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

        # 返回响应数据
        return JsonResponse({
            'openid': openid,
            'session_key': session_key,
            'unionid': unionid,
            'errcode': errcode,
            'errmsg': errmsg
        })