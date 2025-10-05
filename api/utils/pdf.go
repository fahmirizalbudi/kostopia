package utils

import (
	"api/types/structs/responses"
	"bytes"
	"html/template"
	"time"

	"github.com/SebastiaanKlippert/go-wkhtmltopdf"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

func Rupiah(n int) string {
	p := message.NewPrinter(language.Indonesian)
	return p.Sprintf("Rp %d", n)
}

func FormatDateIndonesia(t time.Time) string {
	bulan := map[time.Month]string{
		time.January:   "Januari",
		time.February:  "Februari",
		time.March:     "Maret",
		time.April:     "April",
		time.May:       "Mei",
		time.June:      "Juni",
		time.July:      "Juli",
		time.August:    "Agustus",
		time.September: "September",
		time.October:   "Oktober",
		time.November:  "November",
		time.December:  "Desember",
	}
	return t.Format("02") + " " + bulan[t.Month()] + " " + t.Format("2006")
}

func RenderReceiptHTML(transaction responses.TransactionWithRentalResponse) (string, error) {
	tmpl, err := template.New("receipt.html").Funcs(template.FuncMap{
		"rupiah":  Rupiah,
		"tanggal": FormatDateIndonesia,
	}).ParseFiles("templates/receipt.html")
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, transaction); err != nil {
		return "", err
	}

	return buf.String(), nil
}

func GeneratePDF(htmlStr string) ([]byte, error) {
	wkhtmltopdf.SetPath(`C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe`)

	pdfg, err := wkhtmltopdf.NewPDFGenerator()
	if err != nil {
		return nil, err
	}

	page := wkhtmltopdf.NewPageReader(bytes.NewReader([]byte(htmlStr)))
	pdfg.AddPage(page)

	pdfg.PageSize.Set(wkhtmltopdf.PageSizeA5)
	pdfg.Orientation.Set(wkhtmltopdf.OrientationLandscape)

	pdfg.MarginLeft.Set(10)
	pdfg.MarginRight.Set(10)
	pdfg.MarginTop.Set(25)
	// pdfg.MarginBottom.Set(10)

	if err := pdfg.Create(); err != nil {
		return nil, err
	}

	return pdfg.Bytes(), nil
}
