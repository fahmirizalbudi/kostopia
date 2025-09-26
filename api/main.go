package main

import (
	"api/configs"
	"api/database/migrations"
	"api/helpers"
	"api/jobs"
	"api/router"

	migrate "github.com/rubenv/sql-migrate"
)

func main() {
	helpers.LoadENV()
	configs.GetPostgresConnection()
	configs.GetRedisConnection()
	migrations.Run(configs.DB, migrate.Up)
	go jobs.Run()
	defer configs.DB.Close()

	router.Setup().Run()
	select {}
}