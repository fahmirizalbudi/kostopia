package repositories

import (
	"api/helpers"
	req "api/types/structs/requests"
	res "api/types/structs/responses"
	"database/sql"
)

func GetAllRentals(dbParam *sql.DB) (response []res.RentalWithRoomAndTenantResponse, err error) {
	sqlStatement := "SELECT * FROM rentals"

	rows, err := dbParam.Query(sqlStatement)
	if err != nil {
		panic(err)
	}

	defer rows.Close()
	for rows.Next() {
		var rental res.RentalWithRoomAndTenantResponse

		err = rows.Scan(&rental.ID, &rental.RoomID, &rental.TenantID, &rental.StartDate, &rental.EndDate, &rental.DurationMonths, &rental.Status, &rental.CreatedAt)
		if err != nil {
			panic(err)
		}

		room, err := GetRoomByID(dbParam, rental.RoomID)
		if err != nil {
			panic(err)
		}

		rental.Room = room

		tenant, err := GetUserByID(dbParam, rental.TenantID)
		if err != nil {
			panic(err)
		}

		rental.Tenant = tenant

		response = append(response, rental)
	}

	return
}

func CreateRental(dbParam *sql.DB, rentalRequest req.RentalRequest) (response res.RentalResponse, err error) {
	sqlStatement := "INSERT INTO rentals (room_id, tenant_id, start_date, end_date, duration_months, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
	err = dbParam.QueryRow(sqlStatement, rentalRequest.RoomID, rentalRequest.TenantID, rentalRequest.StartDate, rentalRequest.EndDate, rentalRequest.DurationMonths, rentalRequest.Status).Scan(&response.ID, &response.RoomID, &response.TenantID, &response.StartDate, &response.EndDate, &response.DurationMonths, &response.Status, &response.CreatedAt)
	return
}

func ChangeRentalStatus(dbParam *sql.DB, id int, status string) error {
	sqlStatement := "UPDATE rentals SET status = $1 WHERE id = $2"
	result, err := dbParam.Exec(sqlStatement, status, id)
	row, _ := result.RowsAffected()
	if row == 0 {
		return sql.ErrNoRows
	}
	return err
}

func AddRentalDuration(dbParam *sql.DB, id, durationMonths int, endDate string) error {
	sqlStatement := "UPDATE rentals SET duration_months = duration_months + $1, end_date = $2 WHERE id = $3"
	result, err := dbParam.Exec(sqlStatement, durationMonths, endDate, id)
	row, _ := result.RowsAffected()
	if row == 0 {
		return sql.ErrNoRows
	}
	return err
}

func GetAuthenticatedUserRentals(dbParam *sql.DB, claims *helpers.Claims) (response []res.RentalResponse, err error) {
	sqlStatement := "SELECT * FROM rentals WHERE tenant_id = $1"

	rows, err := dbParam.Query(sqlStatement, claims.ID)
	if err != nil {
		panic(err)
	}

	defer rows.Close()
	for rows.Next() {
		var rental res.RentalResponse

		err = rows.Scan(&rental.ID, &rental.RoomID, &rental.TenantID, &rental.StartDate, &rental.EndDate, &rental.DurationMonths, &rental.Status, &rental.CreatedAt)

		response = append(response, rental)
	}

	return
}

func GetRentalByID(dbParam *sql.DB, id int) (response res.RentalResponse, err error) {
	sqlStatement := "SELECT * FROM rentals WHERE id = $1"
	err = dbParam.QueryRow(sqlStatement, id).Scan(&response.ID, &response.RoomID, &response.TenantID, &response.StartDate, &response.EndDate, &response.DurationMonths, &response.Status, &response.CreatedAt)
	return
}

func GetRentalWithRoomAndTenantByID(dbParam *sql.DB, id int) (response res.RentalWithRoomAndTenantResponse, err error) {
	sqlStatement := "SELECT * FROM rentals WHERE id = $1"
	err = dbParam.QueryRow(sqlStatement, id).Scan(&response.ID, &response.RoomID, &response.TenantID, &response.StartDate, &response.EndDate, &response.DurationMonths, &response.Status, &response.CreatedAt)
	if err != nil {
		panic(err)
	}

	room, err := GetRoomByID(dbParam, response.RoomID)
	if err != nil {
		panic(err)
	}

	response.Room = room

	tenant, err := GetUserByID(dbParam, response.TenantID)
	if err != nil {
		panic(err)
	}

	response.Tenant = tenant

	return
}

func UpdateRentalStatusIfTransactionIsSuccess(dbParam *sql.DB) error {
	sqlStatement := "UPDATE rentals SET status = 'active' FROM transactions WHERE transactions.rental_id = rentals.id AND transactions.status = 'success' AND rentals.status = 'pending' AND DATE(rentals.start_date) = CURRENT_DATE"
	_, err := dbParam.Exec(sqlStatement)
	return err
}

func CancelRentalIfNotProceed(dbParam *sql.DB) error {
	sqlStatement := "UPDATE rentals SET status = 'cancelled' WHERE status = 'pending' AND created_at <= CURRENT_TIMESTAMP - INTERVAL '30 minutes'"
	_, err := dbParam.Exec(sqlStatement)
	return err
}

func CancelRentalIfTransactionIsRejected(dbParam *sql.DB) error {
	sqlStatement := "UPDATE rentals SET status = 'cancelled' FROM transactions WHERE rentals.id = transactions.rental_id AND transactions.status = 'rejected' AND rentals.status = 'pending';"
	_, err := dbParam.Exec(sqlStatement)
	return err
}

func FinishRentalOnEndDate(dbParam *sql.DB) error {
	sqlStatement := "UPDATE rentals SET status = 'finished' WHERE DATE(end_date) = CURRENT_DATE"
	_, err := dbParam.Exec(sqlStatement)
	return err
}