package repositories

import (
	res "api/types/structs/responses"
	"database/sql"
)

func GetReport(dbParam *sql.DB) []res.ReportResponse {
	sqlStatement := "SELECT * FROM report"
	rows, err := dbParam.Query(sqlStatement)
	if err != nil {
		panic(err)
	}

	var report []res.ReportResponse

	defer rows.Close()
	for rows.Next() {
		var r res.ReportResponse
		if err := rows.Scan(
			&r.Date,
			&r.Tenant,
			&r.Unit,
			&r.MonthPaid,
			&r.StartDate,
			&r.EndDate,
			&r.Purpose,
			&r.Amount,
			&r.Method,
		); err != nil {
			panic(err)
		}
		report = append(report, r)
	}

	return report
}
