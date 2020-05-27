package controller

import (
	"github.com/gin-gonic/gin"
	
	. "../../../handler"
	//"../../../pkg/auth"
	"../../../pkg/errno"
	
	"../service"
)



func GetSchoolList(c *gin.Context) {
	// 获取jwt中的参数
	id, ok := c.Get("id")
	if !ok  {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	schoolList ,err := service.GetSchoolList(id.(string)); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	//time.Sleep(5000000000)
	SendResponse(c, nil, schoolList)
	return
}
