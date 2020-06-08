#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import requests
from celery import task
import time
from multiprocessing.dummy import Pool as pool

import pymongo
from bson.objectid import ObjectId
# celery -A imtepr worker -l info  启动

@task
def task_add(x, y):
  print(x + y)
  return x+y


@task
def taskStudentsImport(id, year, path, taskFile):
  # time.sleep(50)
  try:
    studentList = []  # 分块处理学生数据
    for studentsPart in parseJson(f'/Users/ldl/Desktop/lunwen/code/imtepr/{path}', id, year, taskFile):
      studentList.append(studentsPart)
    # 多线程插入更新
    pool_obj = pool(5)
    pool_obj.map(insertStudentMongo, studentList, )
    pool_obj.close()
    pool_obj.join()
    return 'SUCCESS'
  except Exception as e:
    print(e)
    print(e)
    return 'FAILURE'


def parseJson(path, id, year, taskFile):
  f = open(path, encoding='utf-8')
  studentList = json.load(f)
  studentIter = iter(studentList)

  # 使用生成器每次最多处理100条数据
  while True:
    students = []
    for i in range(200):
      try:
        student = next(studentIter)
        student['sid'] = ObjectId(id)
        student['year'] = int(year)
        student['taskFile'] = str(taskFile)
        students.append(student)
      except StopIteration:
        yield students
        return
    yield students


def insertStudentMongo(students):
  client = pymongo.MongoClient('mongodb://127.0.0.1:27017/')
  col = client["test"]["student"]
  for student in students:
    col.update_one({'originalId': student['originalId'], 'sid': student['sid'], 'year': student['year']}, {"$set": student}, True)
  client.close()


if __name__ == '__main__':
  import datetime
  import time
  starttime = datetime.datetime.now()
  taskStudentsImport("5eacd00fd004cf21da831cdf", "2018", "1.json")
  endtime = datetime.datetime.now()

  print((endtime - starttime).seconds)

  # import os
  #
  # file_path = "test.py"
  # (filepath, tempfilename) = os.path.split(file_path)
  # (filename, _) = os.path.splitext(tempfilename)
  # print(filepath, tempfilename, filename, extension)
  