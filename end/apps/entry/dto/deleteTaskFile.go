package dto

type DeleteTaskFileRequest struct {
	Sid       			string		`json:"sid"`
	Year 						int				`json:"year"`
	TaskFile 				string		`json:"taskFile"`
	DeleteYear			bool			`json:"deleteYear"`
	DeleteStudent		bool			`json:"deleteStudent"`
}
