package dto

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Student struct {
	Id 						primitive.ObjectID		`json:"id" bson:"_id"`
	Key 					primitive.ObjectID		`json:"key" bson:"key"`
	OriginalId		string								`json:"originalId" bson:"originalId"`
	Sid						primitive.ObjectID		`json:"sid" bson:"sid"`
	Year					int										`json:"year" bson:"year"`
	Gender				int										`json:"gender" bson:"gender"`									// 性别
	Province			int										`json:"province" bson:"province"`							// 地区
	Branch				int										`json:"branch" bson:"branch"`									// 文理科
	Plan					int										`json:"plan" bson:"plan"`											// 计划类型
	Language			int										`json:"language" bson:"language"`							// 外语语言
	Political			int										`json:"political" bson:"political"`						// 政治面貌
	Feature				int										`json:"feature" bson:"feature"`								// 特长
	Profession		int										`json:"profession" bson:"profession"`					// 学院
	Flag					bool									`json:"flag" bson:"flag"`											// 是否报道
	Line					bool									`json:"line" bson:"line"`											// 是否过重本线
	Volunteer			string								`json:"volunteer" bson:"volunteer"`						// 志愿号
	Provolunteer	string								`json:"provolunteer" bson:"provolunteer"`			// 专业志愿号
	Score					interface{}								`json:"score" bson:"score"`										// 成绩
	Feascore			interface{}								`json:"feascore" bson:"feascore"`							// 特征成绩
	Mathsocre			interface{}									`json:"mathsocre" bson:"mathsocre"`						// 数学成绩
	Foreignscore	interface{}								`json:"foreignscore" bson:"foreignscore"`			// 外语成绩
	TaskFile			string								`json:"taskFile" bson:"taskFile"`
	Custom				interface{}						`json:"custom" bson:"custom"`									// 自定义
}
