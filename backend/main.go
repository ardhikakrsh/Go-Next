package main

import (
	"fmt"
	"log"
	"os"

	"leave-manager/model"
	"leave-manager/router"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	loadEnv()
	db = initDatabase()

	// Test database connection
	var result []map[string]interface{}
	if err := db.Raw("SELECT * FROM leaves").Scan(&result).Error; err != nil {
		log.Fatalf("Database connection failed: %s", err.Error())
	} else {
		fmt.Println("Database connected successfully!")
		fmt.Printf("Result: %+v\n", result)
	}

	// Start Gin server
	r := gin.Default()

	// Initialize routes
	router.Init(r, db)

	// Start the server
	port := getEnv("PORT", "8080")
	log.Printf("Server running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %s", err.Error())
	}
}

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Warning: No .env file found. Falling back to system environment variables.")
	}
}

func initDatabase() *gorm.DB {
	// dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s TimeZone=Asia/Bangkok",
	// 	getEnv("DB_HOST", "127.0.0.1"),
	// 	getEnv("DB_USER", "postgres"),
	// 	getEnv("DB_PASSWORD", ""),
	// 	getEnv("DB_NAME", "leave-managerDB"),
	// 	getEnv("DB_PORT", "5432"),
	// )

	dsn := "postgresql://postgres@127.0.0.1/leave-managerDB?sslmode=disable"
	// Koneksi ke database
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}

	// Lakukan migrasi setelah koneksi berhasil
	err = db.AutoMigrate(&model.Leave{})
	if err != nil {
		panic("Failed to migrate database: " + err.Error())
	}

	return db
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
