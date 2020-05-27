package service

import (
	"../../../model"
	"go.mongodb.org/mongo-driver/mongo"
	
	"../dto"
	//entryDto "../../../apps/entry/dto"
	
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

/*
@title 增加学校
@param 	uid 				用户uid
@param 	name			名称
@return insertId	插入数据的id
*/
func AddName(uid string, name string) (interface{}, error) {
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("school")
	objectUid, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		return nil, err
	}
	if result, err := coll.InsertOne(
		context.Background(),
		bson.D{
			{"name", name},
			{"uid", objectUid},
			{"data", bson.A{}},
		}); err == nil {
		return result.InsertedID, err
	}
	return  nil, err
}


/**
@param  插入学校data字段数组中的数据
@param	sid 		学校的sId
@param  data	要插入的数据
@return error
 */
func AddData(sid string, data interface{}) error {
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("school")
	
	objectSid, err := primitive.ObjectIDFromHex(sid); if err != nil {
		return err
	}	// 解析 id
	// 更新插入学校年份数据
	_, err = coll.UpdateOne(
		context.Background(),
		bson.D{{"_id", objectSid}},
		bson.D{{
			"$push", bson.D{{
				"data", data,
			}},
		}},
	)
	return err
}


/**
@title  通过学校id获取该学校的年份散列
@param	sid 		学校的Id
@param  year	年份
@return []dto.School error
*/
func SchoolGetList(sid string, year int) ([]dto.School , error) {
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("school")
	
	var schoolList []dto.School
	// 解析 id
	objectSid, err := primitive.ObjectIDFromHex(sid); if err != nil {
		return schoolList, err
	}
	// 拼接管道
	pipe := mongo.Pipeline{
		{{
			"$match", bson.D{{"_id", objectSid}},
		}},
		{{
			"$unwind", "$data",
		}},
	}
	if year != 0 {
		pipe = append(pipe, bson.D{{
			"$match", bson.D{{"data.year", year}},
		}})
	}
	// 查询数据
	cursor, err := coll.Aggregate(
		context.Background(),
		pipe,
	); if err != nil {
		return schoolList, err
	}
	// 解析游标
	for cursor.Next(context.Background()) {
		var school dto.School
		cursor.Decode(&school)
		schoolList = append(schoolList, school)
	}
	//fmt.Println(schoolList)
	return schoolList, err
}


/*
@title 		通过用户名获取用户下的学校列表
@param  	uid			用户id
@return
*/
func GetSchoolList(uid string) ([]dto.SchoolSimple, error ) {
	schoolSimpleList := make([]dto.SchoolSimple, 0, 200)
	client, _ := model.GetDb()
	defer client.Disconnect(context.TODO())
	
	// 解析 id
	objectUid, err := primitive.ObjectIDFromHex(uid); if err != nil {
		return schoolSimpleList, err
	}
	
	// 查询
	coll := client.Database("test").Collection("school")
	cursor, err := coll.Aggregate(
		context.Background(),
		mongo.Pipeline{
			{
				{"$match", bson.D{{"uid", objectUid}}},
			},
		},
	)
	for cursor.Next(context.Background()) {
		var schoolSimple dto.SchoolSimple
		cursor.Decode(&schoolSimple)
		schoolSimpleList = append(schoolSimpleList, schoolSimple)
	}
	return schoolSimpleList , err
}


/*
title		删除学校
@param	sid			学校id
@return	error
*/
func DeleteSchool(sid string) error {
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("school")
	
	objectSid, err := primitive.ObjectIDFromHex(sid); if err != nil {
		return err
	}	// 解析 id
	// 删除帐号
	_, err = coll.DeleteOne(
		context.Background(),
		bson.D{{"_id", objectSid}},
	)
	return err
}


/*
title		删除学校数据中的指定年份
@param	sid		学校的id
@param	year	年份
@return	error
*/
func  DeleteSchoolYear(sid string, year int) error  {
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("school")
	
	objectSid, err := primitive.ObjectIDFromHex(sid); if err != nil {
		return err
	}	// 解析 id
	// 弹出指定的年份
	_, err = coll.UpdateOne(
		context.Background(),
		bson.D{{"_id", objectSid}},
		bson.D{{
			"$pull", bson.D{{
				"data", bson.D{{"year", year}},
			}},
		}},
	)
	return err
}


