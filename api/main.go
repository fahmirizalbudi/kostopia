package main

import (
	"api/bootstrap"
	"api/utils"
	"fmt"
)

func main() {
	utils.ClearScreen()
	fmt.Println("\033[32m" + "[SUCCESS] Server is running on http://0.0.0.0:8080!" + "\033[0m")
	bootstrap.Load()
}
