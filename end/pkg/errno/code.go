package errno

var (
	// Common errors
	OK                  =  &Errno{Code: 0, Message: "OK"}
	InternalServerError =  &Errno{Code: 10001, Message: "Internal server error"}
	ErrBind             =  &Errno{Code: 10002, Message: "Error occurred while binding the request body to the struct."}
	
	ErrValidation 			=  &Errno{Code: 20001, Message: "Validation failed."}
	ErrDatabase   			=  &Errno{Code: 20002, Message: "Database error."}
	ErrToken      			=  &Errno{Code: 20003, Message: "Error occurred while signing the JSON web token."}
	ErrTokenInvalid      = &Errno{Code: 20004, Message: "The token was invalid."}
	ErrTokenDenied       = &Errno{Code: 20005, Message: "The token was Permission denied."}
	
	// user errors
	ErrEncrypt           = &Errno{Code: 20101, Message: "Error occurred while encrypting the user password."}
	ErrUserNotFound      = &Errno{Code: 20102, Message: "The user was not found."}
	ErrPasswordIncorrect = &Errno{Code: 20104, Message: "The password was incorrect."}
	ErrUserExists =				 &Errno{Code: 20105, Message: "The user was already exists."}
	ErrParentNotFound = 	 &Errno{Code: 20106, Message: "The parent was do not operate."}
	
	// school errors
	
	// entry errors
)
