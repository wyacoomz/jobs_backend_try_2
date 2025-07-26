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

### 🔐 Auth Routes

| Method | Endpoint                           | Description                             | Middleware                |
|--------|------------------------------------|-----------------------------------------|---------------------------|
| POST   | `/api/auth/register/user`          | Register a new user                     | `upload.single("resume")` |
| POST   | `/api/auth/register/recruiter`     | Register a new recruiter                | `upload.single("logo")`   |
| POST   | `/api/auth/login/user`             | Login user                              | —                         |
| POST   | `/api/auth/login/recruiter`        | Login recruiter                         | —                         |
| POST   | `/api/auth/loginphone`             | Login user via phone (OTP)              | —                         |
| GET    | `/api/auth/logout`                 | Logout current user                     | —                         |
| GET    | `/api/auth/me`                     | Get current user                        | `protect`                 |
| GET    | `/api/auth/ME`                     | Get current recruiter                   | —                         |

---

### 👤 User Routes

| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| GET    | `/api/users/`      | Count of active users     |
| GET    | `/api/users/:id`   | Get user profile by ID    |

---

### 💼 Job Routes

| Method | Endpoint                   | Description                              | Access       |
|--------|----------------------------|------------------------------------------|--------------|
| GET    | `/api/jobs`                | Public job listing with filters          | Public       |
| GET    | `/api/jobs/saved`          | Get saved jobs for user                  | User         |
| PUT    | `/api/jobs/save/:id`       | Save a job to user’s saved list          | User         |
| PUT    | `/api/jobs/unsave/:id`     | Unsave a job                             | User         |
| GET    | `/api/jobs/mine`           | Get recruiter's posted jobs              | Recruiter    |
| PUT    | `/api/jobs/:id`            | Update a job (recruiter only)            | Recruiter    |
| DELETE | `/api/jobs/:id`            | Delete a job                             | Recruiter    |

---

### 📄 Application Routes

| Method | Endpoint                    | Description                             | Access     |
|--------|-----------------------------|-----------------------------------------|------------|
| POST   | `/api/applications/:id`     | Apply to a job                          | User       |
| GET    | `/api/applications/mine`    | Get logged-in user’s applications       | User       |
| GET    | `/api/applications/:id`     | Get applicants for a job                | Recruiter  |

---

### 💳 Payment Routes (Razorpay)

| Method | Endpoint                               | Description                                  | Notes                          |
|--------|----------------------------------------|----------------------------------------------|--------------------------------|
| POST   | `/api/payments/job/order`              | Create order for job posting                 | Uses dynamic price             |
| POST   | `/api/payments/job/verify`             | Verify payment & create job                  | Needs `jobData` in request     |
| POST   | `/api/payments//phone-view/order/:userId`      | Create order for phone number view           | ₹20 fixed                      |
| POST   | `/api/payments/phone-view/verify/:userId`    | Verify payment & allow view access           | —                              |



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
replace payment gateway keys with live keys 
Email & SMS notifications
