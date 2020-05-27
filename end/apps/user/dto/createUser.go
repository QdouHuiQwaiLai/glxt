package dto

type CreateUserRequest struct {
	Username string `json:"username" binding:"required" validate:"min=1,max=32"`
	Password string `json:"password" binding:"required" validate:"min=5,max=128"`
	Parent string `json:"parent" binding:"required" validate:"min=5,max=128"`
}

type CreateUserResponse struct {
	Id interface{} `json:"id"`
}

type ParentCreateUser struct {
	Username string `json:"username" binding:"required" validate:"min=1,max=32"`
	Password string `json:"password" binding:"required" validate:"min=5,max=128"`
}