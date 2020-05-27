package controller

import (
	"fmt"
	"strconv"
	"time"
	
	//"fmt"
	"github.com/gin-gonic/gin"
	
	. "../../../handler"
	//"../../../pkg/auth"
	"../../../pkg/errno"
	"../../../pkg/util"
	
	schoolService "../../school/service"
	"../dto"
	"../service"
)


func Upload(c *gin.Context) {
	// 获取表单数据
	id := c.PostForm("id")
	year := c.PostForm("year")
	school, err := c.FormFile("school"); if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	student, err := c.FormFile("student"); if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	
	// 年份转int
	yearInt, err := strconv.Atoi(year); if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	
	// 判断当前学校和年份是否存在
	schoolList, err := schoolService.SchoolGetList(id, yearInt); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}; if len(schoolList) == 0 {
		// 打开学校数据
		schoolFile, err := school.Open(); if err != nil {
			SendResponse(c, errno.InternalServerError, nil)
			return
		}
		defer schoolFile.Close()
		// 解析学校数据
		schoolData, err := service.HandleSchoolJson(yearInt, schoolFile); if err != nil {
			SendResponse(c, errno.InternalServerError, nil)
			return
		}
		fmt.Println(schoolData)
		// 添加学校数据
		err = schoolService.AddData(id, schoolData); if err != nil {
			SendResponse(c, errno.ErrDatabase, nil)
			return
		}
	}
	
	// 文件存储
	// 随机文件名
	studentsFileName := fmt.Sprintf("%s_%s.json",
		strconv.FormatInt(time.Now().Unix(), 10), util.GetRandomString(8))
	// 存储文件
	err = c.SaveUploadedFile(student, fmt.Sprintf("%s%s", "/Users/ldl/Desktop/lunwen/code/djcy/imtepr/", studentsFileName)); if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	// 开启任务
	task, err :=  service.GetStudentsImportTask(id, yearInt, studentsFileName); if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	if task.Code == 0 {
		resultId, err := service.AddTaskInfo(id, yearInt, task.Data.TaskId, task.Data.TaskFile); if err != nil {
			SendResponse(c, errno.ErrDatabase, nil)
			return
		};
		SendResponse(c, nil, dto.UploadResponse{
			UploadId: resultId,
		})
		return
	}
	SendResponse(c, errno.InternalServerError, nil)	// 任务开启失败
	return
}


func SchoolFileUpload(c *gin.Context) {
	// 获取表单数据
	id := c.PostForm("id")
	year := c.PostForm("year")
	school, err := c.FormFile("school"); if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	student, err := c.FormFile("student"); if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	
	// 年份转int
	yearInt, err := strconv.Atoi(year); if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	
	// 判断当前学校和年份是否存在
	schoolList, err := schoolService.SchoolGetList(id, yearInt); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}; if len(schoolList) == 0 {
		// 打开学校数据
		schoolFile, err := school.Open(); if err != nil {
			SendResponse(c, errno.InternalServerError, nil)
			return
		}
		defer schoolFile.Close()
		// 解析学校数据
		schoolData, err := service.HandleSchoolJson(yearInt, schoolFile); if err != nil {
			SendResponse(c, errno.InternalServerError, nil)
			return
		}
		// 添加学校数据
		err = schoolService.AddData(id, schoolData); if err != nil {
			SendResponse(c, errno.ErrDatabase, nil)
			return
		}
	}
	
	// 文件存储
	// 随机文件名
	studentsFileName := fmt.Sprintf("%s_%s.json",
		strconv.FormatInt(time.Now().Unix(), 10), util.GetRandomString(8))
	// 存储文件
	err = c.SaveUploadedFile(student, fmt.Sprintf("%s%s", "/Users/ldl/Desktop/djcy/imtepr/", studentsFileName)); if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	// 开启任务
	task, err :=  service.GetStudentsImportTask(id, yearInt, studentsFileName); if err != nil {
		SendResponse(c, errno.InternalServerError, nil)
		return
	}
	if task.Code == 0 {
		resultId, err := service.AddTaskInfo(id, yearInt, task.Data.TaskId, task.Data.TaskFile); if err != nil {
			SendResponse(c, errno.ErrDatabase, nil)
			return
		};
		SendResponse(c, nil, dto.UploadResponse{
			UploadId: resultId,
		})
		return
	}
	SendResponse(c, errno.InternalServerError, nil)	// 任务开启失败
	return
}

func StudentFileUpload(c *gin.Context) {

}


func GetTaskProgress(c *gin.Context) {
	var r dto.GetTaskProgressRequest
	if err := c.ShouldBindQuery(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	
	// 在数据库中查询状态
	// 在数据库中 0是执行中， 1是执行成功， 2是执行失败异常, 返回前端也是按照这个标准
	taskInfo, err := service.GetTaskStatus(r.TaskId); if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	if taskInfo.Status == 0 {
		// 在django返回数据中
		//code->0时, message ->ok为执行成功不为OK时候是执行中
		// code为其他时候为失败/异常/错误 //TODO 暂时没有健全错误信息，不能在任务中自动更改状态，必须前端触发查询
		progress, err := service.GetImportStudentsProgress(r.TaskId); if err != nil {
			SendResponse(c, errno.InternalServerError, nil)
			return
		}
		if progress.Code == 0 {
			if progress.Message == "OK" {
				err = service.SetTaskStatus(r.TaskId, 1); if err != nil {
					SendResponse(c, errno.InternalServerError, nil)
					return
				}
				SendResponse(c, nil, dto.GetTaskProgressResponse{
					Status: 1,
				})
				return
			} else if progress.Message == "执行失败" {
				err = service.SetTaskStatus(r.TaskId, 2); if err != nil {
					SendResponse(c, errno.InternalServerError, nil)
					return
				}
				SendResponse(c, nil, dto.GetTaskProgressResponse{
					Status: 2,
				})
				return
			}  else {
				SendResponse(c, nil, dto.GetTaskProgressResponse{
					Status: 0,
				})
				return
			}
		} else {
			err = service.SetTaskStatus(r.TaskId, 2); if err != nil {
				SendResponse(c, errno.InternalServerError, nil)
				return
			}
			SendResponse(c, nil, dto.GetTaskProgressResponse{
				Status: 2,
			})
			return
		}
	} else if (taskInfo.Status == 1) ||  (taskInfo.Status == 2){
		SendResponse(c, nil, dto.GetTaskProgressResponse{
			Status: taskInfo.Status,
		})
		return
	}
	SendResponse(c, errno.InternalServerError, nil)	// 数据异常
	return
}

