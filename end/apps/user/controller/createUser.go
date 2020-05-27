package controller

import (
	"github.com/gin-gonic/gin"
	
	. "../../../handler"
	"../../../pkg/auth"
	"../../../pkg/errno"
	
	"../dto"
	"../service"
)



func CreateUser(c *gin.Context) {
	var r dto.CreateUserRequest
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	
	// 查询当前使用的username是否已经存在
	newUser, _ := service.NameGetUser(r.Username)
	if !newUser.ID.IsZero() {
		SendResponse(c, errno.ErrUserExists, nil)
		return
	}
	
	// 查询当前新增用的parent是否复合条件
	parentUser, _ := service.NameGetUser(r.Parent)
	parentID := ""
	if r.Parent != "0" {
		if parentUser.ID.IsZero() || (parentUser.Parent != "0") {
			SendResponse(c, errno.ErrParentNotFound, nil)
			return
		}
		parentID = parentUser.UserName
	} else {
		parentID = "0"
	}
	
	// 加密密码
	hashPwd, err := auth.Encrypt(r.Password,)
	if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	
	// 增加用户
	resultInsertId, err :=  service.Add(r.Username, hashPwd, parentID)
	if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	
	
	SendResponse(c, nil, dto.CreateUserResponse{
		Id: resultInsertId,
	})
	return
}


func ParentCreateUser(c *gin.Context) {
	var r dto.ParentCreateUser
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	// 查询当前使用的username是否已经存在
	newUser, _ := service.NameGetUser(r.Username)
	if !newUser.ID.IsZero() {
		SendResponse(c, errno.ErrUserExists, nil)
		return
	}
	
	// 获取当前username
	username, ok := c.Get("username")
	if !ok {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	
	hashPwd, err := auth.Encrypt(r.Password,)
	if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	
	// 增加用户
	resultInsertId, err :=  service.Add(r.Username, hashPwd, username.(string))
	if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	
	SendResponse(c, nil, dto.CreateUserResponse{
		Id: resultInsertId,
	})
	return
	
}

