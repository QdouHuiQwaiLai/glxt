package controller

import (
	"github.com/gin-gonic/gin"
	
	. "../../../handler"
	"../../../pkg/errno"
	
	"../dto"
	"../service"
)


func DeleteUser(c *gin.Context) {
	var r dto.DeleteUserRequest
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	
	// 删除
	err :=  service.DeleteUser(r.Id,); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	
	SendResponse(c, nil, nil)
	return
	
}

