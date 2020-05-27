from collections import OrderedDict
import json


def parseProvince(province):
  if province == "11": return 0
  if province == "12": return 1
  if province == "13": return 2
  if province == "14": return 3
  if province == "15": return 4
  if province == "21": return 5
  if province == "22": return 6
  if province == "23": return 7
  if province == "31": return 8
  if province == "32": return 9
  if province == "33": return 10
  if province == "34": return 11
  if province == "35": return 12
  if province == "36": return 13
  if province == "37": return 14
  if province == "41": return 15
  if province == "42": return 16
  if province == "43": return 17
  if province == "44": return 18
  if province == "45": return 19
  if province == "46": return 20
  if province == "50": return 21
  if province == "51": return 22
  if province == "52": return 23
  if province == "53": return 24
  if province == "54": return 25
  if province == "61": return 26
  if province == "62": return 27
  if province == "63": return 28
  if province == "64": return 29
  if province == "65": return 30
  pass

def parseBranch(branch):
  if branch == "0" or branch == "Z": return 0  # 综合改革
  if branch == "1": return 1  # 文史
  if branch == "4": return 2  # 艺术
  if branch == "5": return 3  # 理工
  if branch == "9": return 4  # 对口高职
  if branch == "a": return 5  # 单独考试
  
  
def getList(cursor, sql):
  list = []
  cursor.execute(sql)
  row = cursor.fetchone()
  while row:
    list.append(row[1])
    row = cursor.fetchone()
  return list


def getProfessionList(cursor, sql):
  list = []
  cursor.execute(sql)
  row = cursor.fetchone()
  while row:
    list.append({
      'name': row[1],
      'parent': int(row[2]) - 1
    }
    )
    row = cursor.fetchone()
  return list

def getSchemeList(cursor, sql):
  list = []
  cursor.execute(sql)
  row = cursor.fetchone()
  while row:
    if (parseProvince(row[0]) != None):
      if (row[4] != None):
        list.append({
          'province': parseProvince(row[0]),
          'profession': int(row[1]) - 1,
          'num': int(row[2]),
          'branch': parseBranch(row[3]),
          'fullNum': int(row[4]),
        })
      else:
        list.append({
          'province': parseProvince(row[0]),
          'profession': int(row[1]) - 1,
          'num': int(row[2]),
          'branch': parseBranch(row[3]),
          'fullNumber': 0,
        })
    row = cursor.fetchone()
  return list

def saveSchoolData(cursor, name, year):
  school = OrderedDict()
  # school['name'] = "重庆科技学院"
  # school['year'] = 2018
  # 获取 科类
  school['branch'] = getList(cursor, 'select kldm as num, klmc as name from td_kldm')
  # 获取 计划性质
  school['plan'] = getList(cursor, 'select jhxzdm as num, jhxzmc as name from td_jhxzdm')
  # 获取 语言总类
  school['language'] = getList(cursor, 'select wyyzdm as num ,wyyzmc as name from td_wyyzdm')
  # 获取 政治面貌
  school['political'] = getList(cursor, 'select zzmmdm as num ,zzmmmc as name from td_zzmmdm')
  # 获取 特征
  school['feature'] = getList(cursor, 'select tzdm as num,tzmc as name from td_tzdm')
  # 获取 学院
  school['department'] = getList(cursor, 'select xdm as num, xmc as name from td_xdm')
  # 获取 专业
  school['profession'] = getProfessionList(cursor, 'select zydh as num, zymc as name, xdm as parent  from td_zydm')
  # 获取 招生计划
  school['scheme'] = getSchemeList(cursor, 'select sfdm as province, zydh as profession, jhs as num, kldm as branch, zy1tbs as fullNumber  from t_zsjh')
  # print(json.dumps(school, ensure_ascii=False))
  
  with open(f'./output/school_{year}.json', 'w') as json_file:
    json_file.write(json.dumps(school, ensure_ascii=False))
  # conn.close()
  
  pass
  
if __name__ == '__main__':
  pass