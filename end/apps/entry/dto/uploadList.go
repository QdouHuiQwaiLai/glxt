package dto

type GetUpLoadListRequest struct {
	Sid				string								`json:"sid" form:"sid"`	//
	Year 			int										`json:"year" form:"year"`
	Current   int										`json:"current" form:"current"`	// 当前页数
	PageSize	int										`json:"pageSize" form:"pageSize"`	// 每页的数量
}
