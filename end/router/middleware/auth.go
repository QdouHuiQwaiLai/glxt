package middleware

import (
	"../../apps/user/service"
	"../../handler"
	"../../pkg/errno"
	"../../pkg/token"
	
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenInfo, err := token.ParseRequest(c)
		if err != nil {
			handler.SendResponse(c, errno.ErrTokenInvalid, nil)
			c.Abort()
			return
		}
		c.Set("id", tokenInfo.ID)
		c.Set("username", tokenInfo.Username)
		c.Set("parent", tokenInfo.Parent)
		c.Next()
	}
}

func IsParentMiddleware() gin.HandlerFunc  {
	return func(c *gin.Context) {
		parent, ok := c.Get("parent")
		if !ok || parent != "0"  {
			handler.SendResponse(c, errno.ErrTokenDenied, nil)
			c.Abort()
			return
		}
		c.Next()
	}
}

func ChangeUserIdMiddleware() gin.HandlerFunc  {
	return func(c *gin.Context) {
		parent, ok := c.Get("parent")
		if !ok || parent != "0"  {
			parentUser, err := service.NameGetUser(parent.(string)); if err != nil {
				handler.SendResponse(c, errno.ErrDatabase, nil)
				c.Abort()
				return
			}
			c.Set("id", parentUser.ID.Hex())
			c.Next()
		}
		c.Next()
	}
}
