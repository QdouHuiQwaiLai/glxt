package service

import (
	"../../../model"
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"sort"
	"strconv"
	"sync"
	
	schoolService "../../../apps/school/service"
	"../../../pkg/util"
	"../dto"
)

/*
@title 通过taskFile来删除多个学生
@param	taskFile
@return error
*/
func TaskFileDeleteStudents(taskFile string) error {
	//fmt.Println(taskFile)
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("student")
	_, err := coll.DeleteMany(
		context.Background(),
		bson.D{{"taskFile", taskFile}},
		)
	return err
}


/*
@title 获取学生列表
@param 		uid
@param 		sid				学校id
@param 		year			年份
@param		taskFile	上传文件标志
@param    current		当前页数
@param    pageSize	当前页面显示的数量
*/
func  GetStudentList(uid string, sid string, year int, taskFile string, current int, pageSize int,
	originalId string, gender string, province string, branch string, plan string, line string,
	language string, political string, feature string, profession string, flag string, provolunteer string,
) ([]dto.Student, error)  {
	studentList := make([]dto.Student, 0 ,30)	// 最多允许显示30个
	client, _ := model.GetDb()
	defer client.Disconnect(context.TODO())
	coll := client.Database("test").Collection("student")
	pipeline := mongo.Pipeline{}
	
	if sid != "" {	// 如果指定了学校id
		objectSid, err := primitive.ObjectIDFromHex(sid); if err != nil {
			return nil, err
		}	// 解析 id
		pipeline =  append(pipeline,
			bson.D{
				{"$match", bson.D{{"sid",objectSid}}},
			},
		)
	} else {	// 没有指定就查询该用户所有的学校id下的上传任务
		schoolSimpleList, err :=  schoolService.GetSchoolList(uid); if err != nil {
			return nil, err
		}	// 获取用户下的学校列表
		schoolIdList := bson.A{}	// 把学校的id插入列表
		for _, school := range  schoolSimpleList {
			schoolIdList = append(schoolIdList, school.Id)
		}
		pipeline = append(pipeline,
			bson.D{
				{"$match", bson.D{{"sid",bson.D{{"$in", schoolIdList}}}}},
			},
		)
	}
	
	if year != 0 {
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"year", year}},
		}})
	}
	
	// start 多种条件
	if originalId != "" {
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"originalId", originalId}},
		}})
	}
	if gender != "" {
		genderInt, _ := strconv.Atoi(gender)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"gender", genderInt + 1}},
		}})
	}
	if province != "" {
		provinceInt, _ := strconv.Atoi(province)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"province", provinceInt}},
		}})
	}
	if branch != "" {
		branchInt, _ := strconv.Atoi(branch)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"branch", branchInt}},
		}})
	}
	if plan != "" {
		planInt, _ := strconv.Atoi(plan)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"plan", planInt}},
		}})
	}
	if language != "" {
		languageInt, _ := strconv.Atoi(language)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"language", languageInt}},
		}})
	}
	if political != "" {
		politicalInt, _ := strconv.Atoi(political)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"political", politicalInt}},
		}})
	}
	if feature != "" {
		featurelInt, _ := strconv.Atoi(feature)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"feature", featurelInt}},
		}})
	}
	if profession != "" {
		professionlInt, _ := strconv.Atoi(profession)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"profession", professionlInt}},
		}})
	}
	if flag != "" {
		flagInt, _ := strconv.Atoi(flag)
		var bol bool
		if flagInt == 0 {
			bol = true
		} else {
			bol = false
		}
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"flag", bol}},
		}})
	}
	//fmt.Println(line)
	if line != "" {
		lineInt, _ := strconv.Atoi(line)
		var bol bool
		if lineInt == 0 {
			bol = true
		} else {
			bol = false
		}
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"line", bol}},
		}})
	}
	if provolunteer != "" {
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"provolunteer", provolunteer}},
		}})
	}
	// end 多种条件
	
	if taskFile != "" {
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"taskFile", taskFile}},
		}})
	}
	// 把后上传的排在前面
	pipeline = append(pipeline, bson.D{
		{"$sort", bson.D{{"_id", -1}}},
	})
	
	
	// 处理分页
	pipeline = append(pipeline, bson.D{
		{"$skip", (current -1) * pageSize},
	})
	pipeline = append(pipeline, bson.D{
		{"$limit", pageSize},
	})
	
	cursor, err := coll.Aggregate(
		context.Background(),
		pipeline,
	)
	for cursor.Next(context.Background()) {
		student := dto.Student{}
		cursor.Decode(&student)
		student.Key = student.Id
		studentList = append(studentList, student)
	}
	return studentList , err
}


/*
@title 获取学生列表总量
@param 		uid
@param 		sid				学校id
@param 		year			年份
@param		taskFile	上传文件标志
*/
type Count struct {
	Count int         `json:"count" bson:"count"`
}
func  GetStudentListCount(uid string, sid string, year int, taskFile string,
	originalId string, gender string, province string, branch string, plan string, line string,
	language string, political string, feature string, profession string, flag string, provolunteer string,
)  (Count, error)  {
	client, _ := model.GetDb()
	defer client.Disconnect(context.TODO())
	coll := client.Database("test").Collection("student")
	pipeline := mongo.Pipeline{}
	var count Count
	if sid != "" {	// 如果指定了学校id
		objectSid, err := primitive.ObjectIDFromHex(sid); if err != nil {
			return count, err
		}	// 解析 id
		pipeline =  append(pipeline,
			bson.D{
				{"$match", bson.D{{"sid",objectSid}}},
			},
		)
	} else {	// 没有指定就查询该用户所有的学校id下的上传任务
		schoolSimpleList, err :=  schoolService.GetSchoolList(uid); if err != nil {
			return count, err
		}	// 获取用户下的学校列表
		schoolIdList := bson.A{}	// 把学校的id插入列表
		for _, school := range  schoolSimpleList {
			schoolIdList = append(schoolIdList, school.Id)
		}
		pipeline = append(pipeline,
			bson.D{
				{"$match", bson.D{{"sid",bson.D{{"$in", schoolIdList}}}}},
			},
		)
	}
	
	if year != 0 {
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"year", year}},
		}})
	}
	
	// start 多种条件
	if originalId != "" {
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"originalId", originalId}},
		}})
	}
	if gender != "" {
		genderInt, _ := strconv.Atoi(gender)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"gender", genderInt + 1}},
		}})
	}
	if province != "" {
		provinceInt, _ := strconv.Atoi(province)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"province", provinceInt}},
		}})
	}
	if branch != "" {
		branchInt, _ := strconv.Atoi(branch)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"branch", branchInt}},
		}})
	}
	if plan != "" {
		planInt, _ := strconv.Atoi(plan)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"plan", planInt}},
		}})
	}
	if language != "" {
		languageInt, _ := strconv.Atoi(language)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"language", languageInt}},
		}})
	}
	if political != "" {
		politicalInt, _ := strconv.Atoi(political)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"political", politicalInt}},
		}})
	}
	if feature != "" {
		featurelInt, _ := strconv.Atoi(feature)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"feature", featurelInt}},
		}})
	}
	if profession != "" {
		professionlInt, _ := strconv.Atoi(profession)
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"profession", professionlInt}},
		}})
	}
	if flag != "" {
		flagInt, _ := strconv.Atoi(flag)
		var bol bool
		if flagInt == 0 {
			bol = true
		} else {
			bol = false
		}
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"flag", bol}},
		}})
	}
	if line != "" {
		lineInt, _ := strconv.Atoi(line)
		var bol bool
		if lineInt == 0 {
			bol = true
		} else {
			bol = false
		}
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"line", bol}},
		}})
	}
	if provolunteer != "" {
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"provolunteer", provolunteer}},
		}})
	}
	// end 多种条件
	
	if taskFile != "" {
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"taskFile", taskFile}},
		}})
	}
	// 把后上传的排在前面
	pipeline = append(pipeline, bson.D{{"$group", bson.D{
		{"_id", nil},
		{"count", bson.D{{"$sum", 1},
		}}}}})
	
	cursor, err := coll.Aggregate(
		context.Background(),
		pipeline,
	)
	for cursor.Next(context.Background()) {
		cursor.Decode(&count)
		break
	}
	return count , err
}


/*
@title 		删除学生
@param 		stId			学生id
@return		error
*/
func DeleteStudent(stId string) error {
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("student")
	objectStId, err := primitive.ObjectIDFromHex(stId); if err != nil {
		return err
	}	// 解析 id
	_, err = coll.DeleteOne(
		context.Background(),
		bson.D{{"_id", objectStId}},
	)
	return err
}


/*
@title	更新学生数据
@param	student 学生数据
return error
*/
func UpdateStudent(student dto.Student) error {
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("student")
	
	// 更新插入学校年份数据
	_, err := coll.UpdateOne(
		context.Background(),
		bson.D{{"_id", student.Id}},
		bson.D{{
			"$set", student,
		}},
	)
	return err
}


/*
@title	获取统计人数
@param	sId		学校
@param	year	年份
@return 筛选项目,  结果项目,error
*/
func AnalStudentNumber(sid string, year	int, conditionList map[string]interface{}, result string, scoreType string) ([]dto.AnalNumber, error) {
	var analNumberList []dto.AnalNumber
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("student")
	// 声明管道
	pipeline := mongo.Pipeline{}
	
	// 增加学校和年份两个条件
	objectSid, err := primitive.ObjectIDFromHex(sid); if err != nil {
		return nil, err
	}	// 解析 id
	pipeline =  append(pipeline,
		bson.D{
			{"$match", bson.D{{"sid",objectSid}}},
		},
	)
	pipeline = append(pipeline, bson.D{{
		"$match", bson.D{{"year", year}},
	}})
	
	// 增加聚合筛选条件
	for key, condition := range conditionList {
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{
				{key, bson.D{
						{"$in", condition},
					},
				},
			},
		}})
	}
	
	// 要提取都聚合数据
	group := bson.D{}
	group = append(group,bson.E{"_id","$" + result})
	group = append(group,bson.E{"count", bson.D{{"$sum", 1}}})
	// 是否需要提取成绩信息
	if scoreType != "" {
		group = append(group,bson.E{"maxScore", bson.D{{"$max", "$" + scoreType}}})
		group = append(group,bson.E{"minScore", bson.D{{"$min", "$" + scoreType}}})
		group = append(group,bson.E{"avgScore", bson.D{{"$avg", "$" + scoreType}}})
		group = append(group,bson.E{"scoreList", bson.D{{"$push", "$" + scoreType}}})
	}
	pipeline = append(pipeline, bson.D{{"$group", group}})
	// 排序
	pipeline = append(pipeline, bson.D{
		{"$sort", bson.D{{"_id", 1}}},
	})
	// 聚合
	cursor, err := coll.Aggregate(
		context.Background(),
		pipeline,
	)
	for cursor.Next(context.Background()) {
		analNumber := dto.AnalNumber{}
		cursor.Decode(&analNumber)
		analNumberList = append(analNumberList, analNumber)
	}
	return analNumberList , err
}



/*
@title	获取录取信息
@param	sId		学校
@param	year	年份
@condition 条件
@return 筛选项目,  结果项目,error
*/

func AnalStudentScheme(sid string, year int, condition dto.SchemeCondition) ([]dto.AnalScheme, error){
	var analSchemeList []dto.AnalScheme
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("student")
	// 声明管道
	pipeline := mongo.Pipeline{}
	
	// 增加筛选条件
	objectSid, err := primitive.ObjectIDFromHex(sid); if err != nil {
		return nil, err
	}	// 解析 id
	pipeline =  append(pipeline,
		bson.D{
			{"$match", bson.D{
				{"sid",objectSid},
				{"year", year},
				{"province", condition.Province},
				{"profession", condition.Profession},
				{"branch", condition.Branch},
			}},
		},
	)
	
	// 要提取都聚合数据
	group := bson.D{}
	group = append(group,bson.E{
		"_id",bson.D{
			{"flag", "$flag"},
			{"line", "$line"},
			{"provolunteer", "$provolunteer"},
		},
	})
	group = append(group,bson.E{"count", bson.D{{"$sum", 1}}})
	// 是否需要提取成绩信息
	group = append(group,bson.E{"scoreList", bson.D{{"$push", "$score"}}})
	pipeline = append(pipeline, bson.D{{"$group", group}})
	// 排序
	pipeline = append(pipeline, bson.D{
		{"$sort", bson.D{{"_id", 1}}},
	})
	
	cursor, err := coll.Aggregate(
		context.Background(),
		pipeline,
	)
	for cursor.Next(context.Background()) {
		analScheme := dto.AnalScheme{}
		cursor.Decode(&analScheme)
		analSchemeList = append(analSchemeList, analScheme)
	}
	return analSchemeList , err
}


/*
@title	通过列表获取获取录取信息
@param	sId		学校
@param	year	年份
@conditionList 条件列表
@return 筛选项目,  结果项目,error
*/


func AnalStudentSchemeList(sid string, year int, conditionList []dto.SchemeCondition) ([]dto.AnalSchemeResult) {
	wg := sync.WaitGroup{}
	// 开启一条存储录取计划信息的管道
	analSchemeResultChan := make(chan dto.AnalSchemeResult, 300)
	
	for _, condition := range conditionList {
		wg.Add(1)
		// 并发查询并处理数据
		go func(currentCondition dto.SchemeCondition) {
			defer wg.Done()
			// 报道数据查询后处理结果
			analSchemeResult := dto.AnalSchemeResult{}
			// 查询数据库取得数据
			analScheme, _ := AnalStudentScheme(sid, year, currentCondition)
			
			// 从条件中取出省份, 专业, 科类, 计划人数, 填报人数
			analSchemeResult.Province = currentCondition.Province
			analSchemeResult.Profession = currentCondition.Profession
			analSchemeResult.Branch = currentCondition.Branch
			analSchemeResult.Num = currentCondition.Num
			analSchemeResult.FullNum = currentCondition.FullNum
			// 计算填报率
			analSchemeResult.FullPercent = util.GetPercent(analSchemeResult.FullNum, analSchemeResult.Num)
			
			scoreList := []float64{}	// 	分数列表
			actualNum := 0			// 实际录取人数
			firstNum	:= 0			// 第一志愿人数
			lastNum	:= 0				// 被调剂人数
			lineNum := 0 				// 过重点线人数
			flagNum	:= 0 				// 报道人数
			// 将数据循环筛选
			for _,item := range analScheme{
				if item.Id.Flag {	// 如果报道了
					flagNum = flagNum + item.Count
				}
				if item.Id.Line {	// 如果过线了
					lineNum = lineNum + item.Count
				}
				if item.Id.Provolunteer == "1" {	// 如果是1志愿
					firstNum = firstNum + item.Count
				} else if item.Id.Provolunteer == "0" {	// 如果是被调剂
					lastNum = lastNum + item.Count
				}
				actualNum = actualNum + item.Count
				scoreList = append(scoreList, item.ScoreList...)
			}
			
			sort.Float64s(scoreList)	// 排序分数

			analSchemeResult.MaxScore = int(scoreList[int(len(scoreList)-1)])	// 最大值
			analSchemeResult.MinScore	=	int(scoreList[0])	// 最小值
			analSchemeResult.AvgScore	= int(util.GetAvg(scoreList))	// 平均值
			analSchemeResult.MidScore = int(scoreList[int(len(scoreList)/2)])	// 中位数
			
			analSchemeResult.ActualNum = actualNum
			analSchemeResult.FirstNum = firstNum
			analSchemeResult.FirstPercent = util.GetPercent(analSchemeResult.FirstNum, analSchemeResult.Num)
			analSchemeResult.LastNum = lastNum
			analSchemeResult.LastPercent = util.GetPercent(analSchemeResult.LastNum, analSchemeResult.Num)
			analSchemeResult.LineNum = lineNum
			analSchemeResult.LinePercent = util.GetPercent(analSchemeResult.LineNum, analSchemeResult.Num)
			analSchemeResult.FlagNum = flagNum
			analSchemeResult.FlagPercent = util.GetPercent(analSchemeResult.FlagNum, analSchemeResult.Num)
			
			analSchemeResultChan <- analSchemeResult	// push到管道中
		}(condition)
	}
	
	wg.Wait()	// 等待并发完成
	close(analSchemeResultChan)	// 关闭管道
	
	analSchemeResultList := []dto.AnalSchemeResult{}
	for analSchemeResult := range analSchemeResultChan {
		analSchemeResultList = append(analSchemeResultList, analSchemeResult)
	}
	//fmt.Println(analSchemeResultList)
	return analSchemeResultList
}