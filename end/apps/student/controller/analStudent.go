package controller

import (
	"sort"
	
	//"fmt"
	//"fmt"
	"github.com/gin-gonic/gin"
	
	. "../../../handler"
	"../dto"
	"../service"
	//"../../../pkg/auth"
	"../../../pkg/errno"
)


func AnalStudentNumber(c *gin.Context) {
	// 绑定参数
	var r dto.AnalStudentNumberRequest
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	
	// 聚合数据
	analNumberList, err := service.AnalStudentNumber(r.Sid, r.Year, r.Condition, r.Result, r.ScoreType);if err != nil {
		SendResponse(c, errno.ErrDatabase, nil)
		return
	}
	// 处理集合
	analStudentNumberResponseList := []dto.AnalStudentNumberResponseList{}
	for _, v := range analNumberList {
		analStudentNumberResponseListItem := dto.AnalStudentNumberResponseList{}
		analStudentNumberResponseListItem.Id = v.Id
		analStudentNumberResponseListItem.Count = v.Count
		if r.ScoreType != "" {
			analStudentNumberResponseListItem.MaxScore = int(v.MaxScore)
			analStudentNumberResponseListItem.MinScore = int(v.MinScore)
			analStudentNumberResponseListItem.AvgScore = int(v.AvgScore)
			// 取列表中位数
			scoreList := v.ScoreList
			sort.Float64s(scoreList)
			analStudentNumberResponseListItem.MidScore = int(scoreList[int(len(scoreList)/2)])
		}
		analStudentNumberResponseList = append(analStudentNumberResponseList, analStudentNumberResponseListItem)
	}
	
	SendResponse(c, nil, dto.AnalStudentNumberResponse{
		Result: r.Result,
		List: analStudentNumberResponseList,
	})
	return
}

func AnalStudentScheme(c *gin.Context) {
	// 绑定参数
	var r dto.AnalStudentSchemeRequest
	if err := c.ShouldBindJSON(&r); err != nil {
		SendResponse(c, errno.ErrBind, nil)
		return
	}
	analStudentSchemeList := service.AnalStudentSchemeList(r.Sid, r.Year, r.ConditionList)
	//fmt.Println(analStudentSchemeList)
	SendResponse(c, nil, analStudentSchemeList)
	return
}
