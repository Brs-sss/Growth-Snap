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

    # 还需要添加：上传个人头像
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
    
    # 还需要添加：加载具体页面，loadKeys
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
                'event_data': '2023-11-11',
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

    # 目前功能完善       
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

    def test_child(self):
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

if __name__ == '__main__':
    unittest.main()
