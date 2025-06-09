# E-Commerce Data Internet

Aplikasi e-commerce untuk pembelian paket data internet dengan React, TypeScript, Material-UI, dan Redux Toolkit.

## Fitur

- Autentikasi pengguna
- Daftar paket data internet
- Tambah, Edit, dan Hapus Paket Data
- Pembelian paket data
- Riwayat transaksi
- Melihat Daftar Pelanggan dan Riwayat Transaksi Mereka
- Responsive design

## Teknologi yang Digunakan

- React 18
- TypeScript
- Material-UI
- Redux Toolkit
- React Router
- Axios
- JSON Server (Mock API)

## Cara Menjalankan

1. Clone repository ini
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan mock server API:
   ```bash
   npm run server
   ```
4. Di terminal terpisah, jalankan aplikasi React:
   ```bash
   npm run dev
   ```
5. Buka browser dan akses `http://localhost:5173`

## Kredensial Login

- Username: user1
- Password: password123

## Struktur Folder

```
src/
  ├── components/     # Komponen yang dapat digunakan kembali
  ├── pages/         # Halaman-halaman aplikasi
  ├── store/         # Redux store dan slices
  ├── App.tsx        # Komponen utama dan routing
  └── main.tsx       # Entry point aplikasi
```

## API Endpoints

Mock server API menyediakan endpoint berikut:

- `GET /users` - Mendapatkan daftar pengguna
- `GET /packages` - Mendapatkan daftar paket data
- `GET /transactions` - Mendapatkan daftar transaksi
- `POST /transactions` - Membuat transaksi baru
