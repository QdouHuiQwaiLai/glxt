package dto

type DeleteSchoolRequest struct {
	Sid 	string		`json:"sid"`
}


type DeleteSchoolYearRequest struct {
	Sid 	string		`json:"sid"`
	Year  int				`json:"year"`
}
