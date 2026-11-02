# Sistem Informasi Administrasi RT 01/RW 08 Sukatani

Sistem Informasi Administrasi RT (SIA RT) merupakan aplikasi berbasis web yang dikembangkan untuk membantu digitalisasi proses administrasi warga di wilayah RT 01/RW 08, Kelurahan Sukatani, Kecamatan Tapos, Kota Depok, Jawa Barat.

Aplikasi ini dirancang untuk memudahkan pengelolaan data warga, pengajuan surat, pelaporan pindah dan datang, serta administrasi lingkungan melalui sistem yang terintegrasi dengan pembatasan akses berdasarkan peran pengguna.

## 📌 Fitur Utama

### 1. Autentikasi dan Hak Akses
- Login untuk pengguna terdaftar.
- Pembatasan akses berdasarkan peran (*Role-Based Access Control*).
- Pemisahan akses untuk pengurus RT dan warga.

### 2. Dashboard Administrasi
- Menampilkan ringkasan statistik administrasi.
- Menampilkan informasi pengajuan surat dan aktivitas terbaru.
- Menyediakan akses ke modul administrasi.

### 3. Manajemen Data Warga
- Menampilkan dan mengelola data warga.
- Mendukung kebutuhan pendataan warga tetap maupun warga kos/kontrak.
- Menyediakan formulir penambahan data warga dan pemeriksaan NIK.

### 4. Pengajuan dan Pengelolaan Surat
- Pengajuan surat secara digital oleh warga.
- Pengelolaan dan verifikasi pengajuan oleh pengurus.
- Proses pengesahan surat oleh RT/RW.
- Pratinjau dan pengunduhan dokumen PDF.

### 5. Pelaporan Pindah dan Datang
- Pelaporan perpindahan atau kedatangan warga.
- Pengunggahan dokumen pendukung.
- Pengelolaan status laporan oleh pengurus.

### 6. Keamanan dan Pencatatan Aktivitas
- Pembatasan akses berdasarkan peran pengguna.
- Pengembangan pencatatan aktivitas administrasi (*audit trail*).
- Perlindungan data warga sesuai kebutuhan dan hak akses pengguna.

> **Catatan:** Fitur iuran warga, tunggakan, pengaduan dengan foto, dan portal informasi termasuk dalam ruang lingkup pengembangan sistem. Ketersediaan fitur tersebut perlu disesuaikan dengan implementasi terbaru pada repository.

## 👥 Peran Pengguna

| Peran | Hak Akses |
|---|---|
| Ketua RT | Mengelola administrasi dan memantau pengajuan warga sesuai kewenangan. |
| Sekretaris | Membantu pengelolaan data warga dan administrasi surat. |
| Bendahara | Mengelola pencatatan iuran dan status pembayaran sesuai modul yang tersedia. |
| Warga | Mengakses portal warga serta mengajukan layanan administrasi yang tersedia. |

Hak akses aktual mengikuti middleware, controller, dan konfigurasi role yang diterapkan pada aplikasi.

## 🛠️ Teknologi yang Digunakan

- **Backend:** Laravel (PHP)
- **Frontend:** React.js
- **Integrasi frontend-backend:** Inertia.js
- **Styling:** Tailwind CSS
- **Database:** MySQL
- **Build tool:** Vite
- **Version control:** Git dan GitHub

## ⚙️ Instalasi dan Menjalankan Project

### Prasyarat

Pastikan perangkat telah memiliki:
- PHP dan Composer
- Node.js dan npm
- MySQL atau layanan database yang kompatibel
- Git

Versi dependensi mengikuti konfigurasi pada `composer.json` dan `package.json`.

### 1. Clone Repository

```bash
git clone <URL_REPOSITORY>
cd <NAMA_FOLDER_PROJECT>
```

Ganti `<URL_REPOSITORY>` dengan URL repository GitHub tim dan `<NAMA_FOLDER_PROJECT>` dengan nama folder hasil clone.

### 2. Instal Dependensi

```bash
composer install
npm install
```

### 3. Konfigurasi Environment

Salin file environment contoh:

```bash
cp .env.example .env
```

Pada Windows Command Prompt, gunakan:

```cmd
copy .env.example .env
```

Kemudian sesuaikan konfigurasi database pada file `.env`:

```env
APP_NAME="SIA Sukatani"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=
```

Sesuaikan nama database, username, dan password dengan konfigurasi MySQL lokal.

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Siapkan Database

Buat database sesuai nilai `DB_DATABASE` pada `.env`, kemudian jalankan migrasi:

```bash
php artisan migrate
```

Jika project menggunakan seeder untuk data awal, jalankan seeder yang tersedia sesuai petunjuk tim:

```bash
php artisan db:seed
```

Gunakan data pengembangan yang aman. Jangan menggunakan data pribadi warga asli untuk pengujian tanpa izin dan perlindungan yang sesuai.

### 6. Jalankan Aplikasi

Buka terminal pertama untuk menjalankan backend Laravel:

```bash
php artisan serve
```

Buka terminal kedua untuk menjalankan frontend:

```bash
npm run dev
```

Akses aplikasi melalui:

`http://127.0.0.1:8000`

Pastikan kedua proses berjalan selama pengembangan.

## 🌿 Alur Kolaborasi Git

Project dikembangkan secara kolaboratif menggunakan Git dan GitHub. Branch digunakan untuk memisahkan pengembangan fitur, integrasi, dan versi utama aplikasi.

- `main`: versi utama yang telah disepakati tim.
- `develop`: branch integrasi fitur.
- `feature/*`: branch pengembangan fitur masing-masing anggota.

Alur kerja yang digunakan:

1. Ambil perubahan terbaru dari branch integrasi.
2. Buat atau gunakan branch fitur sesuai tugas.
3. Implementasikan perubahan dan lakukan pengujian.
4. Commit dan push perubahan ke repository remote.
5. Buat Pull Request menuju `develop`.
6. Selesaikan konflik jika ada, lalu lakukan review sebelum merge.

Contoh perintah Git:

```bash
git switch develop
git pull origin develop
git switch -c feature/nama-fitur
```

Setelah perubahan selesai:

```bash
git add .
git commit -m "feat: deskripsi perubahan"
git push -u origin feature/nama-fitur
```

Pastikan branch tujuan dan aturan kolaborasi mengikuti kesepakatan tim.

## 🔐 Catatan Keamanan

- Jangan mengunggah file `.env`, kredensial, token, atau private key ke repository.
- Jangan menyimpan password dalam bentuk teks biasa.
- Batasi akses data sensitif sesuai peran pengguna.
- Gunakan data sintetis untuk pengembangan dan pengujian.
- Pastikan validasi input, autentikasi, dan otorisasi diterapkan pada sisi backend.
- Periksa status migrasi, seeder, dan pengujian sebelum melakukan merge.

## 🚧 Status Pengembangan

Project dikembangkan secara bertahap. Modul administrasi warga, pengajuan surat, dan pelaporan pindah/datang menjadi bagian dari fungsi inti sistem. Status penyelesaian setiap fitur mengikuti implementasi dan hasil pengujian pada branch terbaru.

## 👨‍💻 Kontribusi

Kontribusi dilakukan melalui branch fitur dan Pull Request agar perubahan dapat ditinjau sebelum digabungkan ke branch integrasi.

Setiap anggota diharapkan menjaga konsistensi kode, mencatat perubahan yang relevan, dan menguji fungsi yang dikerjakan.

## 📄 Lisensi

Informasi lisensi belum ditetapkan. Penggunaan dan distribusi project mengikuti kesepakatan tim atau ketentuan yang nantinya ditentukan oleh pemilik project.
