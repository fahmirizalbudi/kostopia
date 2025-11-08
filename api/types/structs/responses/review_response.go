package responses

import "time"

type ReviewResponse struct {
	ID        int       `json:"id"`
	RentalID  int       `json:"rental_id"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	Reviewer  string    `json:"reviewer"`
	CreatedAt time.Time `json:"created_at"`
}

type AlterReviewResponse struct {
	ID        int       `json:"id"`
	Place     any       `json:"place"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	Reviewer  string    `json:"reviewer"`
	CreatedAt time.Time `json:"created_at"`
}
