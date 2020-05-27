package controller

import (
	"fmt"
	//"fmt"
	//"fmt"
	"github.com/gin-gonic/gin"
	
	. "../../../handler"
	//"../../../pkg/auth"
	"../../../pkg/errno"
	
	"../dto"
	"../service"
	
	schoolService "../../../apps/school/service"
	studentService "../../../apps/student/service"
)


func DeleteTaskFile(c *gin.Context) {
	// 绑定参数
	var r dto.DeleteTaskFileRequest
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	
	fmt.Println(r)
	// 删除此条任务
	err := service.DeleteTaskFile(r.TaskFile); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	// 是否删除学校下的该年份
	if r.DeleteYear {
		err = schoolService.DeleteSchoolYear(r.Sid, r.Year); if err != nil {
			SendResponse(c, errno.ErrDatabase, nil)
			return
		}
	}
	// 是否删除此次导入的数据
	if r.DeleteStudent {
		err = studentService.TaskFileDeleteStudents(r.TaskFile); if err != nil {
			SendResponse(c, errno.ErrDatabase, nil)
			return
		}
	}
	SendResponse(c, nil, nil)
	return
	
}

