package controller
//
import (
	. "../../../handler"
	
	"../../../pkg/auth"
	"../../../pkg/errno"
	"../../../pkg/token"
	
	"../dto"
	"../service"
	"github.com/gin-gonic/gin"
)


func Login(c *gin.Context) {
	// Binding the data with the user struct.
	var r dto.LoginRequest
	if err := c.Bind(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	
	// 获取用户数据
	user, err := service.NameGetUser(r.Username)
	if err != nil {
		SendResponse(c, errno.ErrUserNotFound, nil)
		return
	}
	
	// 对比密码
	if err := auth.Compare(user.Password, r.Password, ); err != nil {
		SendResponse(c, errno.ErrPasswordIncorrect, nil)
		return
	}
	
	currentAuthority := ""
	if user.Parent == "0" {
		currentAuthority = "admin"
	} else {
		currentAuthority = "user"
	}
	
	// 签发token
	t, err := token.Sign(c, token.Context{ID: user.ID.Hex(), Username: user.UserName, Parent: user.Parent }, )
	if err != nil {
		SendResponse(c, errno.ErrToken, nil)
		return
	}
	SendResponse(c, nil, dto.Token{Token: t, CurrentAuthority: currentAuthority})
	return
}
