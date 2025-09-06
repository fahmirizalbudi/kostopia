package repositories

import (
	req "api/types/structs/requests"
	res "api/types/structs/responses"
	"api/utils/password"
	"database/sql"
	"fmt"
)

func GetAllUsers(dbParam *sql.DB) (response []res.UserResponse, err error) {
	sqlStatement := "SELECT id, name, email, role, phone, address, created_at, updated_at FROM users"

	rows, err := dbParam.Query(sqlStatement)
	if err != nil {
		panic(err)
	}

	defer rows.Close()
	for rows.Next() {
		var user res.UserResponse

		err = rows.Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.Phone, &user.Address, &user.CreatedAt, &user.UpdatedAt)
		if err != nil {
			panic(err)
		}

		response = append(response, user)
	}
	return
}

func CreateUser(dbParam *sql.DB, userRequest req.UserRequest) (response res.UserResponse, err error) {
	sqlStatement := "INSERT INTO users (name, email, password, role, phone, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, phone, address, created_at, updated_at"
	err = dbParam.QueryRow(sqlStatement, userRequest.Name, userRequest.Email, userRequest.Password, userRequest.Role, userRequest.Phone, userRequest.Address).Scan(&response.ID, &response.Name, &response.Email, &response.Role, &response.Phone, &response.Address, &response.CreatedAt, &response.UpdatedAt)
	return
}

func GetUserByID(dbParam *sql.DB, id int) (response res.UserResponse, err error) {
	sqlStatement := "SELECT id, name, email, role, phone, address, created_at, updated_at FROM users WHERE id = $1"
	err = dbParam.QueryRow(sqlStatement, id).Scan(&response.ID, &response.Name, &response.Email, &response.Role, &response.Phone, &response.Address, &response.CreatedAt, &response.UpdatedAt)
	return
}

func UpdateUser(dbParam *sql.DB, id int, userRequest req.UserRequest) (response res.UserResponse, err error) {
	var sqlStatement string
	if userRequest.Password != "" {
		userRequest.Password = password.Hash(userRequest.Password)
		sqlStatement = "UPDATE users SET name = $1, email = $2, password = $3, role = $4, phone = $5, address = $6, updated_at = NOW() WHERE id = $7 RETURNING id, name, email, role, phone, address, created_at, updated_at"
		err = dbParam.QueryRow(sqlStatement, userRequest.Name, userRequest.Email, userRequest.Password, userRequest.Role, userRequest.Phone, userRequest.Address, id).Scan(&response.ID, &response.Name, &response.Email, &response.Role, &response.Phone, &response.Address, &response.CreatedAt, &response.UpdatedAt)
	} else {
		fmt.Println("No Pw")
		sqlStatement = "UPDATE users SET name = $1, email = $2, role = $3, phone = $4, address = $5, updated_at = NOW() WHERE id = $6 RETURNING id, name, email, role, phone, address, created_at, updated_at"
		err = dbParam.QueryRow(sqlStatement, userRequest.Name, userRequest.Email, userRequest.Role, userRequest.Phone, userRequest.Address, id).Scan(&response.ID, &response.Name, &response.Email, &response.Role, &response.Phone, &response.Address, &response.CreatedAt, &response.UpdatedAt)
	}
	return
}

func DeleteUser(dbParam *sql.DB, id int) error {
	sqlStatement := "DELETE FROM users WHERE id = $1"
	result, err := dbParam.Exec(sqlStatement, id)
	row, _ := result.RowsAffected()
	if row == 0 {
		return sql.ErrNoRows
	}
	return err
}

func GetUserByEmail(dbParam *sql.DB, loginRequest req.LoginRequest) (response res.UserResponse, hashedPassword string, err error) {
	sqlStatement := "SELECT * FROM users WHERE email = $1"
	err = dbParam.QueryRow(sqlStatement, loginRequest.Email).Scan(&response.ID, &response.Name, &response.Email, &hashedPassword, &response.Role, &response.Phone, &response.Address, &response.CreatedAt, &response.UpdatedAt)
	return
}
