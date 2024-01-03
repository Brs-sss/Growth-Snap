import unittest

from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
import json

import user.views as user_view


class Tests(TestCase):
    def setUp(self):
        self.valid_code = '0f37GZ000FfdeR183E20097KRl37GZ0Q'
        self.openid = 'manually_randomly_generated_ajksilkdnfu'
        self.openid_another = 'manually_randomly_generated_oadhfoaisnu'
        
        self.event_id = 'manually_randomly_generated_asjfbooqfno'
        self.text_id = 'manually_randomly_generated_wfqinfodnla'
        self.data_id = 'manually_randomly_generated_paiqfnpqnvm'

        self.todo_id_1 = 'manually_randomly_generated_rwinmqpocony'
        self.todo_id_2 = 'manually_randomly_generated_pmoniacbqjke'
        self.todo_id_3 = 'manually_randomly_generated_hogsibommvli'

    # 测试注册功能模块
    def test_register(self):
        # 未注册直接登陆
        response = self.client.post(
            reverse(user_view.login),
            data={
                'code': self.valid_code,
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(res_json['exists'], 'false')

        # 添加用户头像
        img_path = './user/res/test.png'
        with open(img_path, 'rb') as img:
            response = self.client.post(
                reverse(user_view.registerProfileImage),
                data={
                    'openid': self.openid,
                    'image': img
                }
            )
            res_json = response.json()
            self.assertEqual(res_json['message'], 'profile image submitted successfully')


        # 进行注册，token错误
        response = self.client.post(
            reverse(user_view.register),
            data={
                'username': "test user",
                'label': "test label",
                'openid': self.openid,
                'token': "000000"
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['msg'], 'family does not exist')

        # 进行注册，token为新建家庭
        response = self.client.post(
            reverse(user_view.register),
            data={
                'username': "test user",
                'label': "test label",
                'openid': self.openid,
                'token': "new_family"
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['msg'], 'register success')

        # 获取家庭id
        response = self.client.get(
            reverse(user_view.getFamilyID),
            data={
                'openid': self.openid
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.family_id = res_json['family_id']

        # 生成家庭token
        response = self.client.post(
            reverse(user_view.generateFamilyToken),
            data={
                'openid': self.openid,
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.curToken = res_json['token']

        # 获取家庭token
        response = self.client.get(
            reverse(user_view.getFamilyToken),
            data={
                'openid': self.openid,
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['token'], self.curToken)
        self.assertEqual(res_json['code'], 'valid')

        # 重复注册
        response = self.client.post(
            reverse(user_view.register),
            data={
                'username': "test user",
                'label': "test label",
                'openid': self.openid,
                'token': self.curToken
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['msg'], 'username already exists')

        # 注册同一家庭新用户
        response = self.client.post(
            reverse(user_view.register),
            data={
                'username': "test user 2",
                'label': "test label 2",
                'openid': self.openid_another,
                'token': self.curToken
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['msg'], 'register success')
    
    # 测试上传、加载模块
    def test_upload_and_load(self):
        # 用户注册
        response = self.client.post(
            reverse(user_view.register),
            data={
                'username': "test user",
                'label': "test label",
                'openid': self.openid,
                'token': "new_family"
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['msg'], 'register success')

        # 上传事件
        response = self.client.post(
            reverse(user_view.submitEvent),
            data={
                'openid': self.openid,
                'event_id': self.event_id,
                'event_date': '2023-11-11',
                'date': '2023-11-11',
                'time': '12:00:00',
                'title': 'test submit event',
                'content': 'test submit event',
                'tags': [{'info': 'test', 'checked': True}, {'info': 'real', 'checked': False}],
                'children': [],
                'author': 'test user',
                'type': 'event',
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Data submitted successfully')

        # 上传事件对应图片
        img_path = './user/res/test.png'
        with open(img_path, 'rb') as img:
            response = self.client.post(
                reverse(user_view.addEventImage),
                data={
                    'event_id': self.event_id,
                    'pic_index': 0,
                    'type': 'event',
                    'image': img
                }
            )
            res_json = response.json()
            self.assertEqual(response.status_code, 200)
            self.assertEqual(res_json['message'], 'File uploaded successfully')

        from time import sleep
        sleep(0.5)

        # 上传文本
        response = self.client.post(
            reverse(user_view.submitEvent),
            data={
                'openid': self.openid,
                'event_id': self.text_id,
                'event_date': '2023-11-11',
                'date': '2023-11-10',
                'time': '12:00:00',
                'title': 'test submit text',
                'content': 'test submit text',
                'tags': [{'info': 'test', 'checked': True}, {'info': 'real', 'checked': False}],
                'children': [],
                'author': 'test user',
                'type': 'text',
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Data submitted successfully')

        # 上传数据
        response = self.client.post(
            reverse(user_view.submitData),
            data={
                'openid': self.openid,
                'data_id': self.data_id,
                'date': '2023-11-12',
                'time': '12:00:00',
                'title': 'test submit event',
                'records': json.dumps([{'key':'test_v1', 'value':'1'}, {'key':'test_v2', 'value':'2'}]),
                'children': [],
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Data submitted successfully')

        # 获取用户信息
        response = self.client.get(
            reverse(user_view.getUserInfo),
            data={
                'openid': self.openid,
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['event_number'], 1)
        self.assertEqual(res_json['text_number'], 1)
        self.assertEqual(res_json['plan_number'], 0)

        # 获取已上传内容
        response = self.client.get(
            reverse(user_view.loadShowPage),
            data={
                'openid': self.openid,
                'start': 0,
                'delta': 'all',
                'types': 'etd',
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['blocks_list'].__len__(), 3)
        self.assertEqual(res_json['blocks_list'][0]['day'], '12')
        self.assertEqual(res_json['blocks_list'][1]['day'], '11')
        self.assertEqual(res_json['blocks_list'][2]['day'], '10')

        # 进行搜索
        response = self.client.get(
            reverse(user_view.loadSearchPage),
            data={
                'openid': self.openid,
                'searchKey': 'test'
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(res_json['blocks_list'].__len__(), 2)


        # 加载具体事件页面
        response = self.client.get(
            reverse(user_view.loadEventDetail),
            data={
                'event_id': self.event_id
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(res_json['block_item']['title'], 'test submit event')

        # 加载具体文本页面
        response = self.client.get(
            reverse(user_view.loadTextDetail),
            data={
                'text_id': self.text_id
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(res_json['block_item']['title'], 'test submit text')

        # 加载具体数据页面
        response = self.client.get(
            reverse(user_view.loadDataDetail),
            data={
                'data_id': self.data_id
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(res_json['data_item']['records'], [{'key': 'test_v1', 'value': '1'}, {'key': 'test_v2', 'value': '2'}])

        # 获取当前已有键值
        response = self.client.get(
            reverse(user_view.getKeys),
            data={
                'openid': self.openid
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(res_json['keyList'], ['test_v1', 'test_v2'])

        # 删除事件
        response = self.client.get(
            reverse(user_view.deleteEvent),
            data={
                'event_id': self.event_id,
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['msg'], 'ok')

        # 检查删除
        response = self.client.get(
            reverse(user_view.loadShowPage),
            data={
                'openid': self.openid,
                'start': 0,
                'delta': 'all',
                'types': 'etd',
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['blocks_list'].__len__(), 2)

        # 删除文本
        response = self.client.get(
            reverse(user_view.deleteText),
            data={
                'text_id': self.text_id,
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['msg'], 'ok')

        # 检查删除
        response = self.client.get(
            reverse(user_view.loadShowPage),
            data={
                'openid': self.openid,
                'start': 0,
                'delta': 'all',
                'types': 'etd',
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['blocks_list'].__len__(), 1)

        # 删除数据
        response = self.client.get(
            reverse(user_view.deleteData),
            data={
                'data_id': self.data_id,
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['msg'], 'ok')

        # 检查删除
        response = self.client.get(
            reverse(user_view.loadShowPage),
            data={
                'openid': self.openid,
                'start': 0,
                'delta': 'all',
                'types': 'etd',
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['blocks_list'].__len__(), 0)

        # 上传文本
        response = self.client.post(
            reverse(user_view.submitEvent),
            data={
                'openid': self.openid,
                'event_id': self.text_id,
                'event_date': '2023-11-11',
                'date': '2023-11-11',
                'time': '12:00:00',
                'title': 'test submit text again',
                'content': 'test submit text again',
                'tags': [{'info': 'test', 'checked': True}, {'info': 'again', 'checked': True}],
                'children': [],
                'author': 'test user',
                'type': 'text',
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Data submitted successfully')

        # 检查二次上传
        response = self.client.get(
            reverse(user_view.loadShowPage),
            data={
                'openid': self.openid,
                'start': 0,
                'delta': 'all',
                'types': 'etd',
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['blocks_list'].__len__(), 1)
        self.assertEqual(res_json['blocks_list'][0], 
                         {'type': 'text', 
                          'title': 'test submit text again', 
                          'content': 'test submit text again', 
                          'author': 'test label', 'month': '11月', 
                          'year': '2023', 'day': '11', 'text_id': 
                          'manually_randomly_generated_wfqinfodnla'})

    # 测试计划模块
    def test_plan(self):
        # 用户注册
        response = self.client.post(
            reverse(user_view.register),
            data={
                'username': "test user",
                'label': "test label",
                'openid': self.openid,
                'token': "new_family"
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['msg'], 'register success')

        # 创建计划
        response = self.client.post(
            reverse(user_view.addPlan),
            data={
                'openid': self.openid,
                'title': 'test plan',
                'icon': '',
                'child': []
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Successfully added plan')

        # 创建重名计划
        response = self.client.post(
            reverse(user_view.addPlan),
            data={
                'openid': self.openid,
                'title': 'test plan',
                'icon': '',
                'child': []
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Duplicate plan name')

        # 为上述计划新建两个TODO
        from datetime import datetime, timedelta
        today = datetime.today()
        tomorrow = today + timedelta(days=1)
        late = today + timedelta(days=10)
        formatted_today = today.strftime("%Y-%m-%d")
        formatted_tomorrow = tomorrow.strftime("%Y-%m-%d")
        formatted_late = late.strftime("%Y-%m-%d")

        response = self.client.post(
            reverse(user_view.addTodo),
            data={
                'openid': self.openid,
                'planTitle': 'test plan',
                'title': 'test todo 1',
                'deadline': formatted_tomorrow,
                'id': self.todo_id_1,
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Successfully added todo')

        response = self.client.post(
            reverse(user_view.addTodo),
            data={
                'openid': self.openid,
                'planTitle': 'test plan',
                'title': 'test todo 2',
                'deadline': formatted_late,
                'id': self.todo_id_2,
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Successfully added todo')

        # 创建另一计划
        response = self.client.post(
            reverse(user_view.addPlan),
            data={
                'openid': self.openid,
                'title': 'test plan another',
                'icon': '',
                'child': []
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Successfully added plan')

        # 为上述计划新建TODO
        response = self.client.post(
            reverse(user_view.addTodo),
            data={
                'openid': self.openid,
                'planTitle': 'test plan another',
                'title': 'test todo 3',
                'deadline': formatted_today,
                'id': self.todo_id_3,
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Successfully added todo')

        # 加载计划页面
        response = self.client.get(
            reverse(user_view.loadPlanMain),
            data={
                'openid': self.openid
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['finished_todo_list'].__len__(), 0)
        self.assertEqual(res_json['not_finished_todo_list'].__len__(), 2)
        self.assertEqual(res_json['plan_list'].__len__(), 2)

        # 加载全部计划
        response = self.client.get(
            reverse(user_view.loadAllPlanPage),
            data={
                'openid': self.openid
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['plan_list'].__len__(), 2)
        self.assertEqual(res_json['plan_list'][0]['title'], 'test plan')
        self.assertEqual(res_json['plan_list'][1]['title'], 'test plan another')

        # 加载具体计划页面
        response = self.client.get(
            reverse(user_view.loadCertainPlan),
            data={
                'openid': self.openid,
                'plan': 'test plan'
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['todos'].__len__(), 2)
        self.assertEqual(res_json['todos'][0]['task'], 'test todo 1')
        self.assertEqual(res_json['todos'][1]['task'], 'test todo 2')

        # 更新todo状态
        response = self.client.post(
            reverse(user_view.updateTodo),
            data={
                'openid': self.openid,
                'id': self.todo_id_1,
                'content': 'finish',
                'finish': True
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Successfully updated todo')

        response = self.client.post(
            reverse(user_view.updateTodo),
            data={
                'openid': self.openid,
                'id': self.todo_id_2,
                'content': 'ddl',
                'ddl': formatted_today
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Successfully updated todo')

        # 检查更改结果
        response = self.client.get(
            reverse(user_view.loadCertainPlan),
            data={
                'openid': self.openid,
                'plan': 'test plan'
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['todos'].__len__(), 2)
        self.assertEqual(res_json['todos'][0]['task'], 'test todo 2')
        self.assertEqual(res_json['todos'][0]['ddl'], formatted_today)
        self.assertEqual(res_json['todos'][1]['task'], 'test todo 1')
        self.assertEqual(res_json['todos'][1]['check'], True)

        # 删除todo
        response = self.client.post(
            reverse(user_view.updateTodo),
            data={
                'openid': self.openid,
                'id': self.todo_id_3,
                'content': 'delete',
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Successfully updated todo')

        # 检查删除结果
        response = self.client.get(
            reverse(user_view.loadCertainPlan),
            data={
                'openid': self.openid,
                'plan': 'test plan another'
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['todos'].__len__(), 0)

        # 删除计划
        response = self.client.post(
            reverse(user_view.deletePlan),
            data={
                'openid': self.openid,
                'planTitle': 'test plan another'
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'ok')

        # 检查删除情况
        response = self.client.get(
            reverse(user_view.loadPlanMain),
            data={
                'openid': self.openid
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['finished_todo_list'].__len__(), 1)
        self.assertEqual(res_json['not_finished_todo_list'].__len__(), 1)
        self.assertEqual(res_json['plan_list'].__len__(), 1)

    # 测试家庭、孩子模块
    def test_family_and_child(self):
        # 用户注册
        response = self.client.post(
            reverse(user_view.register),
            data={
                'username': "test user",
                'label': "test label",
                'openid': self.openid,
                'token': "new_family"
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['msg'], 'register success')

        # 创建孩子
        response = self.client.post(
            reverse(user_view.addChild),
            data={
                'openid': self.openid,
                'name': 'test child',
                'birthdate': '2020-11-11',
                'gender': '男'
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Data submitted successfully')
        self.child_id = res_json['child_id']

        # 添加孩子头像
        img_path = './user/res/test.png'
        with open(img_path, 'rb') as img:
            response = self.client.post(
                reverse(user_view.addChildImage),
                data={
                    'openid': self.openid,
                    'child_id': self.child_id,
                    'image': img
                }
            )
            res_json = response.json()
            self.assertEqual(res_json['message'], 'child profile image submitted successfully')

        from time import sleep
        sleep(0.5)

        # 为孩子上传事件
        response = self.client.post(
            reverse(user_view.submitEvent),
            data={
                'openid': self.openid,
                'event_id': self.event_id,
                'event_data': '2023-11-11',
                'date': '2023-11-11',
                'time': '12:00:00',
                'title': 'test submit event',
                'content': 'test submit event',
                'tags': [{'info': 'test', 'checked': True}, {'info': 'real', 'checked': False}],
                'children': ['test child'],
                'author': 'test user',
                'type': 'event',
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Data submitted successfully')

        # 为孩子上传文本记录
        response = self.client.post(
            reverse(user_view.submitEvent),
            data={
                'openid': self.openid,
                'event_id': self.text_id,
                'event_date': '2023-11-11',
                'date': '2023-11-10',
                'time': '12:00:00',
                'title': 'test submit text',
                'content': 'test submit text',
                'tags': [{'info': 'test', 'checked': True}, {'info': 'real', 'checked': False}],
                'children': ['test child'],
                'author': 'test user',
                'type': 'text',
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Data submitted successfully')

        # 为孩子上传计划
        response = self.client.post(
            reverse(user_view.addPlan),
            data={
                'openid': self.openid,
                'title': 'test plan',
                'icon': '',
                'child': ['test child']
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Successfully added plan')

        # 获取家庭信息
        response = self.client.get(
            reverse(user_view.getFamilyInfo),
            data={
                'openid': self.openid,
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['family_list'].__len__(), 1)
        self.assertEqual(res_json['family_list'][0]['name'], 'test user')
        self.assertEqual(res_json['family_list'][0]['signature'], 'test label的积分是11分。')

        # 获取孩子信息
        response = self.client.get(
            reverse(user_view.getChildrenInfo),
            data={
                'openid': self.openid,
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['children_list'].__len__(), 1)
        self.assertEqual(res_json['children_list'][0]['name'], 'test child')
        self.assertEqual(res_json['children_list'][0]['age'], '3')

        # 加载孩子具体页面
        response = self.client.get(
            reverse(user_view.loadChildDetail),
            data={
                'name': 'test child'
            },
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        child_info = response.json()['child_item']
        self.assertEqual(child_info['plans'], 1)
        self.assertEqual(child_info['icon_list'], [{'icon':'', 'number':1}])
        self.assertEqual(child_info['events'], 1)
        self.assertEqual(child_info['event_list'], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        self.assertEqual(child_info['event_tag_list'], [{'tag': 'test', 'number': 1, 'month_count': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}])
        self.assertEqual(child_info['texts'], 1)
        self.assertEqual(child_info['text_tag_list'], [{'tag': 'test', 'number': 1}])

    # 测试生成模块
    def test_generate(self):
        # 用户注册
        response = self.client.post(
            reverse(user_view.register),
            data={
                'username': "test user",
                'label': "test label",
                'openid': self.openid,
                'token': "new_family"
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['msg'], 'register success')

        # 创建孩子
        response = self.client.post(
            reverse(user_view.addChild),
            data={
                'openid': self.openid,
                'name': 'test child',
                'birthdate': '2020-11-11',
                'gender': '男'
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Data submitted successfully')
        self.child_id = res_json['child_id']

        # 添加孩子头像
        img_path = './user/res/test.png'
        with open(img_path, 'rb') as img:
            response = self.client.post(
                reverse(user_view.addChildImage),
                data={
                    'openid': self.openid,
                    'child_id': self.child_id,
                    'image': img
                }
            )
            res_json = response.json()
            self.assertEqual(res_json['message'], 'child profile image submitted successfully')

        # 上传事件
        response = self.client.post(
            reverse(user_view.submitEvent),
            data={
                'openid': self.openid,
                'event_id': self.event_id,
                'event_date': '2023-11-11',
                'date': '2023-11-11',
                'time': '12:00:00',
                'title': 'test submit event',
                'content': 'test submit event',
                'tags': [{'info': 'test', 'checked': True}, {'info': 'real', 'checked': False}],
                'children': ['test child'],
                'author': 'test user',
                'type': 'event',
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Data submitted successfully')

        # 上传事件对应图片
        img_path = './user/res/test.png'
        with open(img_path, 'rb') as img:
            response = self.client.post(
                reverse(user_view.addEventImage),
                data={
                    'event_id': self.event_id,
                    'pic_index': 0,
                    'type': 'event',
                    'image': img
                }
            )
            res_json = response.json()
            self.assertEqual(response.status_code, 200)
            self.assertEqual(res_json['message'], 'File uploaded successfully')

        from time import sleep
        sleep(0.5)

        # 上传数据
        response = self.client.post(
            reverse(user_view.submitData),
            data={
                'openid': self.openid,
                'data_id': self.data_id,
                'date': '2023-11-12',
                'time': '12:00:00',
                'title': 'test submit event',
                'records': json.dumps([{'key':'test_v1', 'value':'1'}, {'key':'test_v2', 'value':'2'}]),
                'children': ['test child'],
            },  
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res_json['message'], 'Data submitted successfully')

        # 日记本、小视频涉及环境配置，省略

        # 测试时间轴
        response = self.client.get(
            reverse(user_view.loadTimelinePage),
            data={
                'openid': self.openid,
                'tags': []
            },
            content_type='application/json'
        )
        res_json = response.json()
        print(res_json)

        # 测试图表
        response = self.client.get(
            reverse(user_view.loadData),
            data={
                'openid': self.openid,
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(res_json['data_item']['test child'][0]['key'], 'test_v1')
        self.assertEqual(res_json['data_item']['test child'][0]['list'][0]['value'], 1.0)
        self.assertEqual(res_json['data_item']['test child'][1]['key'], 'test_v2')
        self.assertEqual(res_json['data_item']['test child'][1]['list'][0]['value'], 2.0)
        
    # 测试工具函数
    def test_tools(self):
        # 获取活动id
        response = self.client.get(
            reverse(user_view.getActivityID)
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        self.activity_id = res_json['activity_id']

        # 生成SHA键值
        text = 'testing generating SHA256'
        response = self.client.get(
            reverse(user_view.getSHA256),
            data={
                'text': text
            },
            content_type='application/json'
        )
        res_json = response.json()
        self.assertEqual(response.status_code, 200)
        import hashlib
        sha256 = hashlib.sha256()
        sha256.update(text.encode('utf-8'))
        sha256_hash = sha256.hexdigest()
        self.assertEqual(res_json['sha256'], sha256_hash)
        
            
if __name__ == '__main__':
    unittest.main()
