package jobs

import (
	"api/configs"
	repo "api/repositories"
	"fmt"

	"github.com/robfig/cron/v3"
)

func Run() {
	c := cron.New(cron.WithSeconds())

	var count int

	_, err := c.AddFunc("*/5 * * * * *", func() {
		if err := repo.UpdateRentalStatusIfTransactionIsSuccess(configs.DB); err != nil {
			panic(err)
		}
		if err := repo.UpdateRoomStatusIfRentalIsActive(configs.DB); err != nil {
			panic(err)
		}
		if err := repo.CancelRentalIfNotProceed(configs.DB); err != nil {
			panic(err)
		}
		if err := repo.RejectTransactionIfEwalletAndMoreThanThirtyMinutes(configs.DB); err != nil {
			panic(err)
		}
		if err := repo.CancelRentalIfTransactionIsRejected(configs.DB); err != nil {
			panic(err)
		}
		if err := repo.FinishRentalOnEndDate(configs.DB); err != nil {
			panic(err)
		}
		count++
	})
	if err != nil {
		fmt.Println("Error menambahkan cron:", err)
		return
	}
	c.Start()
	fmt.Println("\033[1;33m[INFO] Cron job has started successfully!\033[0m")
}
