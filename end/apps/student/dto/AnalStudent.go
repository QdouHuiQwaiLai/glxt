package dto


type AnalNumber struct {
	Id 				interface{}		`json:"id" bson:"_id"`
	Count			int						`json:"count" bson:"count"`
	MaxScore	float64				`json:"maxScore" bson:"maxScore"`
	MinScore	float64				`json:"minScore" bson:"minScore"`
	AvgScore	float64				`json:"avgScore" bson:"avgScore"`
	ScoreList	[]float64			`json:"scoreList" bson:"scoreList"`
}


type AnalStudentNumberRequest struct {
	Sid					string										`json:"sid"`
	Year				int												`json:"year"`
	Condition		map[string]interface{}		`json:"condition"`
	ScoreType		string										`json:"scoreType"`
	Result 			string										`json:"result"`
}

type AnalStudentNumberResponseList struct {
	Id 				interface{}		`json:"id" bson:"_id"`
	Count			int						`json:"count" bson:"count"`
	MaxScore	int						`json:"maxScore" bson:"maxScore"`
	MinScore	int						`json:"minScore" bson:"minScore"`
	AvgScore	int						`json:"avgScore" bson:"avgScore"`
	MidScore	int						`json:"midScore" bson:"midScore"`
}

type AnalStudentNumberResponse struct {
	Result     string														`json:"result"`
	List 			 []AnalStudentNumberResponseList		`json:"list"`
}


// 录取计划请求
type AnalStudentSchemeRequest struct {
	Sid							string										`json:"sid"`
	Year						int												`json:"year"`
	ConditionList		[]SchemeCondition	`json:"conditionList"`
}

// 计划数据查询调剂
type SchemeCondition struct {
	Province		int			`json:"province"`
	Profession	int			`json:"profession"`
	Branch 			int			`json:"branch"`
	Num 				int			`json:"num"`
	FullNum			int			`json:"fullNum"`
}

// 查询计划数据库结果
type AnalScheme struct {
	Id 				struct{
		Flag					bool		`json:"flag" bson:"flag"`
		Line					bool		`json:"line" bson:"line"`
		Provolunteer	string	`json:"provolunteer" bson:"provolunteer"`
	}		`json:"id" bson:"_id"`
	Count			int						`json:"count" bson:"count"`
	ScoreList	[]float64			`json:"scoreList" bson:"scoreList"`
}


// 计划信息处理后到结果
type AnalSchemeResult struct {
	Province			int			`json:"province"`				// 省份
	Profession		int			`json:"profession"`			// 专业
	Branch 				int			`json:"branch"`					// 科类
	Num 					int			`json:"num"`						// 计划人数
	FullNum				int			`json:"fullNum"`				// 填报人数
	FullPercent		int			`json:"fullPercent"`		// 填报率
	MaxScore			int			`json:"maxScore"`				// 最高分数
	MinScore			int			`json:"minScore"`				// 最低分数
	AvgScore			int			`json:"avgScore"`				// 平均分数
	MidScore			int			`json:"midScore"`				// 中间分数
	ActualNum			int			`json:"actualNum"`			// 实际录取人数
	FirstNum			int			`json:"firstNum"`				// 第一志愿人数
	FirstPercent	int			`json:"firstPercent"`		// 第一志愿的录取率
	LastNum				int			`json:"lastNum"`				// 调剂人数
	LastPercent		int			`json:"lastPercent"`		// 调剂概率
	LineNum				int			`json:"lineNum"`				// 过重点线人数
	LinePercent		int			`json:"linePercent"`		// 重点概率
	FlagNum				int			`json:"flagNum"`				// 报道人数
	FlagPercent		int			`json:"flagPercent"`		// 报道概率
}