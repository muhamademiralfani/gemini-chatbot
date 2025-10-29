# Gemini Chatbot (React + Vite)

Ini adalah proyek chatbot sederhana yang dibuat menggunakan React (dengan Vite) dan terhubung ke Google Generative AI (Gemini API). Aplikasi ini memiliki antarmuka chat yang merespons pengguna secara streaming.

## Fitur Utama

* Antarmuka chat sederhana.
* Terhubung dengan Google Gemini API menggunakan `@google/generative-ai`.
* Mendukung respons streaming (teks muncul kata per kata) dari AI.
* Menjaga riwayat percakapan selama sesi aktif.

## Teknologi

* **Frontend:** React 19
* **Build Tool:** Vite
* **API:** Google Generative AI SDK

## Panduan Instalasi dan Penggunaan

**Prasyarat:** Anda harus memiliki [Node.js](https://nodejs.org/) terinstal.

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/muhamademiralfani/gemini-chatbot.git](https://github.com/muhamademiralfani/gemini-chatbot.git)
    cd gemini-chatbot
    ```

2.  **Install semua dependensi:**
    ```bash
    npm install
    ```
    (Ini akan menginstal `react`, `react-dom`, `@google/generative-ai`, dll.)

3.  **Setup API Key (PENTING):**
    Aplikasi ini membutuhkan API Key dari Google AI Studio (Gemini).
    * Buat file baru di dalam folder utama proyek dengan nama `.env`
    * Salin dan tempel baris berikut ke dalam file `.env` tersebut:
        ```
        VITE_GEMINI_API_KEY=MASUKKAN_API_KEY_ANDA_DI_SINI
        ```
    * Ganti `MASUKKAN_API_KEY_ANDA_DI_SINI` dengan API key Anda yang sebenarnya.
    * (File `.env` ini sudah otomatis diabaikan oleh `.gitignore` sehingga aman dan tidak akan ter-upload ke GitHub).

4.  **Jalankan Server Development:**
    ```bash
    npm run dev
    ```
    (Perintah ini berasal dari `package.json`)

5.  **Buka Aplikasi:**
    Buka browser Anda dan kunjungi alamat `http://localhost:XXXX` yang ditampilkan di terminal Anda (biasanya `http://localhost:5173`).

---
### Catatan Model

Kode ini menggunakan model `gemini-2.5-flash`. 