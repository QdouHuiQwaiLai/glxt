package controller

import (
	"net/http"
	
	//"fmt"
	//"fmt"
	"github.com/gin-gonic/gin"
	
	. "../../../handler"
	//"../../../pkg/auth"
	"../../../pkg/errno"
	
	"../dto"
	"../service"
)


func GetUploadList(c *gin.Context) {
	// uid , sid, year 三个塞选条件加分页 current 当前页面  pageSize 显示个数
	// 获取jwt中的参数
	uid, ok := c.Get("id"); if !ok  {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	// 绑定参数
	var r dto.GetUpLoadListRequest
	if err := c.ShouldBindQuery(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	
	count, err := service.GetUploadListCount(uid.(string), r.Sid, r.Year,);
	if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	//fmt.Println(count)
	// 获取上传数据列表
	if uploadList, err := service.GetUploadList(uid.(string), r.Sid, r.Year, r.Current, r.PageSize); err == nil {
		//	成功直接返回数据
		//SendResponse(c, nil, gin.H{
		//
		//})
		c.JSON(http.StatusOK, gin.H{
			"current": r.Current,
			"pageSize": r.PageSize,
			"data": uploadList,
			"total": count.Count,
			"success": true,
			"message": "OK",
		})
		return
	}
	SendResponse(c, errno.ErrDatabase, nil)
	return
	
}

