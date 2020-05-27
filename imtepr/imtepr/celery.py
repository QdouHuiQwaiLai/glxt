#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
@author: yinzhuoqun
@site: http://zhuoqun.info/
@email: yin@zhuoqun.info
@time: 2019/12/14 17:21
"""
from __future__ import absolute_import, unicode_literals
from celery import Celery
from django.conf import settings
import os

# 获取当前文件夹名，即为该 Django 的项目名
project_name = os.path.split(os.path.abspath('.'))[-1]
project_settings = '%s.settings' % project_name

# 设置环境变量
os.environ.setdefault('DJANGO_SETTINGS_MODULE', project_settings)

# 实例化 Celery
app = Celery(project_name)

# 使用 django 的 settings 文件配置 celery
app.config_from_object('django.conf:settings')

# Celery 加载所有注册的应用
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


if __name__ == '__main__':
  print(os.path.split(os.path.abspath('.'))[-1])
