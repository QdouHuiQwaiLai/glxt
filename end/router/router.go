package router

import (
	"net/http"
	
	entry "../apps/entry/controller"
	school "../apps/school/controller"
	student "../apps/student/controller"
	user "../apps/user/controller"
	
	"../handler/sd"
	"../router/middleware"
	
	"github.com/gin-gonic/gin"
)

// Load loads the middlewares, routes, handlers.
func Load(g *gin.Engine, mw ...gin.HandlerFunc) *gin.Engine {
	// Middlewares.
	g.Use(gin.Recovery())
	g.Use(middleware.NoCache)
	g.Use(middleware.Options)
	g.Use(middleware.Secure)
	g.Use(mw...)
	// 404 Handler.
	g.NoRoute(func(c *gin.Context) {
		c.String(http.StatusNotFound, "The incorrect API route.")
	})

	// The health check handlers
	svcd := g.Group("/sd")
	{
		svcd.GET("/health", sd.HealthCheck)
		svcd.GET("/disk", sd.DiskCheck)
		svcd.GET("/cpu", sd.CPUCheck)
		svcd.GET("/ram", sd.RAMCheck)
	}
	
	u := g.Group("/v1/user")
	{
		u.POST("/create",  user.CreateUser, )
		u.POST("/login", user.Login,)
		u.POST("/parentCreate", middleware.AuthMiddleware(), middleware.IsParentMiddleware(), user.ParentCreateUser)
		u.POST("/changePwd", middleware.AuthMiddleware(), user.ChangePwd)
		u.GET("/getUserList", middleware.AuthMiddleware(), middleware.IsParentMiddleware(), user.GetUserList)
		u.POST("/deleteUser",middleware.AuthMiddleware(), middleware.IsParentMiddleware() ,user.DeleteUser)
	}
	
	e := g.Group("/v1/entry")
	e.Use(middleware.AuthMiddleware())
	{
		e.POST("/upload", middleware.IsParentMiddleware(), entry.Upload)
		e.GET("/getTaskProgress", middleware.IsParentMiddleware(), entry.GetTaskProgress)
		e.GET("/getUploadList", middleware.IsParentMiddleware(), entry.GetUploadList)
		e.POST("/deleteTaskFile", middleware.IsParentMiddleware(), entry.DeleteTaskFile)
	}
	
	
	sch := g.Group("/v1/school")
	sch.Use(middleware.AuthMiddleware())
	{
		sch.POST("/addName", middleware.IsParentMiddleware(), school.AddSchoolName)
		sch.GET("/getSchoolList", middleware.ChangeUserIdMiddleware(),school.GetSchoolList)
		sch.POST("/deleteSchool", middleware.IsParentMiddleware(), school.DeleteSchool)
		sch.POST("/deleteSchoolYear", middleware.IsParentMiddleware(), school.DeleteSchoolYear)
	}
	
	
	stu := g.Group("/v1/student")
	stu.Use(middleware.AuthMiddleware())
	{
		stu.GET("/getStudentList", middleware.ChangeUserIdMiddleware(),student.GetStudentList)
		stu.POST("/analStudentNumber", middleware.ChangeUserIdMiddleware(),student.AnalStudentNumber)
		stu.POST("/deleteStudent", middleware.IsParentMiddleware(),student.DeleteStudent)
		stu.POST("/updateList", middleware.IsParentMiddleware(),student.UpdateStudent)
		stu.POST("/analStudentScheme", middleware.ChangeUserIdMiddleware(),student.AnalStudentScheme)
	}
	return g
}
