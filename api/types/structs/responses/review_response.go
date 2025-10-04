package responses

import "time"

type ReviewResponse struct {
	ID        int       `json:"id"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	Reviewer  string    `json:"reviewer"`
	CreatedAt time.Time `json:"created_at"`
}
