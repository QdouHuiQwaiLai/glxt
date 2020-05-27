package main

import (
	studentDto "./apps/student/dto"
	//"./apps/entry/service"
	//schoolService "./apps/school/service"
	studentService "./apps/student/service"
	"go.mongodb.org/mongo-driver/bson/primitive"
	
	"math/rand"
	"time"
)

type Ts struct {
	Ao string		`bson:"ao"`
	//Ap []string `bson:"ap"`
}

type Student struct {
	Id 						primitive.ObjectID		`json:"id" bson:"_id"`
	OriginalId		string								`json:"originalId" bson:"originalId"`
	Sid						primitive.ObjectID		`json:"sid" bson:"sid"`
	Gender				int										`json:"gender" bson:"gender"`									// 性别
	Province			int										`json:"province" bson:"province"`							// 地区
	Branch				int										`json:"branch" bson:"branch"`									// 文理科
	Plan					int										`json:"plan" bson:"plan"`											// 计划类型
	Language			int										`json:"language" bson:"language"`							// 外语语言
	Political			int										`json:"political" bson:"political"`						// 政治面貌
	Feature				int										`json:"feature" bson:"feature"`								// 特长
	Profession		int										`json:"profession" bson:"profession"`					// 学院
	Flag					bool									`json:"flag" bson:"flag"`											// 是否报道
	Volunteer			string								`json:"volunteer" bson:"volunteer"`						// 志愿号
	Provolunteer	string								`json:"provolunteer" bson:"provolunteer"`			// 专业志愿号
	Score					float32								`json:"score" bson:"score"`										// 成绩
	Feascore			float32								`json:"feascore" bson:"feascore"`							// 特征成绩
	Mathsocre			float32								`json:"mathsocre" bson:"mathsocre"`						// 数学成绩
	Foreignscore	float32								`json:"foreignscore" bson:"foreignscore"`			// 外语成绩
	TaskFile			string								`json:"taskFile" bson:"taskFile"`
	Custom				interface{}						`json:"custom" bson:"custom"`									// 自定义
}

func  GetRandomString(l int) string {
	str := "0123456789abcdefghijklmnopqrstuvwxyz"
	bytes := []byte(str)
	result := []byte{}
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	for i := 0; i < l; i++ {
		result = append(result, bytes[r.Intn(len(bytes))])
	}
	return string(result)
}

func main()  {
	//service.Get("5eaaceb876a39a5fb3531ed9", 10)
	//now := time.Now().Unix()
	//dst := fmt.Sprintf("./save/%s_%s.json", strconv.FormatInt(now, 10), GetRandomString(8))
	//fmt.Println(dst)
	//fmt.Println(now)
	//fmt.Println(GetRandomString(5))
	//s, err :=service.GetStudentsImportTask("dadadad", 2019, "1.json")
	//if err != nil {
	//	fmt.Println(err)
	//}
	//fmt.Println(s.Data.TaskId)
	
	//v, err :=service.GetImportStudentsProgress("9399711e-f141-4d21-bb60-63359b3ba457", )
	//if err != nil {
	//	fmt.Println(err)
	//}
	//fmt.Println(v)

	//service.AddTaskInfo( "5ead35f74fda1867215b5444", 2018, "ada", "dada")
	//service.SetTaskStatus("9591b602-c810-4e1c-a0a5-34b5f5712f8d", 1)
	//a,_ :=service.GetTaskStatus("9591b602-c810-4e1c-a0a5-34b5f5712f8d")
	//fmt.Println(a)
	
	//// 获取学校列表测试
	//l ,e := schoolService.GetSchoolList("5ea8f1c265d9cd37f19d49b8", )
	//fmt.Println(l)
	//fmt.Println(e)
	//
	//// 获取上传任务列表测试
	//ll, ee := service.GetUploadList("5ea8f1c265d9cd37f19d49b8",
	//	"5ead41cf156e229f0e009a7c", 2018, 3, 1)
	//fmt.Println(ll)
	//fmt.Println(ee)
	//
	//// 修改密码
	//userService.UpdateUser("5eacce5dc8b76a0d202032b6", "jiayi55")
	//
	//// 子用户列表
	//ulist, _ := userService.GetUserList("15870483764")
	//fmt.Println(ulist)
	
	//e := schoolService.DeleteSchoolYear("5ead41cf156e229f0e009a7c", 2020)
	//fmt.Println(e)
	//
	//e = schoolService.DeleteSchool("5eae78e3973be1dca36e913d")
	//// 删除user
	//userService.DeleteUser("5eae73e237252f7a13203d49")
	
	//err := studentService.TaskFileDeleteStudents("1588427850_thvxrdf3")
	//fmt.Println(err)
	
	//ss, err := studentService.GetStudentList(
	//	"5eacce5dc8b76a0d202032b6",
	//	"",
	//	2019,
	//	"",
	//	1,
	//	2,
	//	)
	////fmt.Println(ss)
	//for _,v := range ss {
	//	fmt.Println(v)
	//}
	//fmt.Println(err)
	//
	//err = studentService.DeleteStudent("5eaf7f214fda1867215d5d8c")
	//id, err := primitive.ObjectIDFromHex("5eaf7f214fda1867215d5d8a")
	//sid, err := primitive.ObjectIDFromHex("5eaf7f214fda1867215d5d8a")
	//s := studentDto.Student{
	//	Id:           id,
	//	OriginalId:   "",
	//	Year:         9998,
	//	Sid:          sid,
	//	Gender:       0,
	//	Province:     0,
	//	Branch:       0,
	//	Plan:         0,
	//	Language:     0,
	//	Political:    0,
	//	Feature:      0,
	//	Profession:   0,
	//	Flag:         false,
	//	Volunteer:    "",
	//	Provolunteer: "",
	//	Score:        0,
	//	Feascore:     0,
	//	Mathsocre:    0,
	//	Foreignscore: 0,
	//	TaskFile:     "",
	//	Custom:       nil,
	//}
	//err = studentService.UpdateStudent(s)
	//conditionList := make(map[string]interface{})
	//conditionList["gender"] = []int{1,2}
	////conditionList["plan"] = []int{1,1,1}
	//sss, err := studentService.AnalStudentNumber(
	//	"5ead41cf156e229f0e009a7c",
	//	2019,
	//	conditionList,
	//	"profession",
	//	"score",
	//	)
	//fmt.Println(sss, err)
	
	
	type Condition struct {
		Province   int `json:"province"`
		Profession int `json:"profession"`
		Branch     int `json:"branch"`
	}
	
	//ss := studentService.SchemeCondition{21,0,3}
	//fmt.Println(ss)
	//s1s, _ := studentService.AnalStudentScheme("5ead41cf156e229f0e009a7c", 2018, ss)
	//fmt.Println(s1s)
	
	type SchemeCondition struct {
		Province		int			`json:"province"`
		Profession	int			`json:"profession"`
		Branch 			int			`json:"branch"`
	}
	bbs := []studentDto.SchemeCondition{{21, 0, 3, 45, 144},
		{21, 1, 3, 11, 11},
	}
	studentService.AnalStudentSchemeList("5ead41cf156e229f0e009a7c", 2019, bbs)
}
