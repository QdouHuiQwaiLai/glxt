package dto

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TaskInfo struct {
	Id 				primitive.ObjectID		`json:"id" bson:"_id"`
	Key 			primitive.ObjectID		`json:"key" bson:"key"`
	Sid				primitive.ObjectID		`json:"sid" bson:"sid"`
	Year			int										`json:"year" bson:"year"`
	TaskId		string								`json:"taskId" bson:"taskId"`
	TaskFile	string								`json:"taskFile" bson:"taskFile"`
	// 0 运行中 1 成功 2 失败
	Status		int										`json:"status" bson:"status"`
}