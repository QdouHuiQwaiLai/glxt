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



func DeleteSchool(c *gin.Context) {
	var r dto.DeleteSchoolRequest
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}

	err := service.DeleteSchool(r.Sid); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	SendResponse(c, nil, nil)
	return
}


func DeleteSchoolYear(c *gin.Context) {
	var r dto.DeleteSchoolYearRequest
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	
	err := service.DeleteSchoolYear(r.Sid, r.Year); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	SendResponse(c, nil, nil)
	return
}
