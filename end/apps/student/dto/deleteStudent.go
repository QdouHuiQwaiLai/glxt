package dto

//type DeleteStudentRequest struct {
//	StId 				primitive.ObjectID		`json:"id" bson:"_id"`
//}

type DeleteStudentRequest struct {
	StId 				string		`json:"stId" bson:"stId"`
}
