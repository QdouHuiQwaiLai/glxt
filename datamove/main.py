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
    if row[0] == '00':
      line['a'][row[1]] = row[2]
    elif row[0] == '10':
      line['b'][row[1]] = row[2]
    elif row[0] == '50':
      line['c'][row[1]] = row[2]
    row = cursor.fetchone()
  print(line)
  return line

# getLine(pymssql.connect(serverName , userName , passWord, "Shoppp").cursor())
# getLine(cursor)


saveSchoolData(
  pymssql.connect(serverName , userName , passWord, "Shopp").cursor(),
  "重庆科技学院", 2018
)

saveSchoolData(
  pymssql.connect(serverName , userName , passWord, "Shoppp").cursor(),
  "重庆科技学院", 2019
)
#
#
saveStudentData(
  pymssql.connect(serverName , userName , passWord, "Shopp").cursor(),
  "重庆科技学院", 2018, getLine( pymssql.connect(serverName , userName , passWord, "Shopp").cursor())
)

saveStudentData(
  pymssql.connect(serverName , userName , passWord, "Shoppp").cursor(),
  "重庆科技学院", 2019, getLine( pymssql.connect(serverName , userName , passWord, "Shoppp").cursor())
)




if __name__ == '__main__':
  pass
  # print("aaa")
  
  