# DeadDrop - Platform Komunikasi Terenkripsi Berbasis Komponen

## Deskripsi Proyek

**DeadDrop** adalah aplikasi web modern yang dibangun menggunakan arsitektur **berbasis komponen** (Component-Based Architecture) dengan Next.js 14 dan React. Aplikasi ini menyediakan platform komunikasi yang aman dengan fitur enkripsi end-to-end, manajemen identitas pengguna, dan sistem audit logging lengkap.

Proyek ini dirancang sebagai studi kasus implementasi prinsip-prinsip **Perangkat Lunak Berbasis Komponen** dengan penekanan pada:
- **Modularitas**: Setiap fitur dipisahkan menjadi komponen yang independen dan reusable
- **Reusability**: Komponen UI dan logika bisnis dapat digunakan kembali di berbagai halaman
- **Maintainability**: Struktur folder yang terorganisir memudahkan maintenance dan scaling
- **Testability**: Komponen dirancang untuk mudah diuji secara unit

---

## Fitur Utama

✅ **Autentikasi & Identitas**
- Sistem identitas unik untuk setiap pengguna
- Session management yang aman
- Hash dan enkripsi password

✅ **Komunikasi Terenkripsi**
- Enkripsi end-to-end untuk pesan
- Derivasi kunci cryptographic yang aman
- Dekripsi pesan yang terenkripsi

✅ **Dashboard Analytics**
- Statistik pengguna dan aktivitas
- Visualisasi data real-time
- Monitoring sistem

✅ **Manajemen Pesan**
- CRUD operations untuk pesan
- Status tracking dan notification
- Verifikasi lokasi untuk keamanan

✅ **Audit Logging**
- Pencatatan semua aktivitas sistem
- Trail audit untuk compliance
- Query dan filtering data audit

✅ **Sistem Lokasi**
- Verifikasi lokasi pengguna
- Perhitungan jarak geografis
- Keamanan berbasis lokasi

---

## Arsitektur Berbasis Komponen

### Struktur Folder

```
src/
├── components/          # Komponen UI reusable
│   ├── layout/         # Layout komponen (sidebar, header, dll)
│   └── ui/             # UI primitif (button, input, card, dialog, dll)
├── app/                # Next.js App Router pages & API routes
│   ├── api/            # API endpoints (RESTful)
│   ├── auth/           # Halaman autentikasi
│   └── dashboard/      # Halaman dashboard & fitur utama
├── lib/                # Utility functions & business logic
│   ├── auth/           # Logic autentikasi
│   ├── crypto/         # Fungsi enkripsi/dekripsi
│   ├── db/             # Koneksi database
│   └── location/       # Logic lokasi
├── models/             # Mongoose schemas
├── services/           # Business logic layer
├── config/             # Konfigurasi aplikasi
├── types/              # TypeScript type definitions
└── validators/         # Schema validation (Zod/Yup)
```

### Pola Komponen

**Component-Based Architecture** yang diterapkan:

1. **UI Components** (`src/components/ui/`)
   - Badge, Button, Card, Dialog, Dropdown Menu, Input, Select, Sheet, Table, Textarea
   - Komponen standar yang reusable di seluruh aplikasi

2. **Layout Components** (`src/components/layout/`)
   - Sidebar dan layout wrapper
   - Digunakan kembali di berbagai halaman

3. **Service Layer** (`src/services/`)
   - `audit.service.ts`: Business logic audit
   - `message.service.ts`: Business logic pesan
   - `user.service.ts`: Business logic pengguna

4. **Utility Functions** (`src/lib/`)
   - Fungsi helper yang dapat digunakan di berbagai komponen
   - Enkripsi, autentikasi, lokasi, database

---

## Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 14 (React) |
| **Language** | TypeScript |
| **Database** | MongoDB |
| **Styling** | PostCSS, CSS Modules |
| **Cryptography** | Node.js Crypto API |
| **Linting** | ESLint |

---

## Persyaratan Sistem

- Node.js 18+ 
- npm atau yarn atau pnpm
- MongoDB (lokal atau cloud)

---

## Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/MilanRamadhan/deaddrop-plbk.git
cd deaddrop-plbk
```

### 2. Install Dependencies
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env.local` di root project:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/deaddrop

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Encryption Key (generate a random string)
ENCRYPTION_KEY=your-secret-key-here

# Session Configuration
SESSION_SECRET=your-session-secret-here
```

### 4. Jalankan Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### Authentication
- `POST /api/auth/identity` - Generate/retrieve user identity

### Messages
- `GET /api/messages` - List pesan
- `POST /api/messages` - Buat pesan baru
- `GET /api/messages/[id]` - Get detail pesan
- `POST /api/messages/[id]/open` - Open/decrypt pesan

### Dashboard
- `GET /api/dashboard/stats` - Statistik dashboard

### Audit
- `GET /api/audit` - Query audit logs

### Health
- `GET /api/health` - Health check endpoint

---

## Model Data

### User Schema
```typescript
{
  _id: ObjectId,
  identity: string,        // Unique identity hash
  email: string,
  passwordHash: string,    // Hashed password
  createdAt: Date,
  updatedAt: Date
}
```

### Message Schema
```typescript
{
  _id: ObjectId,
  senderId: string,
  encryptedContent: string,
  encryptionIV: string,
  createdAt: Date,
  expiresAt?: Date
}
```

### AuditLog Schema
```typescript
{
  _id: ObjectId,
  action: string,
  userId: string,
  details: object,
  timestamp: Date
}
```

---

## Prinsip Component-Based Design

Aplikasi ini mengimplementasikan beberapa prinsip penting:

### 1. **Separation of Concerns**
- UI logic terpisah dari business logic
- Database operations di layer terpisah
- Validation di utility tersendiri

### 2. **Reusability**
- UI components dapat digunakan di multiple pages
- Service functions reusable across routes
- Utility helpers shared globally

### 3. **Scalability**
- Mudah menambah feature baru tanpa affect kode existing
- Struktur folder memudahkan navigasi
- Clear dependency graph

### 4. **Testability**
- Pure functions dalam services
- Komponen dengan single responsibility
- Mock-friendly architecture

---

## Struktur Development

### Menambah Fitur Baru

1. **Buat Component** di `src/components/`
2. **Buat Service** di `src/services/` jika perlu business logic
3. **Buat API Route** di `src/app/api/`
4. **Buat Page/Route** di `src/app/`
5. **Add Types** di `src/types/`
6. **Add Validator** di `src/validators/`

---

## Scripts

```bash
# Development
npm run dev

# Build production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

---

## Dependency Management

Project menggunakan modern package managers dengan:
- Lock files untuk reproducible builds
- Semantic versioning untuk dependencies
- Regular security updates

---

## Catatan Penting

- **Enkripsi**: Semua pesan dienkripsi sebelum disimpan ke database
- **Session**: Menggunakan HTTP-only cookies untuk keamanan
- **Rate Limiting**: API dilindungi dari abuse
- **Input Validation**: Semua input divalidasi sebelum processing

---

## Kesimpulan

DeadDrop mendemonstrasikan implementasi praktis dari **Perangkat Lunak Berbasis Komponen** dengan:
- ✅ Modularitas tinggi
- ✅ Reusability maksimal
- ✅ Maintainability terjamin
- ✅ Scalability optimal

Aplikasi ini cocok digunakan sebagai referensi untuk memahami bagaimana merancang dan membangun aplikasi web modern dengan prinsip component-based architecture.

---

## Referensi

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

**Status**: Submission untuk UAS Matakuliah Perangkat Lunak Berbasis Komponen  
**Tahun**: 2026
