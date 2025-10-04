package repositories

import (
	req "api/types/structs/requests"
	res "api/types/structs/responses"
	"database/sql"
)

func GetReviewsByDormitoryID(dbParam *sql.DB, dormitoryId int) (response []res.ReviewResponse, err error) {
	sqlStatement := "SELECT reviews.id, reviews.rating, reviews.comment, users.name, reviews.created_at FROM reviews JOIN rentals ON reviews.rental_id = rentals.id JOIN rooms ON rentals.room_id = rooms.id JOIN dormitories ON rooms.dormitory_id = dormitories.id JOIN users ON rentals.tenant_id = users.id WHERE dormitories.id = $1;"

	rows, err := dbParam.Query(sqlStatement, dormitoryId)
	if err != nil {
		panic(err)
	}

	defer rows.Close()
	for rows.Next() {
		var review res.ReviewResponse

		err = rows.Scan(&review.ID, &review.Rating, &review.Comment, &review.Reviewer, &review.CreatedAt)
		if err != nil {
			panic(err)
		}

		response = append(response, review)
	}

	return
}

func CreateReview(dbParam *sql.DB, reviewRequest req.ReviewRequest) error {
	sqlStatement := "INSERT INTO reviews (rental_id, rating, comment) VALUES ($1, $2, $3);"
	_, err := dbParam.Exec(sqlStatement, reviewRequest.RentalID, reviewRequest.Rating, reviewRequest.Comment)
	return err
}
