package dto

import (
	entryDto "../../../apps/entry/dto"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type School struct {
	Id 		primitive.ObjectID						`json:"id" bson:"_id"`
	Name 	string												`json:"name" bson:"name`
	Uid 	primitive.ObjectID						`json:"uid" bson:"uid"`
	Data  entryDto.UploadSchool					`json:"data" bson"data"`
}

type SchoolSimple struct {
	Id		primitive.ObjectID			`json:"id" bson:"_id"`
	Name	string									`json:"name" bson:"name"`
	Uid		primitive.ObjectID			`json:"uid" bson:"uid"`
	Data  []entryDto.UploadSchool					`json:"data" bson"data"`
}
