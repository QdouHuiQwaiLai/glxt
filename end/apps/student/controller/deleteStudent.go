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
)


func DeleteStudent(c *gin.Context) {
	// 绑定参数
	var r dto.DeleteStudentRequest
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	
	// 删除此条任务
	err := service.DeleteStudent(r.StId); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	SendResponse(c, nil, nil)
	return
}
