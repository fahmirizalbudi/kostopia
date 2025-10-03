package repositories

import (
	"api/helpers"
	req "api/types/structs/requests"
	res "api/types/structs/responses"
	"database/sql"
	"fmt"

	"github.com/gin-gonic/gin"
)

func GetNewTransactionID(dbParam *sql.DB) (response string) {
	sqlStatement := "SELECT id FROM transactions ORDER BY id DESC LIMIT 1"

	var lastTransactionID string
	err := dbParam.QueryRow(sqlStatement).Scan(&lastTransactionID)
	if err == sql.ErrNoRows {
		lastTransactionID = "TRX0000"
	} else if err != nil {
		panic(err)
	}

	var lastTransactionNum int
	fmt.Sscanf(lastTransactionID, "TRX%d", &lastTransactionNum)
	response = fmt.Sprintf("TRX%04d", lastTransactionNum+1)

	return
}

func GetAllTransactions(dbParam *sql.DB) (response []res.TransactionWithRentalResponse, err error) {
	sqlStatement := "SELECT * FROM transactions"

	rows, err := dbParam.Query(sqlStatement)
	if err != nil {
		panic(err)
	}

	defer rows.Close()
	for rows.Next() {
		var transaction res.TransactionWithRentalResponse

		err = rows.Scan(&transaction.ID, &transaction.RentalID, &transaction.DormitoryPrice, &transaction.MonthPaid, &transaction.Amount, &transaction.Method, &transaction.Purpose, &transaction.Status, &transaction.Proof, &transaction.CreatedAt)
		if err != nil {
			panic(err)
		}

		rental, err := GetRentalWithRoomAndTenantByID(dbParam, transaction.RentalID)
		if err != nil {
			panic(err)
		}

		transaction.Rental = rental

		response = append(response, transaction)
	}

	return
}

func CreateTransaction(dbParam *sql.DB, transactionRequest req.TransactionRequest) (response res.TransactionResponse, err error) {
	sqlStatement := "INSERT INTO transactions (id, rental_id, dormitory_price, month_paid, amount, method, purpose, status, proof) SELECT $1 as id, $2 as rental_id, (SELECT price FROM dormitories WHERE id = (SELECT dormitory_id FROM rooms WHERE id = (SELECT room_id FROM rentals WHERE id = $3))) as dormitory_price, $4 as month_paid, (SELECT price FROM dormitories WHERE id = (SELECT dormitory_id FROM rooms WHERE id = (SELECT room_id FROM rentals WHERE id = $3))) * $4 as amount, $5 as method, $6 as purpose, $7 as status, $8 as proof RETURNING *"
	newTransactionID := GetNewTransactionID(dbParam)
	var proof sql.NullString
	if transactionRequest.Proof == "" {
		fmt.Println("Ya")
		proof = sql.NullString{String: "", Valid: false}
	} else {
		proof = sql.NullString{String: transactionRequest.Proof, Valid: true}
	}
	err = dbParam.QueryRow(sqlStatement, newTransactionID, transactionRequest.RentalID, transactionRequest.RentalID, transactionRequest.MonthPaid, transactionRequest.Method, transactionRequest.Purpose, transactionRequest.Status, proof).Scan(&response.ID, &response.RentalID, &response.DormitoryPrice, &response.MonthPaid, &response.Amount, &response.Method, &response.Purpose, &response.Status, &response.Proof, &response.CreatedAt)
	return
}

func AttachProofToTransactionByID(dbParam *sql.DB, id string, proof string) error {
	sqlStatement := "UPDATE transactions SET proof = $1 WHERE id = $2"
	result, err := dbParam.Exec(sqlStatement, proof, id)
	row, _ := result.RowsAffected()
	if row == 0 {
		return sql.ErrNoRows
	}
	return err
}

func ChangeTransactionStatus(dbParam *sql.DB, id string, status string) (err error) {
	sqlStatement := "UPDATE transactions SET status = $1 WHERE id = $2"
	result, err := dbParam.Exec(sqlStatement, status, id)
	row, _ := result.RowsAffected()
	if row == 0 {
		return sql.ErrNoRows
	}
	return err
}

func GetTransactionByID(dbParam *sql.DB, id string) (response res.TransactionWithRentalResponse, err error) {
	sqlStatement := "SELECT * FROM transactions WHERE id = $1"
	err = dbParam.QueryRow(sqlStatement, id).
		Scan(&response.ID, &response.RentalID, &response.DormitoryPrice, &response.MonthPaid, &response.Amount, &response.Method, &response.Purpose, &response.Status, &response.Proof, &response.CreatedAt)
	if err != nil {
		return response, err
	}

	rental, err := GetRentalWithRoomAndTenantByID(dbParam, response.RentalID)
	if err != nil {
		return response, err
	}
	response.Rental = rental

	return response, nil
}

func CheckLastTransactionStatusByRentalID(dbParam *sql.DB, rentalId int) (gin.H, error) {
	var id string
	var status string
	var method string
	sqlStatement := "SELECT id, status, method FROM transactions WHERE rental_id = $1 ORDER BY created_at ASC LIMIT 1"
	err := dbParam.QueryRow(sqlStatement, rentalId).Scan(&id, &status, &method)
	if err != nil {
		if err == sql.ErrNoRows {
			return gin.H{
				"status": "no_transaction",
			}, nil
		}
		return nil, err
	}

	return gin.H{
		"transaction_id": id,
		"method":         method,
		"status":         status,
	}, nil
}

func GetAuthenticatedUserTransactions(dbParam *sql.DB, claims *helpers.Claims) (response []res.TransactionWithRentalResponse, err error) {
	sqlStatement := "SELECT transactions.id, transactions.rental_id, transactions.dormitory_price, transactions.month_paid, transactions.amount, transactions.method, transactions.purpose, transactions.status, transactions.proof, transactions.created_at FROM transactions INNER JOIN rentals ON transactions.rental_id = rentals.id WHERE rentals.tenant_id = $1"

	rows, err := dbParam.Query(sqlStatement, claims.ID)
	if err != nil {
		panic(err)
	}

	defer rows.Close()
	for rows.Next() {
		var transaction res.TransactionWithRentalResponse

		err = rows.Scan(&transaction.ID, &transaction.RentalID, &transaction.DormitoryPrice, &transaction.MonthPaid, &transaction.Amount, &transaction.Method, &transaction.Purpose, &transaction.Status, &transaction.Proof, &transaction.CreatedAt)
		if err != nil {
			panic(err)
		}

		rental, err := GetRentalWithRoomAndTenantByID(dbParam, transaction.RentalID)
		if err != nil {
			panic(err)
		}

		transaction.Rental = rental

		response = append(response, transaction)
	}

	return
}
