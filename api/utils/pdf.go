package utils

import (
	"api/types/structs/responses"
	"bytes"
	"html/template"

	"github.com/SebastiaanKlippert/go-wkhtmltopdf"
)

func RenderReceiptHTML(transaction responses.TransactionWithRentalResponse) (string, error) {
	tmpl, err := template.ParseFiles("templates/receipt.html")
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
