package dto

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID primitive.ObjectID `json:"id" bson:"_id"`
	UserName string				`json:"username" bson:"username"`
	Password string				`json:"password" bson:"password"`
	Parent string					`json:"parent" bson:"parent"`
}

type SimpleUser struct {
	ID primitive.ObjectID `json:"id" bson:"_id"`
	UserName string				`json:"username" bson:"username"`
}
