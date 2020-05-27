package service

import (
	"../../../model"
	"../dto"
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson/primitive"
)


/*
@title  增加用户
@param	username
@param	password
@param	parent 父级id
@return insertedId, err
*/
func Add(username string, password string, parent string) (interface{}, error) {
	client, _ := model.GetDb()
	defer client.Disconnect(context.TODO())
	coll := client.Database("test").Collection("curd")
	result, err := coll.InsertOne(
		context.Background(),
		bson.D{
			{"username", username},
			{"password", password},
			{"parent", parent},
		})
	return result.InsertedID, err
}


/*
@title 通过用户名获取用户信息
@username 用户名
@return dto.User
*/
func NameGetUser(username string) (dto.User, error) {
	var user dto.User
	
	client, _ := model.GetDb()
	defer client.Disconnect(context.TODO())
	
	coll := client.Database("test").Collection("curd")
	cursor, err := coll.Aggregate(
		context.Background(),
		mongo.Pipeline{
			{
				{"$match", bson.D{{"username", username}}},
			},
		},
	)
	for cursor.Next(context.Background()) {
		cursor.Decode(&user)
		break
	}
	return user , err
}


/*
@title 更新用户信息 (暂时只更新密码)
@param 	uid	 		用户的id
@param 	newPwd	新密码
@return error
*/
func UpdateUser(uid string, newPwd string) error {
	objectUid, err := primitive.ObjectIDFromHex(uid); if err != nil {
		return err
	}	// 解析 id
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("curd")
	
	// 更新用户密码
	_, err = coll.UpdateOne(
		context.Background(),
		bson.D{{"_id", objectUid}},
		bson.D{{
			"$set", bson.D{{
				"password", newPwd,
			}},
		}},
	)
	fmt.Println(objectUid, newPwd, err)
	return err
}


/*
@title 查询该用户下的子用户列表
@param	username		需要查询的用户名
@return []
*/
func GetUserList(username string) ([]dto.SimpleUser, error) {
	simpleUserList := make([]dto.SimpleUser, 0 ,200)
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("curd")
	
	cursor, err :=  coll.Aggregate(
		context.Background(),
		mongo.Pipeline{
			{{"$match", bson.D{{"parent", username}}}},
			{{"$sort", bson.D{{"_id", -1}}}},	// 倒序排序
		},
		)
	for cursor.Next(context.Background()) {
		var simpleUser dto.SimpleUser
		cursor.Decode(&simpleUser)
		simpleUserList = append(simpleUserList, simpleUser)
	}
	return simpleUserList, err
}


/*
@title 	删除用户
@param 	uid 	要删除用户的id
@return error
*/
func DeleteUser(uid string) error {
	client, _ := model.GetDb()
	defer client.Disconnect(context.Background())
	coll := client.Database("test").Collection("curd")
	
	objectUid, err := primitive.ObjectIDFromHex(uid); if err != nil {
		return err
	}	// 解析 id
	// 删除帐号
	_, err = coll.DeleteOne(
		context.Background(),
		bson.D{{"_id", objectUid}},
	)
	return err
}






//func IdGetUser(id string) (dto.User, error) {
//	var user dto.User
//
//	client, _ := model.GetDb()
//	defer client.Disconnect(context.TODO())
//
//	_id, _:= primitive.ObjectIDFromHex(id)
//	coll := client.Database("test").Collection("curd")
//	cursor, err := coll.Aggregate(
//		context.Background(),
//		mongo.Pipeline{
//			{
//				{"$match", bson.D{{"_id", _id}}},
//			},
//		},
//	)
//	for cursor.Next(context.Background()) {
//		cursor.Decode(&user)
//		break
//	}
//	fmt.Println(user)
//	return user , err
//}
