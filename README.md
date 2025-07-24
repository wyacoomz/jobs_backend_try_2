# Job-Portal Backend  
RESTful API built with **Node.js + Express + MongoDB Atlas** and secured via **JWT**.

---

## 📦 Tech Stack
| Layer        | Technology        |
|--------------|-------------------|
| Runtime      | Node.js           |
| Framework    | Express           |
| Database     | MongoDB Atlas (Mongoose) |
| Auth         | JWT (7-day expiry)|
| File Upload  | Multer            |



## 🔐 Environment Variables

---

Feature / Endpoint

## 📘 API Endpoints

### 🧑 Auth Routes (`/api/auth`)

| Method | Endpoint                 | Description                     | Auth | Notes                         |
|--------|--------------------------|---------------------------------|------|-------------------------------|
| POST   | /register/user           | Register as a user              | ❌   | `multipart/form-data`, file: `resume` |
| POST   | /register/recruiter      | Register as a recruiter         | ❌   | file: `logo`                  |
| POST   | /login/user              | Login user with email/password  | ❌   |                               |
| POST   | /login/recruiter         | Login recruiter with email/pass | ❌   |                               |
| POST   | /loginphone              | Login with phone number         | ❌   | User only                     |

---

### 🧾 Admin Routes (`/api/admin`)

| Method | Endpoint                 | Description                      | Auth | Notes |
|--------|--------------------------|----------------------------------|------|-------|
| GET    | /users                   | Get all users (no passwords)     | 🔒   | Admin access assumed |
| GET    | /recruiters              | Get all recruiters (no passwords)| 🔒   | Admin access assumed |

---

### 📂 Category Routes (`/api/categories`)

| Method | Endpoint         | Description              | Auth | Notes |
|--------|------------------|--------------------------|------|-------|
| POST   | /                | Create new category      | ❌   | Add auth if needed |
| GET    | /                | Get all categories       | ❌   | |
| PUT    | /:id             | Update category by ID    | ❌   | |
| DELETE | /:id             | Delete category by ID    | ❌   | |

---

### 📂 SubCategory Routes (`/api/subcategories`)

| Method | Endpoint         | Description                 | Auth | Notes |
|--------|------------------|-----------------------------|------|-------|
| POST   | /                | Create subcategory          | ❌   | |
| GET    | /                | Get all subcategories       | ❌   | |
| PUT    | /:id             | Update subcategory by ID    | ❌   | |
| DELETE | /:id             | Delete subcategory by ID    | ❌   | |

---

### 📋 Job Routes (`/api/jobs`)

| Method | Endpoint              | Description                          | Auth | Role     |
|--------|-----------------------|--------------------------------------|------|----------|
| GET    | /                     | Get all public jobs                  | ❌   | Public   |
| POST   | /                     | Create job                           | ✅   | Recruiter|
| GET    | /posted               | Get my posted jobs                   | ✅   | Recruiter|
| PUT    | /:id                  | Update job by ID                     | ✅   | Recruiter|
| DELETE | /:id                  | Delete job by ID                     | ✅   | Recruiter|
| POST   | /:id/save             | Save a job                           | ✅   | User     |
| DELETE | /:id/save             | Unsave a job                         | ✅   | User     |
| GET    | /saved                | Get saved jobs                       | ✅   | User     |
| POST   | /:id/apply            | Apply to job                         | ✅   | User     |
| GET    | /applied              | Get my applied jobs                  | ✅   | User     |

---

### 📈 Dashboard Routes (`/api/dashboard`)

| Method | Endpoint       | Description               | Auth | Role     |
|--------|----------------|---------------------------|------|----------|
| GET    | /user          | Get user dashboard data   | ✅   | User     |
| GET    | /recruiter     | Get recruiter dashboard   | ✅   | Recruiter|

---

### 💳 Payment Routes (`/api/payment`)

| Method | Endpoint                   | Description                       | Auth | Notes     |
|--------|----------------------------|-----------------------------------|------|-----------|
| POST   | /create-wallet-order       | Initiate wallet top-up (₹100)     | ✅   |           |
| POST   | /verify-wallet-payment     | Verify Razorpay payment           | ✅   |           |
| GET    | /wallet                    | Get current wallet balance        | ✅   |           |
| POST   | /view-mobile/:jobId        | View candidate mobile number      | ✅   | Deducts ₹100 |

---

### 🧑 Recruiter Routes (`/api/recruiters`)

| Method | Endpoint       | Description                       | Auth | Notes |
|--------|----------------|-----------------------------------|------|-------|
| GET    | /              | Get recruiter stats               | ❌   | Public |
| PUT    | /              | Update recruiter profile          | ✅   | Recruiter |

---

### 👥 User Routes (`/api/users`)

| Method | Endpoint       | Description                     | Auth | Notes |
|--------|----------------|---------------------------------|------|-------|
| GET    | /              | Get active user stats/count     | ❌   | Public |
| GET    | /:id           | Get user details by ID          | ❌   | Public |

---

### ✅ Legend

| Symbol | Meaning                    |
|--------|-----------------------------|
| ❌     | No authentication required |
| ✅     | Authentication required    |
| 🔒     | Likely Admin-only access   |

---





DATABASE MODELS
| Model       | File                    |
| ----------- | ----------------------- |
| User        | `models/User.js`        |
| Recruiter   | `models/Recruiter.js`   |
| Job         | `models/Jobs.js`        |
| Application | `models/Application.js` |
| Category    | `models/Category.js`    |
| SubCategory | `models/SubCategory.js` |
| Wallet      | `models/Wallet.js`      |
| Transaction | `models/Transaction.js` |

🛠️ Future Enhancements
```
Real payment gateway
Email & SMS notifications
