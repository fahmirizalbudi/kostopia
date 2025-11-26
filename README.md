# 🏠 Kostopia

**Kostopia** adalah aplikasi web untuk manajemen dan pencarian kost, kontrakan, atau hunian sewa (boarding house / kost / apartemen) — dengan API dan front-end yang terpisah.  

---

## 🔎 Fitur (rencana / saat ini)

- CRUD data kost / hunian: tambah, edit, hapus, lihat detail.  
- Daftar kost dengan filter (misalnya lokasi, harga, fasilitas, dsb.).  
- Autentikasi & otorisasi (user / admin).  
- API terpisah untuk backend (`/api`) dan front-end web (`/web`).  
- Styling menggunakan SCSS / HTML / TypeScript (front-end) + Go (backend).  

---

## 🛠️ Teknologi

- Backend: **Go** (Golang)  
- API: RESTful, dijalankan di folder `/api`  
- Front-end: **TypeScript + HTML + SCSS** (di folder `/web`)  
- Struktur proyek terpisah antara API & UI  

---

## 🚀 Instalasi & Setup

### 1. Clone repository  
```bash
git clone https://github.com/fahmirizalbudi/kostopia.git
cd kostopia
````

### 2. Setup backend (Go / API)

* Masuk ke folder `api/`

* Jalankan build / server:

  ```bash
  go run main.go
  ```

  atau build binary:

  ```bash
  go build -o kostopia-api
  ./kostopia-api
  ```

* Atur konfigurasi (env, database, dsb) sesuai pada file konfigurasi (jika tersedia).

### 3. Setup front-end (web)

* Masuk ke folder `web/`
* Install dependensi (jika pakai package manager seperti npm/yarn)
* Jalankan web server lokal, atau buka file HTML di browser

---

## 📁 Struktur Direktori

```
kostopia/
├── api/        # Backend (Go) – REST API  
├── web/        # Front-end (TypeScript + SCSS + HTML)  
├── .gitignore  
└── README.md   # Dokumentasi ini  
```

---

## ✅ Status Proyek

* [x] Backend API dasar (struktur, routing)
* [x] Autentikasi & otorisasi
* [x] CRUD kost & penyewaan
* [x] Front-end: daftar & detail kost, search / filter
* [x] Styling & UI/UX
* [x] Dokumentasi & panduan lebih lengkap

---

## 📄 Lisensi & Kontak

Project ini open-source — silakan digunakan, dikembangkan, atau dimodifikasi sesuai kebutuhan Anda.
Untuk pertanyaan, kontribusi, atau kolaborasi, silakan buka issue di Github atau hubungi maintainer: **@fahmirizalbudi**
