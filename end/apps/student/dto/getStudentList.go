package dto

type GetStudentListRequest struct {
	Sid						string								`json:"sid" form:"sid"`	//
	Year 					int										`json:"year" form:"year"`
	Current   		int										`json:"current" form:"current"`	// 当前页数
	PageSize			int										`json:"pageSize" form:"pageSize"`	// 每页的数量
	OriginalId		string								`json:"originalId" form:"originalId"`
	Gender				string									`json:"gender" form:"gender"`									// 性别
	Province			string									`json:"province" form:"province"`							// 地区
	Branch				string									`json:"branch" form:"branch"`									// 文理科
	Plan					string									`json:"plan" form:"plan"`											// 计划类型
	Language			string									`json:"language" form:"language"`							// 外语语言
	Political			string									`json:"political" form:"political"`						// 政治面貌
	Feature				string									`json:"feature" form:"feature"`								// 特长
	Profession		string									`json:"profession" form:"profession"`					// 学院
	Flag					string									`json:"flag" form:"flag"`											// 是否报道
	Line 					string									`json:"line" form:"line"`										// 是否过重点线
	Provolunteer	string								`json:"provolunteer" form:"provolunteer"`			// 专业志愿号
	TaskFile			string								`json:"taskFile" form:"taskFile"`
}

