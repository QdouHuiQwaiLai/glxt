package controller

import (
	"github.com/gin-gonic/gin"
	
	. "../../../handler"
	"../../../pkg/auth"
	"../../../pkg/errno"
	"../dto"
	"../service"
)

func ChangePwd(c *gin.Context) {
	var r dto.ChangePwdRequest
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	//time.Sleep(50000000000)
	// 获取当前id 和username
	id, ok := c.Get("id"); if !ok {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	username, ok := c.Get("username"); if !ok {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	
	// 查询当前使用的username是否已经存在
	user, err := service.NameGetUser(username.(string)); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	// 对比密码
	if err := auth.Compare(user.Password, r.Password, ); err != nil {
		SendResponse(c, errno.ErrPasswordIncorrect, nil)
		return
	}
	
	hashPwd, err := auth.Encrypt(r.NewPwd,); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	//fmt.Println(r.NewPwd, hashPwd)
	err = service.UpdateUser(id.(string), hashPwd); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	
	SendResponse(c, nil, nil)
	return
}
