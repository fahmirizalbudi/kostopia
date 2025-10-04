package repositories

import (
	req "api/types/structs/requests"
	res "api/types/structs/responses"
	"database/sql"
)

func GetAllRoomsWithDormitory(dbParam *sql.DB) (responses []res.RoomWithDormitoryResponse, err error) {
	sqlStatement := "SELECT * FROM rooms"

	rows, err := dbParam.Query(sqlStatement)
	if err != nil {
		panic(err)
	}

	defer rows.Close()
	for rows.Next() {
		var room res.RoomWithDormitoryResponse

		err = rows.Scan(&room.ID, &room.DormitoryID, &room.RoomNumber, &room.Status, &room.CreatedAt, &room.UpdatedAt)
		if err != nil {
			panic(err)
		}

		dormitory, err := GetDormitoryByID(dbParam, room.DormitoryID)
		if err != nil {
			panic(err)
		}

		room.Dormitory = dormitory

		responses = append(responses, room)
	}

	return
}

func CreateRoom(dbParam *sql.DB, roomRequest req.RoomRequest) (response res.RoomResponse, err error) {
	sqlStatement := "INSERT INTO rooms (dormitory_id, room_number) VALUES ($1, $2) RETURNING *"
	err = dbParam.QueryRow(sqlStatement, roomRequest.DormitoryID, roomRequest.RoomNumber).Scan(&response.ID, &response.DormitoryID, &response.RoomNumber, &response.Status, &response.CreatedAt, &response.UpdatedAt)
	return
}

func GetRoomByID(dbParam *sql.DB, id int) (response res.RoomResponse, err error) {
	sqlStatement := "SELECT * FROM rooms WHERE id = $1"
	err = dbParam.QueryRow(sqlStatement, id).Scan(&response.ID, &response.DormitoryID, &response.RoomNumber, &response.Status, &response.CreatedAt, &response.UpdatedAt)
	return
}

func UpdateRoom(dbParam *sql.DB, id int, roomRequest req.RoomRequest) (response res.RoomResponse, err error) {
	sqlStatement := "UPDATE rooms SET dormitory_id = $1, room_number = $2, status = $3, updated_at = NOW() WHERE id = $4 RETURNING *"
	err = dbParam.QueryRow(sqlStatement, roomRequest.DormitoryID, roomRequest.RoomNumber, roomRequest.Status, id).Scan(&response.ID, &response.DormitoryID, &response.RoomNumber, &response.Status, &response.CreatedAt, &response.UpdatedAt)
	return
}

func DeleteRoom(dbParam *sql.DB, id int) error {
	sqlStatement := "DELETE FROM rooms WHERE id = $1"
	result, err := dbParam.Exec(sqlStatement, id)
	row, _ := result.RowsAffected()
	if row == 0 {
		return sql.ErrNoRows
	}
	return err
}

func GetRoomsByDormitoryID(dbParam *sql.DB, dormitoryId int) (response []res.RoomResponse, err error) {
	sqlStatement := "SELECT * FROM rooms WHERE dormitory_id = $1"

	rows, err := dbParam.Query(sqlStatement, dormitoryId)
	if err != nil {
		panic(err)
	}

	defer rows.Close()
	for rows.Next() {
		var room res.RoomResponse

		err = rows.Scan(&room.ID, &room.DormitoryID, &room.RoomNumber, &room.Status, &room.CreatedAt, &room.UpdatedAt)
		if err != nil {
			panic(err)
		}

		response = append(response, room)
	}

	return
}

func UpdateRoomStatusIfRentalIsActive(dbParam *sql.DB) error {
	sqlStatement := "UPDATE rooms SET status = 'rented' FROM rentals WHERE rentals.room_id = rooms.id AND ((SELECT status FROM rentals ORDER BY id DESC LIMIT 1) = 'active')"
	_, err := dbParam.Exec(sqlStatement)
	return err
}
