import unittest

from django.test import TestCase
from django.urls import reverse

from user.models import Family, User, Child, Event
import user.views as user_view


class TestRegister(TestCase):
    def setUp(self):
        self.valid_code = '0f37GZ000FfdeR183E20097KRl37GZ0Q'
        self.openid = 'randomly_generated_ajksilkdnf'
        self.openid_another = 'randomly_generated_oadhfoaisnu'

    def test_register(self):
        # 未注册直接登陆
        response = self.client.post(
            reverse(user_view.login),
            data={
                'code': self.valid_code,
            },
            content_type='application/json'
        )
        json = response.json()
        self.assertEqual(json['exists'], 'false')

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
        json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json['msg'], 'family does not exist')

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
        json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json['msg'], 'register success')

        # 生成家庭token
        response = self.client.post(
            reverse(user_view.generateFamilyToken),
            data={
                'openid': self.openid,
            },
            content_type='application/json'
        )
        json = response.json()
        self.assertEqual(response.status_code, 200)
        self.curToken = json['token']

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
        json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json['msg'], 'username already exists')

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
        json = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json['msg'], 'register success')


if __name__ == '__main__':
    unittest.main()
