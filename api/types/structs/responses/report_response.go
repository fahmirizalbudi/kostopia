package responses

import "time"

type ReportResponse struct {
	Date      time.Time `json:"date"`
	Tenant    string    `json:"tenant"`
	Unit      string    `json:"unit"`
	MonthPaid int       `json:"month_paid"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Purpose   string    `json:"purpose"`
	Amount    int       `json:"amount"`
	Method    string    `json:"method"`
}
