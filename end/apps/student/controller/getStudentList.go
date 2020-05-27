package controller

import (
	//"fmt"
	//"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	
	. "../../../handler"
	//"../../../pkg/auth"
	"../../../pkg/errno"
	
	"../dto"
	"../service"
)


func GetStudentList(c *gin.Context) {
	// 获取jwt中的参数
	uid, ok := c.Get("id"); if !ok  {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	// 绑定参数
	var r dto.GetStudentListRequest
	if err := c.ShouldBindQuery(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	count, err := service.GetStudentListCount(uid.(string), r.Sid, r.Year, r.TaskFile,
		r.OriginalId, r.Gender, r.Province, r.Branch, r.Plan, r.Line,  r.Language, r.Political, r.Feature, r.Profession, r.Flag, r.Provolunteer,);
	if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	
	// 获取学生数据列表
	if studentList, err := service.GetStudentList(uid.(string), r.Sid, r.Year, r.TaskFile, r.Current, r.PageSize,
		r.OriginalId, r.Gender, r.Province, r.Branch, r.Plan, r.Line , r.Language, r.Political, r.Feature, r.Profession, r.Flag, r.Provolunteer,
	); err == nil {
		//	成功直接返回数据
		//SendResponse(c, nil, uploadList)
		c.JSON(http.StatusOK, gin.H{
			"current": r.Current,
			"pageSize": r.PageSize,
			"data": studentList,
			"total": count.Count,
			"success": true,
			"message": "OK",
		})
		return
	}
	SendResponse(c, errno.ErrDatabase, nil)
	return
	
}

