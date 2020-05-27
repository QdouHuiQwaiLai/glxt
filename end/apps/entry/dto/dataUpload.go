package dto

type UploadSchool struct {
	Year				int							`json:"year"			bson:"year"`
	Branch 			[]string				`json:"branch"		bson:"branch"`
	Plan   			[]string				`json:"plan"			bson:"plan"`
	Language		[]string				`json:"language"	bson:"language"`
	Political		[]string				`json:"political"	bson:"political"`
	Feature			[]string				`json:"feature"		bson:"feature"`
	Department	[]string				`json:"department" bson:"department"`
	Profession	[] struct{
		Name 		string						`json:"name"			bson:"name"`
		Parent	int								`json:"parent"		bson:"parent"`
	}														`json:"profession" bson:"profession"`
	Scheme [] struct{
		Province		int `json:"province" bson:"province"`
		Profession	int	`json:"profession" bson:"profession"`
		Num					int	`json:"num" bson:"num"`
		Branch			int	`json:"branch" bson:"branch"`
		FullNum			int	`json:"fullNum" bson:"fullNum"`
	}	`json:"scheme" bson:"scheme"`
}

type StudentsImportTaskResponse struct {
	Code			int				`json:"id"`
	Message		string		`json:"message"`
	Data  		struct{
		TaskId		string	`json:"taskId"`
		TaskFile	string	`json:"taskFile"`
	}										`json:"data"`
}

type ImportStudentsProgress struct {
	Code			int				`json:"id"`
	Message		string		`json:"message"`
}

type UploadResponse struct {
	UploadId interface{}			`json:"UploadId"`
}

type GetTaskProgressRequest struct {
	TaskId string `json:"taskId" form:"taskId"`
}

type GetTaskProgressResponse struct {
	Status int `json:"status" form:"status"`
}