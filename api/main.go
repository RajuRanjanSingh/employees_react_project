package main

import (
	"log"
	"github.com/go-pg/pg/v9"
	"github.com/gin-gonic/gin"
	"net/http"
	orm "github.com/go-pg/pg/v9/orm"
	//"github.com/jackc/pgtype"
	"github.com/gin-contrib/cors"
	"os"

)
var dbUser = os.Getenv("DB_USER")
var dbPass = os.Getenv("DB_PASS")
var dbaddr = os.Getenv("DB_ADDR")
var dbDatabase = os.Getenv("DB_DATABASE")


// Connecting to db
func connect() *pg.DB {
	opts := &pg.Options{
		User: dbUser,
		Password: dbPass,	
		Addr: dbaddr,
		Database: dbDatabase,
	}
	var db *pg.DB = pg.Connect(opts)
	if db == nil {
		log.Printf("Failed to connect")
	}
	log.Printf("Connected to db")
	createTable(db)
	initiateDB(db)
	return db
}
type LeaveType string
const (
	sickLeave   LeaveType = "sickleave"
	casualLeave  LeaveType = "casualleave"
	earnedLeave  LeaveType= "earnedleave"
	
)
type TeamName string
const (
	designops TeamName = "Designops"
	secops TeamName = "Secops"
	cloudops TeamName = "cloudops"
	
)

type ReporterType string
const (
	sandeepsir   ReporterType = "Sandeep sir"
	surajsir ReporterType = "Suraj sir"
	sahilsir ReporterType = "Sahil sir"
)


type Employee struct {
	Id int `json:"id" pg:"id"`
	Name     string  `json:"name"`
	LeaveType   LeaveType  `json:"leave_type" pg:"type:leave_enum"`
    Fromdate string  `json:"fromdate"`
    Todate string `json:"todate"`
	Team_Name   TeamName     `json:"team_name" pg:"type:team_enum"`
	File_upload string `json:"file_upload"`
	Reporter    ReporterType `json:"reporter" pg:"type:reporter_enum"`
}


// Create User Table
func createTable(db *pg.DB) {
	opts := &orm.CreateTableOptions{
	IfNotExists: true,
	}
	createError := db.CreateTable(&Employee{}, opts)
	if createError != nil {
		log.Printf("Error while creating employee table")
	}
	log.Printf("table created")
}


// INITIALIZE DB CONNECTION 
var dbConnect *pg.DB
func initiateDB(db *pg.DB) {
	dbConnect = db
}

func getTable(c *gin.Context){
	var Employees []Employee
	err := dbConnect.Model(&Employees).Select()
    if err != nil {
	log.Printf("Error while getting all leave form")
	c.JSON(http.StatusInternalServerError, gin.H{
		"status":  http.StatusInternalServerError,
		"message": "Something went wrong",
		})
	return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "All employee table",
		"data": Employees,
	})
	return
}

func postLeave(c *gin.Context) {
    var employees Employee
	c.BindJSON(&employees)
    insertError := dbConnect.Insert(&employees)
    if insertError != nil {
	log.Printf("Error while inserting new employee into db, Reason: %v\n", insertError)
	c.JSON(http.StatusInternalServerError, gin.H{
		"status":  http.StatusInternalServerError,
		"message": "Something went wrong",
	})
	return
}
	c.JSON(http.StatusCreated, gin.H{
		"status":  http.StatusCreated,
		"message": "Table created Successfully",	
	})
	return
}

func routes(router *gin.Engine) {
	router.GET("/", welcome)
	router.GET("/get", getTable)
	router.POST("/post",postLeave)
}

func welcome(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  200,
		"message": "Welcome To API",
	})
	return
}

func main() {
	connect()                     // Connect DB
	router := gin.Default()   
	router.Use(cors.Default())
	routes(router)                // Route Handlers 
	log.Fatal(router.Run(":4747"))
}


/*  {
      "name": "Raju Ranjan Singh",
      "leave_type": "sickleave",
      "fromdate": "2023-06-21",
      "todate": "2023-06-25",
      "team_name": "Designops",
      "file_upload": "medical.png",
      "reporter": "Sahil sir"
    }
*/