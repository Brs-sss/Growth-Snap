from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse, HttpResponse, FileResponse
from django.db.models import Q
from django.core.cache import cache
import requests
import json
from django.contrib.contenttypes.models import ContentType
from .models import User, Family, BaseRecord, Event, Text, Data, Record, Plan, Child, Todo
from .utils import ListToString, StringToList, GenerateDiaryPDF, GenerateThumbnail, GenerateVideo, GenerateLongImage, GenerateEventThumnail
import random
import string
import hashlib
import os
import datetime
import shutil
from urllib.parse import unquote
from manage import host_url


# import fitz

# Create your views here.


event_image_base_path = 'static/ImageBase/'


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


def registerFamily(openid):
    text_to_hash = openid + str(datetime.datetime.now())
    print('hash: ', text_to_hash)
    sha256 = hashlib.sha256()
    sha256.update(text_to_hash.encode('utf-8'))
    sha256_hash = sha256.hexdigest()
    sha256_hash = str(sha256_hash)
    print('hashed: ', sha256_hash)
    # # 随机生成6位数字+字母的familyId
    # familyId = ''.join(random.sample(string.ascii_letters + string.digits, 6))
    # # 判断有没有重复的familyId
    # while Family.objects.filter(familyId=familyId).exists():
    #     familyId = ''.join(random.sample(string.ascii_letters + string.digits, 6))
    # # 创建新的family
    # Family.objects.create(familyId=familyId)
    # print(familyId)
    # return JsonResponse({
    #     'familyId': familyId
    # })
    #  判断有没有重复的family_id
    # while Family.objects.filter(family_id=sha256_hash).exists():
    #     text_to_hash = openid + str(datetime.datetime.now())
    #     print('hash: ', text_to_hash)
    #     sha256 = hashlib.sha256()
    #     sha256.update(text_to_hash.encode('utf-8'))
    #     sha256_hash = sha256.hexdigest()
    #     sha256_hash = str(sha256_hash)
    #     print('hashed: ', sha256_hash)
    return sha256_hash


# todo: 家庭口令的设置和验证
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        openid = data.get('openid')
        label = data.get('label')
        token = data.get('token')
        print(username)
        print(openid)
        print(label)
        print(token)
        # 看是新家庭还是加入家庭
        if token == 'new_family':
            family_id = registerFamily(openid)
            # 创建新家庭
            family = Family.objects.create(family_id=family_id)
        else:
            # 验证家庭是否存在
            # token不能为默认值：000000
            if token == '000000':
                return JsonResponse({
                    'msg': 'family does not exist'
                })
            if Family.objects.filter(token=token).exists():
                family = Family.objects.get(token=token)
                # token是否过期
                if family.token_expiration == None or family.token_expiration.replace(tzinfo=None) < datetime.datetime.now():
                    # 过期
                    return JsonResponse({
                        'msg': 'family does not exist'
                    })
            else:
                return JsonResponse({
                    'msg': 'family does not exist'
                })

        # family存在
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


def generateFamilyToken(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        openid = data.get('openid')
        family = User.objects.get(openid=openid).family
        now = datetime.datetime.now()
        if family.token_expiration == None or family.token_expiration.replace(tzinfo=None) < now:
            # 过期
            token = ''.join(random.sample(string.ascii_letters + string.digits, 10))
            family.token = token
            family.token_expiration = datetime.datetime.now() + datetime.timedelta(minutes=10)
            family.save()
            countdown = 10 * 60 * 1000
        else:
            token = family.token
            countdown = (family.token_expiration.replace(tzinfo=None) - datetime.datetime.now()).seconds * 1000
        return JsonResponse({
            'token': token,
            'time': countdown
        })
    else:
        return JsonResponse({
            'msg': 'please use POST'
        })


def getFamilyToken(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        family = User.objects.get(openid=openid).family
        if family.token_expiration == None or family.token_expiration.replace(tzinfo=None) < datetime.datetime.now():
            # 过期
            return JsonResponse({
                'code': 'invalid'
            })
        else:
            token = family.token
            countdown = (family.token_expiration.replace(tzinfo=None) - datetime.datetime.now()).seconds * 1000
        return JsonResponse({
            'token': token,
            'time': countdown,
            'code': 'valid'
        })
    else:
        return JsonResponse({
            'msg': 'please use GET'
        })


def getSHA256(request):
    if request.method == 'GET':
        text_to_hash = request.GET.get('text')
        print('txt ', text_to_hash)
        sha256 = hashlib.sha256()
        sha256.update(text_to_hash.encode('utf-8'))
        sha256_hash = sha256.hexdigest()
        print('hash ', sha256_hash)
        return JsonResponse({
            'sha256': sha256_hash
        })


def submitEvent(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        openid = data.get('openid')
        now_user = User.objects.get(openid=openid)
        event_id = data.get('event_id')
        event_date = data.get('event_date')
        # print(f'event_date {event_date}')
        title = data.get('title')
        content = data.get('content')
        date = data.get('date')
        time = (data.get('time'))[:8]
        tags = data.get('tags')  # 现在的tags是这样的：{'info': 'dd', 'checked': True}, {'info': 'ff', 'checked': False}
        tags = ListToString([tag['info'].strip() for tag in tags if tag['checked'] and len(tag['info'].strip()) != 0])
        # print(openid,title,content,tags)  #aa ss ['j j j', 'dd']
        type = data.get('type')
        if type == 'event':
            new_event = Event.objects.create(user=now_user, date=date, time=time, title=title, content=content,
                                             tags=tags,
                                             event_id=event_id, event_date=event_date)
            image_path = './static/ImageBase/' + f'{event_id}/'
            if not os.path.exists(image_path):
                os.mkdir(image_path)
        elif type == 'text':
            new_event = Text.objects.create(user=now_user, date=date, time=time, title=title, content=content,
                                            tags=tags,
                                            text_id=event_id)

        now_family = now_user.family
        children = data.get('children')
        for name in children:
            child = Child.objects.get(family=now_family, name=name)
            new_event.children.add(child)
            

        print(new_event.children, new_event.children.all())
        return JsonResponse({'message': 'Data submitted successfully'})
    else:
        return JsonResponse({'message': 'Data submitted successfully'})


def addEventImage(request):
    if request.method == 'POST':
        uploaded_image = request.FILES.get('image')
        pic_index = request.POST.get('pic_index')
        event_id = request.POST.get('event_id')

        image_path = './static/ImageBase/' + f'{event_id}/'
        thumbnail_path = './static/Thumbnail/'+ f'{event_id}/'
        if not os.path.exists(image_path):
            os.mkdir(image_path)
        if not os.path.exists(thumbnail_path):
            os.mkdir(thumbnail_path)
        if uploaded_image:
            pic_name=f'{pic_index}_{uploaded_image.name}'
            image_path_name=image_path + pic_name
            with open(image_path_name, 'wb') as destination:
                for chunk in uploaded_image.chunks():
                    destination.write(chunk)
            GenerateEventThumnail(src_path=image_path_name,dest_path= thumbnail_path,image_name= pic_name,target_width=200)
            return JsonResponse({'message': '文件上传成功'})
        else:
            return JsonResponse({'message': '文件不存在'})
    else:
        return JsonResponse({'message': '请使用POST方法'})


def submitData(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        openid = data.get('openid')
        user = User.objects.get(openid=openid)
        data_id = data.get('data_id')
        date = data.get('date')
        time = (data.get('time'))[:8]
        children = data.get('children')  # TODO: 绑定孩子信息
        records = data.get('records')
        now_family = user.family
        children = data.get('children')
        print(records)
        records_json = json.loads(records)
        index = 0
        keyList = []
        valueList = []
        for record in records_json:
            if index < 3:
                keyList.append(record['key'])
                valueList.append(record['value'])
                index += 1
            new_rc = Record.objects.create(user=user, date=date, time=time,
                                           key=record['key'], value=record['value'], data_id=data_id)
            for name in children:
                child = Child.objects.get(family=now_family, name=name)
                new_rc.children.add(child)

        if keyList.__len__() == 1:
            title = keyList[0] + '记录'
            content = keyList[0] + '：' + valueList[0]

        elif keyList.__len__() == 2:
            title = keyList[0] + '&' + keyList[1] + '记录'
            content = keyList[0] + '：' + valueList[0] + '；'
            content += (keyList[1] + '：' + valueList[1])

        else:
            title = keyList[0] + '、' + keyList[1] + '等记录'
            content = keyList[0] + '：' + valueList[0] + '；'
            content += (keyList[1] + '：' + valueList[1] + '；……')

        new_data = Data.objects.create(user=user, date=date, time=time, title=title, content=content,
                                       records=records, data_id=data_id)

        for name in children:
            child = Child.objects.get(family=now_family, name=name)
            new_data.children.add(child)

        return JsonResponse({'message': 'Data submitted successfully'})
    else:
        return JsonResponse({'message': 'Please use POST'})


def getKeys(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        now_user = User.objects.get(openid=openid)
        keyList = list(Record.objects.filter(user__family=now_user.family).values_list('key', flat=True).distinct())
        print(keyList)
        return JsonResponse({
            'message': 'Successfully get the keys',
            'keyList': keyList
        })
    else:
        return JsonResponse({'message': 'Please use GET'})


def registerProfileImage(request):
    if request.method == 'POST':
        profile_image = request.FILES.get('image')
        openid = request.POST.get('openid')
        image_path = './static/ImageBase/' + f'{openid}' + '/'
        if not os.path.exists(image_path):
            os.mkdir(image_path)
        # 删除原有的图片
        image_list = os.listdir(image_path)
        for image in image_list:
            os.remove(image_path + image)
        if profile_image:
            with open(image_path + f'{profile_image.name}', 'wb') as destination:
                for chunk in profile_image.chunks():
                    destination.write(chunk)
        return JsonResponse({'message': 'profile image submitted successfully'})
    else:
        return JsonResponse({'message': 'please use POST'})


# 加载主页 只返回必要的信息
def loadShowPage(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        start = request.GET.get('start','0')
        delta = request.GET.get('delta','all')
        types = request.GET.get('types', "etd")  # 缺省值为event&text&data
        
        used_by_addEvent_page = (request.GET.get('tags', "false") == "true")
        now_user = User.objects.get(openid=openid)
        family = now_user.family
        # 这里的Event将来应当替换成基类BaseRecord
        now_user_blocks_events = Event.objects.filter(user__family=now_user.family).order_by("-date",
                                                                              "-time") if 'e' in types else []  # 筛选的结果按照降序排列
        now_user_blocks_data = Data.objects.filter(user__family=now_user.family).order_by("-date", "-time") if 'd' in types else []
        now_user_blocks_text = Text.objects.filter(user__family=now_user.family).order_by("-date", "-time") if 't' in types else []
        now_user_blocks = sorted(list(now_user_blocks_events) + list(now_user_blocks_data) + list(now_user_blocks_text),
                                 key=lambda x: (x.date, x.time), reverse=True)
        print(now_user_blocks.__len__())
        
        start=int(start)
        total=len(now_user_blocks)
        end=total if delta == 'all' else min(start+int(delta),total)
        blocks_list = []
        for db_block in now_user_blocks[start:end]:
            block_item = {}
            block_item['type'] = db_block.record_type
            block_item['title'] = db_block.title

            if used_by_addEvent_page:
                block_item['tags'] = StringToList(db_block.tags)
            else:
                block_item['content'] = db_block.content
                block_item['author'] = db_block.user.label  # 爸爸、妈妈、大壮、奶奶
                date_string = str(db_block.date)
                block_item['month'] = str(int(date_string[5:7])) + "月"
                block_item['year'] = date_string[0:4]
                block_item['day'] = date_string[8:10]

            if db_block.record_type == 'event':  # 检查是否与子类A相关if
                block_item['event_id'] = db_block.event_id
                image_path = 'static/ImageBase/' + db_block.event_id
                thumnail_path = 'static/Thumbnail/' + db_block.event_id
                image_list = sorted(os.listdir(image_path))
                if not os.path.exists(f'{thumnail_path}/' + image_list[0]):
                    GenerateEventThumnail(src_path=f'{image_path}/' + image_list[0],dest_path= f'{thumnail_path}/', image_name= image_list[0], target_width=300)
                block_item['imgSrc'] = host_url + f'{thumnail_path}/' + image_list[0]

            if db_block.record_type == 'data':
                block_item['data_id'] = db_block.data_id

            elif db_block.record_type == 'text':
                block_item['text_id'] = db_block.text_id

            blocks_list.append(block_item)

        # print(blocks_list)
        return JsonResponse({'blocks_list': blocks_list,'start':end})


# 加载搜索结果页面
def loadSearchPage(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        search_key = unquote(request.GET.get('searchKey'))
        types = request.GET.get('types', "etd")  # Default value is "event&text&data"
        used_by_add_event_page = (request.GET.get('tags', "false") == "true")
        now_user = User.objects.get(openid=openid)

        # Fuzzy search in title and content for Event and Text
        event_filter = Q(title__icontains=search_key) | Q(content__icontains=search_key) if 'e' in types else Q()
        text_filter = Q(title__icontains=search_key) | Q(content__icontains=search_key) if 't' in types else Q()

        now_user_blocks_events = Event.objects.filter(user__family=now_user.family).filter(event_filter).order_by("-date", "-time")
        now_user_blocks_data = Data.objects.filter(user__family=now_user.family).order_by("-date", "-time") if 'd' in types else []
        now_user_blocks_text = Text.objects.filter(user__family=now_user.family).filter(text_filter).order_by("-date", "-time")
        # 暂时不支持data的搜索
        now_user_blocks = sorted(list(now_user_blocks_events) + list(now_user_blocks_text),
                                 key=lambda x: (x.date, x.time), reverse=True)

        blocks_list = []
        for db_block in now_user_blocks:
            block_item = {}
            block_item['type'] = db_block.record_type
            block_item['title'] = db_block.title

            if used_by_add_event_page:
                block_item['tags'] = StringToList(db_block.tags)
            else:
                block_item['content'] = db_block.content
                block_item['author'] = db_block.user.label
                date_string = str(db_block.date)
                block_item['month'] = str(int(date_string[5:7])) + "月"
                block_item['year'] = date_string[0:4]
                block_item['day'] = date_string[8:10]

            if db_block.record_type == 'event':
                block_item['event_id'] = db_block.event_id
                image_path = 'static/ImageBase/' + db_block.event_id
                image_list = sorted(os.listdir(image_path))
                block_item['imgSrc'] = host_url + f'{image_path}/' + image_list[0]

            if db_block.record_type == 'data':
                block_item['data_id'] = db_block.data_id

            elif db_block.record_type == 'text':
                block_item['text_id'] = db_block.text_id

            blocks_list.append(block_item)

        return JsonResponse({'blocks_list': blocks_list})


def loadPlanPage(request):
    print('Enter load plan page')
    if request.method == 'GET':
        openid = request.GET.get('openid')
        now_user = User.objects.get(openid=openid)
        # 先获得最近7天的Todo
        finished_todo_list = []
        not_finished_todo_list = []
        today = datetime.date.today()
        seven_days_later = today + datetime.timedelta(days=7)
        todos = Todo.objects.filter(user__family=now_user.family).order_by('deadline')
        for todo in todos:
            print(todo.deadline)
            print(today <= todo.deadline <= seven_days_later)
            if today <= todo.deadline <= seven_days_later:
                left_days = (todo.deadline - today).days
                todo_item = {'task': todo.title, 'leftDay': left_days, 'complete': todo.is_finished,
                             'todo_id': todo.todo_id}
                if todo.is_finished:
                    finished_todo_list.append(todo_item)
                else:
                    not_finished_todo_list.append(todo_item)
        # 获取部分计划
        now_user_plans = Plan.objects.filter(user__family=now_user.family)
        print(list(now_user_plans))
        plan_list = []
        for db_block in now_user_plans:
            block_item = {'title': db_block.title, 'icon': db_block.icon}
            plan_list.append(block_item)
            if plan_list.__len__() >= 2:
                break
        print(plan_list)
        return JsonResponse({
            'finished_todo_list': finished_todo_list,
            'not_finished_todo_list': not_finished_todo_list,
            'plan_list': plan_list
        })


def loadAllPlanPage(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        print(openid)
        now_user = User.objects.get(openid=openid)
        # 获得所有计划
        plans = Plan.objects.filter(user__family=now_user.family)
        plan_list = []
        for plan in plans:
            plan_list.append({'title': plan.title, 'icon': plan.icon})
        print(plan_list)
        return JsonResponse({
            'plan_list': plan_list,
        })


def loadCertainPlan(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        now_user = User.objects.get(openid=openid)
        planTitle = request.GET.get('plan')
        plan = Plan.objects.filter(user__family=now_user.family, title=planTitle).first()
        icon = plan.icon
        todos = plan.todo_set.all().order_by("deadline")
        todo_list = []
        for todo in todos:
            todo_item = {'task': todo.title, 'ddl': str(todo.deadline), 'check': todo.is_finished,
                         'todo_id': todo.todo_id}
            todo_list.append(todo_item)
        print(todo_list)
        return JsonResponse({
            'message': 'ok',
            'icon': icon,
            'todos': todo_list,
        })

def deletePlan(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        openid = data.get('openid')
        now_user = User.objects.get(openid=openid)
        planTitle = data.get('planTitle')
        plan = Plan.objects.filter(user__family=now_user.family, title=planTitle).first()
        try:
            plan.delete()
        except:
            return JsonResponse({'message': 'error'})
        return JsonResponse({
            'message': 'ok',
        })

def getUserInfo(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        now_user = User.objects.get(openid=openid)
        image_path = 'static/ImageBase/' + openid
        image_list = os.listdir(image_path)
        profile_image = host_url + f'{image_path}/' + image_list[0]
        print(f'profile_image {profile_image}')
        event_number = len(Event.objects.filter(user__family=now_user.family))
        plan_number = len(Plan.objects.filter(user__family=now_user.family))
        text_number = len(Text.objects.filter(user__family=now_user.family))
        credit = event_number * 5 + plan_number * 1 + text_number * 5

        return JsonResponse({'username': now_user.username, 'label': now_user.label, 'profile_image': profile_image,
                             'event_number': event_number, 'plan_number': plan_number, 'text_number': text_number,
                             'credit': credit})


def addPlan(request):
    if request.method == 'POST':
        print('enter add plan')
        data = json.loads(request.body)
        print(data)
        openid = data.get('openid')
        now_user = User.objects.get(openid=openid)
        title = data.get('title')
        if Plan.objects.filter(user__family=now_user.family, title=title).exists():
            return JsonResponse({'message': 'Duplicate plan name'})
        icon = data.get('icon')
        child = data.get('child')  # 现在的child是这样的：['bbbbb', 'bb']
        new_plan = Plan.objects.create(user=now_user, title=title, icon=icon)
        # 可能有多个孩子，因此需依次添加
        for child_name in child:
            print(f'child_name {child_name}')
            child = Child.objects.filter(name=child_name)[0]
            new_plan.children.add(child)
        print(new_plan)
        return JsonResponse({'message': 'Successfully add the plan.'})


def addTodo(request):
    if request.method == 'POST':
        print('enter add todo')
        data = json.loads(request.body)
        openid = data.get('openid')
        now_user = User.objects.get(openid=openid)
        planTitle = data.get('planTitle')
        plan = Plan.objects.get(user__family=now_user.family, title=planTitle)
        title = data.get('title')
        deadline = data.get('deadline')
        todo_id = data.get('id')
        new_todo = Todo.objects.create(user=now_user, plan=plan, title=title, deadline=deadline, todo_id=todo_id)
        return JsonResponse({'message': 'Successfully add the todo.'})


def updateTodo(request):
    if request.method == 'POST':
        print('enter update todo')
        data = json.loads(request.body)
        openid = data.get('openid')
        now_user = User.objects.get(openid=openid)
        todo_id = data.get('id')
        todo = Todo.objects.get(user__family=now_user.family, todo_id=todo_id)
        content = data.get('content')
        print(content)
        if content == 'ddl':
            ddl = data.get('ddl')
            todo.deadline = ddl
            print(ddl)
            todo.save()
        elif content == 'finish':
            finish = data.get('finish')
            todo.is_finished = finish
            todo.save()
        elif content == 'delete':
            todo.delete()
        return JsonResponse({'message': 'Successfully update the todo.'})


def loadEventDetail(request):
    if request.method == 'GET':
        event_id = request.GET.get('event_id')
        # 返回渲染的list
        db_block = Event.objects.get(event_id=event_id)
        block_item = {}
        block_item['type'] = db_block.record_type
        block_item['title'] = db_block.title
        block_item['content'] = db_block.content
        event_date = str(db_block.event_date)
        block_item['event_date'] = event_date.split('-')[0] + '年' + event_date.split('-')[1] + '月' + \
                                   event_date.split('-')[2] + '日'
        block_item['author'] = db_block.user.label  # 爸爸、妈妈、大壮、奶奶
        date_string = str(db_block.date)
        block_item['month'] = str(int(date_string[5:7])) + "月"
        block_item['year'] = date_string[0:4]
        block_item['day'] = date_string[8:10]
        # block_item['event_id']=db_block.event_id
        image_path = 'static/ImageBase/' + db_block.event_id
        image_list = sorted(os.listdir(image_path))
        block_item['imgSrcList'] = [host_url + f'{image_path}/' + image for image in image_list]
        block_item['tags'] = StringToList(db_block.tags)
        block_item['children']=[child.name for child in db_block.children.all()]
        return JsonResponse({'block_item': block_item})


def loadTextDetail(request):
    if request.method == 'GET':
        text_id = request.GET.get('text_id')
        # 返回渲染的list
        db_block = Text.objects.get(text_id=text_id)
        block_item = {}
        block_item['type'] = db_block.record_type
        block_item['title'] = db_block.title
        block_item['content'] = db_block.content
        block_item['author'] = db_block.user.label  # 爸爸、妈妈、大壮、奶奶
        date_string = str(db_block.date)
        block_item['month'] = str(int(date_string[5:7])) + "月"
        block_item['year'] = date_string[0:4]
        block_item['day'] = date_string[8:10]
        block_item['tags'] = StringToList(db_block.tags)
        block_item['children']=[child.name for child in db_block.children.all()]
        return JsonResponse({'block_item': block_item})


def loadDataDetail(request):
    if request.method == 'GET':
        data_id = request.GET.get('data_id')
        # 返回渲染的list
        db_block = Data.objects.get(data_id=data_id)
        date = db_block.date
        date_string = str(date)
        date_string = date_string[0:4] + "年" + str(int(date_string[5:7])) + "月" + date_string[8:10] + "日"
        data_item = {
            'records': json.loads(db_block.records),
            'date': date_string,
            'children': [child.name for child in db_block.children.all()]
        }
        return JsonResponse({'data_item': data_item})


def deleteEvent(request):
    if request.method == 'GET':
        event_id = request.GET.get('event_id')
        # 返回渲染的list
        try:
            shutil.rmtree('static/ImageBase/' + event_id)
            Event.objects.get(event_id=event_id).delete()
        except:
            return JsonResponse({'msg': 'error'})
        return JsonResponse({'msg': 'ok'})


def deleteText(request):
    if request.method == 'GET':
        text_id = request.GET.get('text_id')
        # 返回渲染的list
        try:
            Text.objects.get(text_id=text_id).delete()
        except:
            return JsonResponse({'msg': 'error'})
        return JsonResponse({'msg': 'ok'})


def deleteData(request):
    if request.method == 'GET':
        data_id = request.GET.get('data_id')
        try:
            # 删除上传内容
            Data.objects.get(data_id=data_id).delete()
            # 删除数据信息
            Record.objects.filter(data_id=data_id).delete()
        except:
            return JsonResponse({'msg': 'fail'})
        return JsonResponse({'msg': 'ok'})


def getChildrenInfo(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        now_user = User.objects.get(openid=openid)
        family = now_user.family
        print(f'family_id: {family.family_id}')
        children_list = []
        children = Child.objects.filter(family=family)
        for child in children:
            # print("test")
            # print(child.name, child.child_id)
            child_item = {}
            child_item['name'] = child.name
            # child_item['birthday'] = child.birthday
            # todo: 添加孩子的真实信息
            child_item['age'] = 6

            # 计算孩子的年龄，根据出生日期
            birthdate = child.birthdate
            if birthdate:
                today = datetime.date.today()
                # print(f'birthdate {birthdate}')
                age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
                child_item['age'] = str(age)
            child_item['gender'] = child.gender
            image_path = 'static/ImageBase/' + family.family_id + '+' + child.child_id
            image_list = os.listdir(image_path)
            child_item['imgSrc'] = host_url + f'{image_path}/' + image_list[0]
            children_list.append(child_item)
        return JsonResponse({'children_list': children_list})


def loadChildDetail(request):
    if request.method == 'GET':
        name = request.GET.get('name')
        child = Child.objects.get(name=name)
        child_item = {}
        child_item['name'] = child.name
        # 计算child相关的过去一年的每月的计划数量
        now = datetime.datetime.now()
        all_plans = Plan.objects.filter(children=child)
        child_item['plans'] = all_plans.__len__()
        # 获得不同icon的plan的数量
        all_icons = []
        for plan in all_plans:
            all_icons.append(plan.icon)
        all_icons = list(set(all_icons))
        icon_list = []
        for icon in all_icons:
            icon_item = {}
            icon_item['icon'] = icon
            icon_item['number'] = all_plans.filter(icon=icon).__len__()
            icon_list.append(icon_item)
        child_item['icon_list'] = icon_list

        # 事件
        all_events = Event.objects.filter(children=child)
        child_item['events'] = all_events.__len__()
        child_item['event_list'] = []
        for i in range(1, 13):
            count = all_events.filter(event_date__year=now.year, event_date__month=i).__len__()
            child_item['event_list'].append(count)

        # 获得不同tag的事件数量
        all_tags = []
        for event in all_events:
            all_tags += StringToList(event.tags)
        all_tags = list(set(all_tags))
        tag_list = []
        for tag in all_tags:
            tag_item = {}
            tag_item['tag'] = tag
            tag_item['number'] = all_events.filter(tags__icontains=tag).__len__()
            event_month = []
            for i in range(1, 13):
                count = all_events.filter(event_date__year=now.year, tags__icontains=tag, event_date__month=i).__len__()
                event_month.append(count)
            tag_item['month_count'] = event_month
            tag_list.append(tag_item)
        child_item['event_tag_list'] = tag_list

        # 文字
        all_texts = Text.objects.filter(children=child)
        child_item['texts'] = all_texts.__len__()
        # 获得不同tag的文字数量
        all_tags = []
        for text in all_texts:
            all_tags += StringToList(text.tags)
        all_tags = list(set(all_tags))
        tag_list = []
        for tag in all_tags:
            tag_item = {}
            tag_item['tag'] = tag
            tag_item['number'] = all_texts.filter(tags__icontains=tag).__len__()
            tag_list.append(tag_item)
        child_item['text_tag_list'] = tag_list

        print(f'child_item {child_item}')

        return JsonResponse({'child_item': child_item})


def addChild(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        openid = data.get('openid')
        now_user = User.objects.get(openid=openid)
        name = data.get('name')
        # 检查是否有这个孩子
        if Child.objects.filter(name=name).exists():
            print('Duplicate child name')
            return JsonResponse({'message': 'Duplicate child name'})
        birthdate = data.get('birthdate')
        gender = data.get('gender')
        # print(openid,name,birthdate)
        sha256 = hashlib.sha256()
        sha256.update(name.encode('utf-8'))
        sha256_hash = sha256.hexdigest()
        print(f'sha256_hash {sha256_hash}')
        new_child = Child.objects.create(family=now_user.family, name=name, child_id=str(sha256_hash),
                                         birthdate=birthdate, gender=gender)
        # print(str(sha256_hash))
        return JsonResponse({
            'message': 'Data submitted successfully',
            'child_id': sha256_hash
        })


def addChildImage(request):
    if request.method == 'POST':
        print('enter')
        uploaded_image = request.FILES.get('image')
        openid = request.POST.get('openid')
        child_id = request.POST.get('child_id')
        print(f'child_id: {child_id}')
        now_user = User.objects.get(openid=openid)
        family_id = now_user.family.family_id
        image_path = './static/ImageBase/' + f'{family_id}+{child_id}' + '/'
        if not os.path.exists(image_path):
            print(f'add child image folder: {image_path}')
            os.mkdir(image_path)
        # 删除原有的图片
        image_list = os.listdir(image_path)
        for image in image_list:
            os.remove(image_path + image)
        if uploaded_image:
            with open(image_path + f'{uploaded_image.name}', 'wb') as destination:
                for chunk in uploaded_image.chunks():
                    destination.write(chunk)
                print('success')
        return JsonResponse({'message': 'child profile image submitted successfully'})
    else:
        return JsonResponse({'message': 'please use POST'})


# todo: signature 替换成数据, 更新credit的计算方法
def getFamilyInfo(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        now_user = User.objects.get(openid=openid)
        family = now_user.family
        users = User.objects.filter(family=family)
        family_list = []
        for user in users:
            print(user.username, user.label)
            user_item = {}
            user_item['name'] = user.username
            user_item['label'] = user.label
            event_number = len(Event.objects.filter(user=user))
            plan_number = len(Plan.objects.filter(user=user))
            text_number = len(Text.objects.filter(user=user))
            credit = event_number * 5 + plan_number * 1 + text_number * 5
            user_item['signature'] = f'{user.label}的积分是{credit}分。'
            image_path = 'static/ImageBase/' + user.openid
            image_list = os.listdir(image_path)
            user_item['imgSrc'] = host_url + f'{image_path}/' + image_list[0]
            family_list.append(user_item)
        return JsonResponse({'family_list': family_list})


def generateDiary(request):
    if request.method == 'POST':
        print("in gene")
        data = json.loads(request.body)
        to_render_list = []
        event_text_list = data.get('list')
        for item in event_text_list:
            if item['type'] == "event":
                event_id = item['id']
                now_event = Event.objects.get(event_id=event_id)
                date_string = str(now_event.date)
                date_string = date_string[0:4] + '年' + date_string[5:7] + '月' + date_string[8:10] + '日'
                image_path = event_image_base_path + event_id
                image_list = sorted(os.listdir(image_path))
                to_render_list.append({
                    'title': now_event.title,
                    'content': now_event.content,
                    'date': date_string,
                    'event_id': event_id,
                    'imgList': image_list,
                    'type': 'event',
                })
            else:  # text
                text_id = item['id']
                now_event = Text.objects.get(text_id=text_id)
                date_string = str(now_event.date)
                date_string = date_string[0:4] + '年' + date_string[5:7] + '月' + date_string[8:10] + '日'
                to_render_list.append({
                    'title': now_event.title,
                    'content': now_event.content,
                    'date': date_string,
                    'type': 'text',
                })

        output_base = 'static/diary/' + data.get('openid') + '/'
        if not os.path.exists(output_base):
            os.mkdir(output_base)
        output_path = output_base + data.get('name') + '.pdf'
        
        GenerateDiaryPDF(event_list=to_render_list, cover_idx=data.get('cover_index'),
                         paper_idx=data.get('paper_index'), output_path=output_path)
        return JsonResponse({'msg': 'success'})
    return JsonResponse({'msg': 'POST only'})


# 进入日记本预览界面时，要生成最多5张的缩略图，便于用户查看效果。
def loadPDFThumbnail(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        pdf_name = request.GET.get('file_name')
        pdf_path = 'static/diary/' + openid + '/' + pdf_name + '.pdf'
        output_path = 'static/diary/' + openid + '/thumbnails/' + pdf_name + '/'
        # try:
        #     num, pages = GenerateThumbnail(pdf_path, output_path, max_page=5, resolution=50)
        # except Exception as e:
        #     return HttpResponse("Request failed", status=500)
        num, pages = GenerateThumbnail(pdf_path, output_path, max_page=5, resolution=50)
        thumbnail_list = [host_url + output_path + f'thumbnail_page_{i + 1}.jpg' for i in range(num)]
        return JsonResponse({'imageList': thumbnail_list, 'pageNum': pages})
    return JsonResponse({'msg': 'GET only'})


def generateDiaryLongImage(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        pdf_name = request.GET.get('file_name')
        pdf_path = 'static/diary/' + openid + '/' + pdf_name + '.pdf'
        output_path = 'static/diary/' + openid + '/' + pdf_name + '.jpg'
        GenerateLongImage(pdf_path, output_path, resolution=100)
        return JsonResponse({'long_image_url': host_url + output_path})
    return JsonResponse({'msg': 'GET only'})


def generateVideo(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        openid = data.get('openid')
        now_user = User.objects.get(openid=openid)
        label = now_user.label
        image_path_list = []
        event_text_list = data.get('list')
        video_title = data.get('name')
        audio_index = data.get('audio_index')
        for item in event_text_list:
            if item['type'] == "event":
                event_id = item['id']
                now_event = Event.objects.get(event_id=event_id)
                date_string = str(now_event.date)
                date_string = date_string[0:4] + '年' + date_string[5:7] + '月' + date_string[8:10] + '日'
                image_path = event_image_base_path + event_id
                print(f"image_path {image_path}")
                print(f'os.list: {os.listdir(image_path)}')
                for path in os.listdir(image_path):
                    # print(f'path {path}')
                    image_path_list.append(image_path + '/' + path)
                # image_list = sorted(os.listdir(image_path))
                # to_render_list.append({
                #     'title':now_event.title,
                #     'content':now_event.content,
                #     'date':date_string,
                #     'event_id':event_id,
                #     'imgList':image_list,
                #     'type':'event',
                # })
                # image_path_list.append(image_list)
        # print(image_path_list)
        GenerateVideo(image_path_list, audio_index, video_title, label, openid)


    return JsonResponse({'msg': 'POST only'})


def loadVideoThumbnail(request, openid, video_title):
    # if request.method == 'METHOD':
    try:
        # openid = request.GET.get('openid')
        # video_title=request.GET.get('video_title')
        print(video_title, openid)

        video_path = 'static/video/' + str(openid) + '/' + video_title + '.mp4'
        output_path = 'static/video/' + str(openid) + '/thumbnails/' + video_title + '/'
        # 获取服务器上视频的路径，然后把视频传到前端

        return FileResponse(open(video_path, 'rb'))
    except:
        return HttpResponse("Request failed", status=500)


def loadTimelinePage(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        types = request.GET.get('types', "etd")  # 缺省值为event&text&data
        used_by_addEvent_page = (request.GET.get('tags', "false") == "true")
        now_user = User.objects.get(openid=openid)
        # 这里的Event将来应当替换成基类BaseRecord
        now_user_blocks_events = Event.objects.filter(user__family=now_user.family).order_by("-date",
                                                                              "-time") if 'e' in types else []  # 筛选的结果按照降序排列
        now_user_blocks = sorted(list(now_user_blocks_events),
                                 key=lambda x: (x.date, x.time), reverse=True)
        print(now_user_blocks.__len__())
        blocks_list = []
        for db_block in now_user_blocks:
            block_item = {}
            block_item['type'] = db_block.record_type
            block_item['title'] = db_block.title

            if used_by_addEvent_page:
                block_item['tags'] = StringToList(db_block.tags)
            else:
                block_item['content'] = db_block.content
                block_item['author'] = db_block.user.label  # 爸爸、妈妈、大壮、奶奶
                date_string = str(db_block.date)
                block_item['month'] = str(int(date_string[5:7])) + "月"
                block_item['year'] = date_string[0:4]
                block_item['day'] = date_string[8:10]
                block_item['event_date'] = str(db_block.event_date)

            if db_block.record_type == 'event':  # 检查是否与子类A相关if
                block_item['event_id'] = db_block.event_id
                image_path = 'static/ImageBase/' + db_block.event_id
                thumnail_path = 'static/Thumbnail/' + db_block.event_id
                image_list = sorted(os.listdir(image_path))
                if not os.path.exists(f'{thumnail_path}/' + image_list[0]):
                    GenerateEventThumnail(src_path=f'{image_path}/' + image_list[0],dest_path= f'{thumnail_path}/', image_name= image_list[0], target_width=300)
                block_item['imgSrc'] = host_url + f'{thumnail_path}/' + image_list[0]


            if db_block.record_type == 'data':
                block_item['data_id'] = db_block.data_id

            elif db_block.record_type == 'text':
                block_item['text_id'] = db_block.text_id

            blocks_list.append(block_item)

        # print(blocks_list)
        return JsonResponse({'blocks_list': blocks_list})

def loadData(request):
    if request.method == 'GET':
        openid = request.GET.get('openid')
        now_user = User.objects.get(openid=openid)
        family = now_user.family
        children = Child.objects.filter(family=family)
        keyList = list(Record.objects.filter(user__family=now_user.family).values_list('key', flat=True).distinct())
        data_item = {} # 返回的数据{小明: child_data, 小红:child_data}} 
        print(keyList)
        print(children)
        for child in children:
            child_data = [] # 保存一个孩子的所有数据 [{key:身高, list:[{value:,date:},{value:,date:}]},child_key_data]
            for key in keyList:
                child_key_data = {} # 保存一个孩子一个key的所有数据 {key:身高, list:[{value:,date:},{value:,date:}]
                child_key_data['key'] = key
                value_date_list = []
                record_list = list(Record.objects.filter(key=key,children=child))
                print(child,key,record_list)
                for record in record_list:
                    value_date_item = {}
                    value_date_item['value'] = record.value
                    value_date_item['date'] = record.date
                    value_date_item['time'] = record.date.strftime('%Y-%m-%d') + 'T' + record.time.strftime('%H:%M:%S')
                    print( value_date_item['time'])
                    value_date_list.append(value_date_item)
                child_key_data['list'] = value_date_list
                if(record_list.__len__()):
                    child_data.append(child_key_data)

            data_item[child.name] = child_data
     
        print(f'data_item {data_item}')

        return JsonResponse({'data_item': data_item})
