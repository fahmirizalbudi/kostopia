package jobs

import (
	"api/configs"
	repo "api/repositories"
	"fmt"

	"github.com/robfig/cron/v3"
)

func Run() {
	c := cron.New(cron.WithSeconds())
	_, err := c.AddFunc("*/5 * * * * *", func() {
		if err := repo.UpdateRentalStatusIfTransactionIsSuccess(configs.DB); err != nil {
			fmt.Println("Error update rentals:", err)
		}
		if err := repo.UpdateRoomStatusIfRentalIsActive(configs.DB); err != nil {
			fmt.Println("Error update rooms:", err)
		}
		fmt.Println("Job is executing ...")
	})
	if err != nil {
		fmt.Println("Error menambahkan cron:", err)
		return
	}
	c.Start()
	fmt.Println("Cron job sudah start")
}
