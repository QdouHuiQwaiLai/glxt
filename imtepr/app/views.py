from django.shortcuts import render

# Create your views here.
import json
from django.http import HttpResponse
from .tasks import task_add, taskStudentsImport
from celery.result import AsyncResult
import os
# from celery.task.control import revoke


def hello(request):
  a, b, = task_add.delay(4, 8)
  return HttpResponse(a, b,)


def importStudents(request):
  # 获取参数
  id = request.GET.get("id", "")
  year = request.GET.get("year", "")
  path = request.GET.get("path", "")
  if "" in (id, year, path):
    return HttpResponse(json.dumps({"code": 1,"message": "参数错误",}), content_type="application/json")
  (taskFile, _) = os.path.splitext(path)  # 获取文件名
  # 开启任务
  try:
    taskId = taskStudentsImport.delay(id, year, path, taskFile)
    return HttpResponse(json.dumps({
      "code": 0,
      "message": "OK",
      "data": {
        "taskId": str(taskId),
        "taskFile": str(taskFile)
      }
    }), content_type="application/json")
  except Exception as e:
    return HttpResponse(json.dumps({"code": 2, "message": "任务开启失败", }), content_type="application/json")
  

def getImportStudentsProgress(request):
  # 获取参数
  id = request.GET.get("id", "")
  if id == "":
    return HttpResponse(json.dumps({"code": 1,"message": "参数错误",}), content_type="application/json")
  print(id)
  try:
    state = AsyncResult(id).state
    print(state)
    
    if state == 'FAILURE' or state == 'REVOKED':
      return HttpResponse(json.dumps({"code": 2, "message": "任务失败", }), content_type="application/json")
    if state == 'SUCCESS':
      if AsyncResult(id).get() == 'SUCCESS':
        return HttpResponse(json.dumps({"code": 0, "message": "OK",}), content_type="application/json")
      else:
        return HttpResponse(json.dumps({"code": 3, "message": "执行失败", }), content_type="application/json")
    else:
      return HttpResponse(json.dumps({"code": 0, "message": "正在执行", }), content_type="application/json")
  except Exception as e:
    return HttpResponse(json.dumps({"code": 4, "message": "获取异常", }), content_type="application/json")
  


