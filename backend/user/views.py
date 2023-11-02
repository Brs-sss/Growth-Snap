
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
import requests
import json
from .models import User, Family, Event, Plan, Child
from .utils import ListToString,StringToList
import random
import string
import hashlib
import os
import datetime


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
        
def registerFamily(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        openid = data.get('openid')

        # 随机生成6位数字+字母的familyId
        familyId = ''.join(random.sample(string.ascii_letters + string.digits, 6))
        Family.objects.create(familyId=familyId)
        print(familyId)
        return JsonResponse({
            'familyId': familyId
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
            return JsonResponse({
                'msg': 'familyId does not exist'
            }, status=400)
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
            
def getSHA256(request):
    if request.method == 'GET':
        text_to_hash=request.GET.get('text')
        print('txt ',text_to_hash)
        sha256 = hashlib.sha256()
        sha256.update(text_to_hash.encode('utf-8'))
        sha256_hash = sha256.hexdigest()
        print('hash ',sha256_hash)
        return JsonResponse({
                'sha256': sha256_hash
            })
        
        

def submitEvent(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        openid=data.get('openid')
        now_user=User.objects.get(openid=openid)
        event_id=data.get('event_id')
        
        title = data.get('title')
        content = data.get('content')
        date = data.get('date')
        time = (data.get('time'))[:8]
        tags = data.get('tags') #现在的tags是这样的：{'info': 'dd', 'checked': True}, {'info': 'ff', 'checked': False}
        tags=ListToString([tag['info'] for tag in tags if tag['checked']])
        #print(openid,title,content,tags)  #aa ss ['j j j', 'dd']
        new_event=Event.objects.create(user=now_user,date=date,time=time,title=title,content=content,tags=tags,event_id=event_id)
        filtered_records = Event.objects.all()
        for rec in filtered_records:
            print(rec)
        return JsonResponse({'message': 'Data submitted successfully'})
    else:
        return JsonResponse({'message': 'Data submitted successfully'})

def registerProfileImage(request):
    if request.method == 'POST':
        profile_image = request.FILES.get('image') 
        openid=request.POST.get('openid')
        image_path = './static/ImageBase/' + f'{openid}' + '/'
        if not os.path.exists(image_path):
            os.mkdir(image_path)
        # 删除原有的图片
        image_list = os.listdir(image_path)
        for image in image_list:
            os.remove(image_path + image)
        if profile_image:
            with open(image_path+f'{profile_image.name}', 'wb') as destination:
                for chunk in profile_image.chunks():
                    destination.write(chunk)
        return JsonResponse({'message': 'profile image submitted successfully'})
    else:
        return JsonResponse({'message': 'please use POST'})

def addEventImage(request):
    if request.method == 'POST':
        uploaded_image = request.FILES.get('image') 
        pic_index=request.POST.get('pic_index')
        event_id=request.POST.get('event_id')
        
        image_path='./static/ImageBase/' +f'{event_id}/'
        if not os.path.exists(image_path):
            os.mkdir(image_path)
        if uploaded_image:
            with open(image_path+f'{pic_index}_{uploaded_image.name}', 'wb') as destination:
                for chunk in uploaded_image.chunks():
                    destination.write(chunk)
            return JsonResponse({'message': '文件上传成功'})
        else:
            return JsonResponse({'message': '文件不存在'})
    else:
        return JsonResponse({'message': '请使用POST方法'})

#加载主页 只返回必要的信息
def loadShowPage(request):
    if request.method == 'GET':
        openid=request.GET.get('openid')
        now_user=User.objects.get(openid=openid)
        #这里的Event将来应当替换成基类BaseRecord
        now_user_blocks=Event.objects.filter(user=now_user).order_by("-date","-time")  #筛选的结果按照降序排列
        blocks_list=[]
        for db_block in now_user_blocks:
            block_item={}
            block_item['type']=db_block.record_type
            block_item['title']=db_block.title
            block_item['content']=db_block.content
            block_item['author']=db_block.user.label  #爸爸、妈妈、大壮、奶奶
            date_string=str(db_block.date)
            block_item['month']=str(int(date_string[5:7]))+"月"
            block_item['year']=date_string[0:4]
            block_item['day']=date_string[8:10]
            block_item['event_id']=db_block.event_id
            image_path='static/ImageBase/'+db_block.event_id
            image_list = os.listdir(image_path)
            block_item['imgSrc']='http://127.0.0.1:8090/'+f'{image_path}/'+image_list[0]
            blocks_list.append(block_item)
        print(blocks_list)
        return JsonResponse({'blocks_list': blocks_list})
        

def loadPlanPage(request):
    if request.method == 'GET':
        openid=request.GET.get('openid')
        now_user=User.objects.get(openid=openid)
        # 先获得最近7天的具体Todo，按照deadline排序
        week_todos=Plan.objects.filter(user=now_user).order_by("deadline")
        week_todos_expired_list=[]
        week_todos_not_expired_list=[]
        for todo in week_todos:
            todo_item={}
            todo_item['content']=todo.content
            todo_item['deadline']=todo.deadline
            if todo_item['deadline']<datetime.date.today():
                print(f"expired {todo_item['content']} {todo_item['deadline']} today: {datetime.date.today()}")
                week_todos_expired_list.append(todo_item)
            else:
                print(f"not expired {todo_item['content']} {todo_item['deadline']} today: {datetime.date.today()}")
                week_todos_not_expired_list.append(todo_item)
        now_user_plans=Plan.objects.filter(user=now_user)
        plans_list=[]
        for db_block in now_user_plans:
            block_item={}
            block_item['title']=db_block.title
            plans_list.append(block_item)
        print(plans_list)
        return JsonResponse({
            'week_todos_expired_list': week_todos_expired_list,
            'week_todos_not_expired_list': week_todos_not_expired_list,
            'plans_list': plans_list
            
        })


def getUserInfo(request):
    if request.method == 'GET':
        openid=request.GET.get('openid')
        now_user=User.objects.get(openid=openid)
        image_path='static/ImageBase/'+openid
        image_list = os.listdir(image_path)
        profile_image='http://127.0.0.1:8090/'+f'{image_path}/'+image_list[0]
        event_number=len(Event.objects.filter(user=now_user))
        plan_number=len(Plan.objects.filter(user=now_user))

        return JsonResponse({'username':now_user.username,'label':now_user.label,'profile_image':profile_image,'event_number':event_number,'plan_number':plan_number})  
            

def addPlan(request):
    if request.method == 'POST':
        print('enter add plan')
        data = json.loads(request.body)
        openid=data.get('openid')
        now_user=User.objects.get(openid=openid)
        title = data.get('title')
        # date = data.get('date')
        # time = (data.get('time'))[:8]
        child = data.get('child') #现在的child是这样的：['bbbbb', 'bb']
        tags = data.get('tags') #现在的tags是这样的：['2222']
        print(f'child {child}')
        print(f'tags {tags}')
        print(openid,title)
        new_plan=Plan.objects.create(user=now_user,title=title, tags=tags)
        # 可能有多个孩子，所以把孩子们都加进去
        for child_name in child:
            print(f'child_name {child_name}')
            child=Child.objects.get(name=child_name)
            new_plan.children.add(child)
        return JsonResponse({'message': 'Data submitted successfully'})

def getChildrenInfo(request):
    if request.method == 'GET':
        openid=request.GET.get('openid')
        now_user=User.objects.get(openid=openid)
        family=now_user.family
        children_list=[]
        children = Child.objects.filter(family=family)
        for child in children:
            print("test")
            print(child.name, child.child_id)
            child_item = {}
            child_item['name'] = child.name
            # child_item['birthday'] = child.birthday
            # todo: 添加孩子的真实信息
            child_item['age'] = '5'
            child_item['height'] = '144'
            child_item['weight'] = '30'
            image_path='static/ImageBase/'+openid+'+'+child.child_id
            image_list = os.listdir(image_path)
            child_item['imgSrc']='http://127.0.0.1:8090/'+f'{image_path}/'+image_list[0]
            children_list.append(child_item)
        return JsonResponse({'children_list': children_list})
    
def addChild(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        openid=data.get('openid')
        now_user=User.objects.get(openid=openid)
        name = data.get('name')
        # birthday = data.get('birthday')
        # print(openid,name,birthday)
        sha256 = hashlib.sha256()
        sha256.update(name.encode('utf-8'))
        sha256_hash = sha256.hexdigest()
        print(f'sha256_hash {sha256_hash}')
        new_child=Child.objects.create(family=now_user.family,name=name, child_id=str(sha256_hash))
        # print(str(sha256_hash))
        return JsonResponse({
            'message': 'Data submitted successfully',
            'child_id': sha256_hash
        })
    
def addChildImage(request):
    if request.method == 'POST':
        print('enter')
        uploaded_image = request.FILES.get('image') 
        openid=request.POST.get('openid')
        child_id=request.POST.get('child_id')
        print(child_id)
        image_path = './static/ImageBase/' + f'{openid}+{child_id}' + '/'
        print(image_path)
        if not os.path.exists(image_path):
            os.mkdir(image_path)
        # 删除原有的图片
        image_list = os.listdir(image_path)
        for image in image_list:
            os.remove(image_path + image)
        if uploaded_image:
            with open(image_path+f'{uploaded_image.name}', 'wb') as destination:
                for chunk in uploaded_image.chunks():
                    destination.write(chunk)
        return JsonResponse({'message': 'child profile image submitted successfully'})
    else:
        return JsonResponse({'message': 'please use POST'})