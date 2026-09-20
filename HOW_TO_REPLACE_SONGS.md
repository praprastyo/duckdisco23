# CARA MENGGANTI LAGU DI DISCO DUCK

DISCO DUCK dirancang dengan arsitektur modular (*data-driven*), sehingga lagu apapun bisa diganti tanpa perlu mengubah engine game.
Game ini **mendukung file MP3, WAV, dan MP4 (video)** — jika memakai file `.mp4`, sistem otomatis mengambil musik audionya saja!

---

## 3 Langkah Mudah Mengganti Lagu:

### 1. Salin File Lagu atau Video Anda
Taruh file audio (`.mp3`, `.wav`) atau video (`.mp4`) ke dalam folder:
```text
public/audio/
```
Contoh:
- `public/audio/lagu-pantai.mp4` (video MP4 akan diambil suara musiknya secara otomatis)
- atau `public/audio/my-disco.mp3`

---

### 2. Atur Lagu di `src/config/songs.ts`
Buka file `src/config/songs.ts`, lalu ubah konfigurasi level yang ingin diganti (contoh: `level1`):

```ts
export const songs: Record<string, SongConfig> = {
  level1: {
    id: 'level1',
    title: 'Judul Lagu Anda',
    src: '/audio/lagu-pantai.mp4', // Bisa file .mp4, .mp3, atau .wav!
    bpm: 108,                      // Masukkan BPM lagu baru Anda
    beatOffset: 0.18,               // Jeda awal lagu dalam detik sebelum ketukan pertama
    intensity: {
      bassMultiplier: 0.8,
      midMultiplier: 0.7,
      highMultiplier: 0.6,
      pulseStrength: 0.5,
      particleStrength: 0.3,
      laserStrength: 0.2,
    },
    beatmap: '/beatmaps/level1.json',
  },
  // ...
};
```


---

### 3. Sesuaikan Ketukan Beatmap di `public/beatmaps/level1.json`
Buka file `public/beatmaps/level1.json`.

1. Sesuaikan nilai `bpm` dan `offset`:
```json
{
  "bpm": 115,
  "offset": 0.18,
  "duration": 40,
  "events": [
    {
      "id": "hit_1",
      "cueTime": 4.10,
      "time": 4.65,
      "action": "tap",
      "cue": "quack",
      "promptText": "QUACK!"
    }
  ]
}
```
2. **Keterangan nilai event:**
   - `time`: Detik tepat saat pemain harus menekan tombol (Spacebar/Tap).
   - `cueTime`: Detik saat teks cue/isyarat animasi muncul memberi aba-aba (biasanya 0.5 – 1.0 detik sebelum `time`).
   - `cue`: Suara SFX yang dipicu (`"quack"`, `"clap"`, `"scratch"`, `"cowbell"`).
   - `promptText`: Teks balon aba-aba yang ditampilkan DJ Quack.

---

## Tips Mencari Timestamp Ketukan Menggunakan Dev Debug Inspector:
1. Buka game di browser (`http://localhost:5173`).
2. Tekan tombol backquote/tilde `~` pada keyboard (atau klik tombol **DEV DEBUG (~)** di pojok kanan bawah).
3. Panel debug akan menampilkan **AUDIO TIME** berjalan secara presisi hingga milidetik.
4. Anda bisa pause dan mencatat detik ketukan lagu untuk dimasukkan ke dalam beatmap JSON.
