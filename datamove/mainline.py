import pymssql
import saveSchool
import json
from collections import OrderedDict
from saveSchool import saveSchoolData
from saveStudent import saveStudentData

serverName = '127.0.0.1'
userName = 'sa'
passWord = '@Uat2019'


# cursor = pymssql.connect(serverName , userName , passWord, "Shoppp").cursor()
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



def getLine(cursor):
  cursor.execute("""
   select * from tr_fsf
   """)
  line = {
    'a': {},
    'b': {},
    'c': {}
  }
  row = cursor.fetchone()
  while row:
    # print(row[2])
    if row[0] == '00':
      line['a'][parseProvince(row[1])] = row[2]
    elif row[0] == '10':
      line['b'][parseProvince(row[1])] = row[2]
    elif row[0] == '50':
      line['c'][parseProvince(row[1])] = row[2]
    row = cursor.fetchone()
  print(line)
  return line


# getLine(pymssql.connect(serverName, userName, passWord, "Shopp").cursor())
getLine( pymssql.connect(serverName , userName , passWord, "Shoppp").cursor())

if __name__ == '__main__':
  pass
  # print("aaa")

