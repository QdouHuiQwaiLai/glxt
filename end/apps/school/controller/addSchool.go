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



func AddSchoolName(c *gin.Context) {
	var r dto.AddSchoolNameRequest
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	
	// 获取jwt中的参数
	id, ok := c.Get("id")
	if !ok  {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	resultInsertId, err := service.AddName(id.(string), r.Name)
	if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	
	SendResponse(c, nil, dto.AddSchoolNameResponse{
		Id: resultInsertId,
	})
	return
}
