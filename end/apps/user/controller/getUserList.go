package controller

import (
	"github.com/gin-gonic/gin"
	
	. "../../../handler"
	"../../../pkg/errno"
	"../service"
)

func GetUserList(c *gin.Context) {
	// 获取当前username
	username, ok := c.Get("username"); if !ok {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	simpleUserList, err := service.GetUserList(username.(string)); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	//time.Sleep(5000000000)
	SendResponse(c, nil, simpleUserList)
	return
}
