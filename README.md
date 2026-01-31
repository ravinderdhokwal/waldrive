# WalDrive - A Prototype Cloud Storage

WalDrive is a **production‑grade prototype cloud storage** inspired by systems like Google Drive and iCloud Drive. It provides secure file and folder management, authentication, and scalable object storage using modern backend engineering practices.

---

## 🚀 Key Features

* **User Authentication & Authorization**

  * JWT‑based authentication
  * Password hashing with bcrypt
  * Protected routes using middleware

* **File Management**

  * Upload files using multipart/form‑data (Multer)
  * Store files in **Cloudflare R2** (S3‑compatible)
  * Metadata stored in PostgreSQL via Prisma

* **Folder Hierarchy**

  * Nested folders (parent–child relationship)
  * Folder‑level file organization

* **Scalable Architecture**

  * Stateless API design
  * Object storage decoupled from metadata DB
  * Clean separation of routes, controllers, services, and utilities

* **Production‑Grade Practices**

  * Centralized API response messages
  * Typed responses and request handling
  * Environment‑based configuration

---

## 🧱 Tech Stack

### Backend

* **Runtime**: Node.js
* **Language**: TypeScript (ES Modules)
* **Framework**: Express.js

### Database

* **PostgreSQL** (via NeonDB)
* **ORM**: Prisma

### Storage

* **Cloudflare R2** (S3‑compatible)
* **AWS SDK v3** (`@aws-sdk/client-s3`)

### Security

* **bcrypt** – Password hashing
* **jsonwebtoken** – JWT auth
* **cookie-parser** – Secure cookie handling

---

## ⚙️ Environment Variables

Create a `.env` file in the **backend** directory:

```env
PORT=7007

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_jwt_secret
ACCESS_TOKEN_EXPIRY=1d

R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
```

---

## 🛠️ Backend Setup & Installation

```bash
# Change directory to backend
cd ./backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run DB migrations
npx prisma migrate dev

# Build the project
npm run build

# Start production server
npm start
```

---

## 🔐 Authentication Flow (High‑Level)

1. User registers → password hashed with bcrypt
2. User logs in → JWT issued
3. JWT validated via middleware on protected routes
4. Authenticated user can upload/manage files

---

## 📦 File Upload Flow

1. Client sends multipart request
2. Multer parses file
3. File uploaded to Cloudflare R2
4. File metadata stored in PostgreSQL
5. API returns structured success response

---

## 📊 Database Design (Conceptual)

* **User** → owns many files & folders
* **Folder** → self‑referencing parent–child hierarchy
* **File** → belongs to a folder and a user

Designed to support **deep nesting** and **future sharing features**.

---

## 🧪 Error Handling Strategy

* Centralized response utilities
* Consistent API response format
* Explicit error messages per domain (auth, file, folder, user)

---

## 🔮 Future Improvements

* File sharing with permissions (read/write)
* Folder‑level access control
* Soft deletes & trash system
* File versioning
* Rate limiting & audit logs

---

## 🧠 Why This Project Matters

WalDrive is designed to demonstrate **real‑world backend engineering**:

* Clean architecture
* Cloud‑native storage
* Secure authentication
* Scalable data modeling

---

**Author**: Ravinder Kumar
**Project**: WalDrive


