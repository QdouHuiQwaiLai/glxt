package controller

import (
	//"fmt"
	//"fmt"
	"github.com/gin-gonic/gin"
	
	. "../../../handler"
	//"../../../pkg/auth"
	"../../../pkg/errno"
	
	"../dto"
	"../service"
	
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UpdateStudent(c *gin.Context) {
	// 绑定参数
	var r dto.UpdateStudentRequest
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	objectStId, err := primitive.ObjectIDFromHex(r.StId);  if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	objectSid, err := primitive.ObjectIDFromHex(r.Sid);  if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	student := dto.Student{
		Id:           objectStId,
		OriginalId:   r.OriginalId,
		Sid:          objectSid,
		Year:         r.Year,
		Gender:       r.Gender,
		Province:     r.Province,
		Branch:       r.Branch,
		Plan:         r.Plan,
		Language:     r.Language,
		Political:    r.Political,
		Feature:      r.Feature,
		Profession:   r.Profession,
		Flag:         r.Flag,
		Volunteer:    r.Volunteer,
		Provolunteer: r.Provolunteer,
		Score:        r.Score,
		Feascore:     r.Feascore,
		Mathsocre:    r.Mathsocre,
		Foreignscore: r.Foreignscore,
		TaskFile:     r.TaskFile,
		Custom:       r.Custom,
	}
	// 更新此条任务
	err = service.UpdateStudent(student); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	SendResponse(c, nil, nil)
	return
}
