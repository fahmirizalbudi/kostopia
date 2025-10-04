package requests

type ReviewRequest struct {
	RentalID int    `json:"rental_id"`
	Rating   int    `json:"rating"`
	Comment  string `json:"comment"`
}
