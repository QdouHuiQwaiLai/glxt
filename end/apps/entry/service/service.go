package service

import (
	"../../../model"
	"../dto"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"strconv"
	
	schoolService "../../school/service"
	
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)


/*
@title	处理学校信息的json文件
@param 	year
@param 	file											要处理的文件
@return dto.UploadSchool, error
*/
func HandleSchoolJson(year int, file multipart.File ) (dto.UploadSchool, error) {
	var uploadSchool dto.UploadSchool
	content, err := ioutil.ReadAll(file)
	if err != nil {
		return dto.UploadSchool{},  err
	}
	err = json.Unmarshal([]byte(content), &uploadSchool)
	if err != nil {
		return dto.UploadSchool{}, err
	}
	uploadSchool.Year = year
	return uploadSchool, nil
}


/*
@title	在数据库中增加任务信息
@param 	id				用户id
@param 	sid				学校id
@param 	taskId		用户id
@param 	taskFile	任务处理的文件
@return dto.UploadSchool, error
*/
func AddTaskInfo(sid string, year int, taskId string, taskFile string) (interface{}, error){
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("taskInfo")
	objectSid, err := primitive.ObjectIDFromHex(sid); if err != nil {
		return nil, err
	}	// 解析 id
	// 增加任务数据
	if result, err := coll.InsertOne(
		context.Background(),
		bson.D{
			{"sid", objectSid},
			{"year", year},
			{"taskId", taskId},
			{"taskFile", taskFile},
			{"status", 0},
		}); err == nil {
		return result.InsertedID, err
	}
	return nil, err
}


/*
@title	开启导入学生信息任务
@param 	slId 				学校id
@param 	year			年份
@param 	filePath	文件名
@return dto.StudentsImportTaskResponse, error
*/
func GetStudentsImportTask(sId string, year int, filePath string) (dto.StudentsImportTaskResponse, error) {
	var result dto.StudentsImportTaskResponse
	// 发送请求
	client := &http.Client{}
	url := fmt.Sprintf("%s?id=%s&year=%s&path=%s",
		"http://127.0.0.1:8000/importStudents", sId, strconv.Itoa(year), filePath)
	resp, err := client.Get(url, ); if err != nil {
		return result, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body); if err != nil {
		return result, err
	}
	// 解析json结果
	err = json.Unmarshal(body, &result); if err != nil {
		return result, err
	}
	return result, nil
}


/*
@title	获取任务状态
@param 	tId 			任务Id
@param 	status		状态
*/
func GetTaskStatus(tId string) (dto.TaskInfo, error){
	//type
	var taskInfo dto.TaskInfo
	client, _ := model.GetDb()
	defer client.Disconnect(context.TODO())
	
	coll := client.Database("test").Collection("taskInfo")
	cursor, err := coll.Aggregate(
		context.Background(),
		mongo.Pipeline{
			{
				{"$match", bson.D{{"taskId", tId}}},
			},
		},
	)
	for cursor.Next(context.Background()) {
		cursor.Decode(&taskInfo)
		break
	}
	return taskInfo , err
}


/*
@title	设置任务状态
@param 	tId 			任务Id
@param 	status		状态
@return error
*/
func SetTaskStatus(tId string, status int) (error){
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("taskInfo")
	
	// 更新插入学校年份数据
	_, err := coll.UpdateOne(
		context.Background(),
		bson.D{{"taskId", tId}},
		bson.D{{
			"$set", bson.D{{
				"status", status,
			}},
		}},
	)
	return err
}


/*
@title	获取任务进度
@param 	tId 				任务id
@return dto.ImportStudentsProgress, error
*/
func GetImportStudentsProgress(tId string) (dto.ImportStudentsProgress, error) {
	var result dto.ImportStudentsProgress
	// 发送请求
	client := &http.Client{}
	url := fmt.Sprintf("%s?id=%s",
		"http://127.0.0.1:8000/getimportstudentsprogress", tId,)
	resp, err := client.Get(url, ); if err != nil {
		return result, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body); if err != nil {
		return result, err
	}
	// 解析json结果
	err = json.Unmarshal(body, &result); if err != nil {
		return result, err
	}
	return result, nil
}


/*
@title 获取上传任务的列表
@param 		uid				用户id
@param 		sid				学校id
@param 		year			年份
@param    current		当前页数
@param    pageSize	当前页面显示的数量
*/
func GetUploadList(uid string, sid string, year int, current int, pageSize int) (interface{}, error)  {
	taskInfoList := make([]dto.TaskInfo, 0 ,30)	// 最多允许显示30个
	client, _ := model.GetDb()
	defer client.Disconnect(context.TODO())
	coll := client.Database("test").Collection("taskInfo")
	
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
	
	// 筛选时间
	if year != 0 {
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"year", year}},
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
		taskInfo := dto.TaskInfo{}
		cursor.Decode(&taskInfo)
		taskInfo.Key = taskInfo.Id
		taskInfoList = append(taskInfoList, taskInfo)
	}
	return taskInfoList , err
}


/*
@title 获取上传任务的列表当前查询条件的总个数
@param 		uid				用户id
@param 		sid				学校id
@param 		year			年份
*/
type Count struct {
	Count int         `json:"count" bson:"count"`
}
func GetUploadListCount(uid string, sid string, year int,) (Count, error)  {
	client, _ := model.GetDb()
	defer client.Disconnect(context.TODO())
	coll := client.Database("test").Collection("taskInfo")
	var count Count
	pipeline := mongo.Pipeline{}
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
	
	// 筛选时间
	if year != 0 {
		pipeline = append(pipeline, bson.D{{
			"$match", bson.D{{"year", year}},
		}})
	}
	
	
	pipeline = append(pipeline, bson.D{{"$group", bson.D{
		{"_id", nil},
		{"count", bson.D{{"$sum", 1},
		}}}}})
	
	cursor, err := coll.Aggregate(
		context.Background(),
		pipeline,
	)
	
	for cursor.Next(context.Background()) {
		//fmt.Println(cursor.Current)
		cursor.Decode(&count)
		break
	}
	return count , err
}

/*
@title	 删除任务
@param	taskFile		数据文件标志
@return error
*/
func DeleteTaskFile(taskFile string) error {
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("taskInfo")
	_, err := coll.DeleteOne(
		context.Background(),
		bson.D{{"taskFile", taskFile}},
	)
	return err
}