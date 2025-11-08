package configs

import (
	"api/utils"
	"fmt"
	"os"
	"strconv"

	"github.com/redis/go-redis/v9"
)

var (
	Redis *redis.Client
)

func GetRedisConnection() {
	REDISDATABASE, err := strconv.Atoi(os.Getenv("REDISDATABASE"))
	if err != nil {
		REDISDATABASE = 0
	}

	Redis = redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDISHOST"),
		DB:   REDISDATABASE,
	})

	_, err = Redis.Ping(utils.Ctx).Result()
	if err != nil {
		panic(err)
	}

	fmt.Println("\033[1;32m" + "[SUCCESS] Redis connection established successfully!" + "\033[0m")
}
