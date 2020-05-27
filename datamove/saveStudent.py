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


def parseLanguage(language):
  if language == "1": return 0
  if language == "2": return 1
  if language == "3": return 2
  if language == "4": return 3
  if language == "7": return 4
  if language == "5": return 5


def parsePlan(plan):
  if plan == "0": return 0
  if plan == "1": return 1
  if plan == "2": return 2
  if plan == "9": return 3
  if plan == "i": return 4


def parseLine(branch,province,score,line ):
  flag = False
  if branch == 0:
    if (line['a'][province]):
      if score >= line['a'][province]:
        flag = True
  if branch == 1:
    if (line['b'][province]):
      if score >= line['b'][province]:
        flag = True
  if branch == 3:
    if (line['c'][province]):
      if score >= line['c'][province]:
        flag = True
  return flag
    


def saveStudentData(cursor, name, year, line):
  cursor.execute("""
  select
      lqbh as number,
      xbdm as gender,
  		lysfdm as province,
  		kldm as branch,
  		jhxz as 'plan',
  		wyyzdm as language,
  		zzmmdm as political,
  		kstz as feature,
  		lqzy 	as profession,
  		bdbz as flag,
  		zyh as volunteer,
  		lqzyh as provolunteer,
  		cj as score,
  		lqcj as feascore,
  		sxcj as mathsocre,
  		wycj as foreignscores from t_tdd
  """)
  students = []
  row = cursor.fetchone()
  while row:
    student = OrderedDict()
    student["originalId"] = row[0]
    student["gender"] = int(row[1])
    student["province"] = parseProvince(row[2])
    student["branch"] = parseBranch(row[3])
    student["plan"] = parsePlan(row[4])
    student["language"] = parseLanguage(row[5])
    student["political"] = int(row[6]) - 1
    student["feature"] = int(row[7])
    student['profession'] = int(row[8]) - 1
    student['flag'] = row[9]
    student["volunteer"] = row[10]
    student["provolunteer"] = row[11]
    student["score"] = row[12]
    student["feascore"] = row[13]
    student["mathsocre"] = row[14]
    student["foreignscore"] = row[15]
    student["line"] = parseLine(student["branch"], row[2], student["score"],line )
    students.append(student)
    row = cursor.fetchone()
  
  with open(f'./output/students_{year}.json', 'w') as json_file:
    json_file.write(json.dumps(students, ensure_ascii=False))

if __name__ == '__main__':
  pass