package dto

type ChangePwdRequest struct {
	Password		 string		`json:"password"`
	NewPwd 			 string		`json:"newPwd"`
}
