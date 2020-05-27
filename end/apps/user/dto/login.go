package dto

type LoginRequest struct {
	Username string `json:"username" binding:"required" validate:"min=1,max=32"`
	Password string `json:"password" binding:"required" validate:"min=5,max=128"`
}

type LoginResponse struct {
	Id interface{} `json:"id"`
}

type Token struct {
	Token 							string `json:"token"`
	CurrentAuthority		string	`json:"currentAuthority"`
}

