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


## 📌 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint                          | Description                         | Access       |
|--------|-----------------------------------|-------------------------------------|--------------|
| POST   | `/api/auth/register/user`         | Register new user (with resume)     | Public       |
| POST   | `/api/auth/register/recruiter`    | Register recruiter (with logo)      | Public       |
| POST   | `/api/auth/login/user`            | Login user                          | Public       |
| POST   | `/api/auth/login/recruiter`       | Login recruiter                     | Public       |
| POST   | `/api/auth/loginphone`            | Login user with phone               | Public       |

---

### 👤 User Routes

| Method | Endpoint               | Description              | Access |
|--------|------------------------|--------------------------|--------|
| GET    | `/api/users/`          | Get active users count   | Public |
| GET    | `/api/users/:id`       | Get user by ID           | Public |

---

### 🧑‍💼 Recruiter Routes

| Method | Endpoint               | Description                    | Access         |
|--------|------------------------|--------------------------------|----------------|
| GET    | `/api/recruiters/`     | Get active recruiters count    | Public         |
| PUT    | `/api/recruiters/`     | Update recruiter profile       | Recruiter Only |

---

### 🛠️ Admin Routes

| Method | Endpoint                     | Description                      | Access       |
|--------|------------------------------|----------------------------------|--------------|
| GET    | `/api/admin/users`           | Get all users                    | Admin Only   |
| GET    | `/api/admin/recruiters`      | Get all recruiters               | Admin Only   |
| GET    | `/api/admin/price/job-post`  | Get current job post price       | Public       |
| PUT    | `/api/admin/price/job-post`  | Update job post price            | Admin Only   |

---

### 📂 Category Routes

| Method | Endpoint               | Description          | Access         |
|--------|------------------------|----------------------|----------------|
| POST   | `/api/categories/`     | Create category      | Admin Only     |
| GET    | `/api/categories/`     | Get all categories   | Public         |
| PUT    | `/api/categories/:id`  | Update category      | Admin Only     |
| DELETE | `/api/categories/:id`  | Delete category      | Admin Only     |

---

### 📁 Subcategory Routes

| Method | Endpoint                    | Description            | Access       |
|--------|-----------------------------|------------------------|--------------|
| POST   | `/api/subcategories/`       | Create subcategory     | Admin Only   |
| GET    | `/api/subcategories/`       | Get all subcategories  | Public       |
| PUT    | `/api/subcategories/:id`    | Update subcategory     | Admin Only   |
| DELETE | `/api/subcategories/:id`    | Delete subcategory     | Admin Only   |

---

### 📊 Dashboard Routes

| Method | Endpoint                    | Description                   | Access         |
|--------|-----------------------------|-------------------------------|----------------|
| GET    | `/api/dashboard/user`       | Get user dashboard data       | User Only      |
| GET    | `/api/dashboard/recruiter`  | Get recruiter dashboard data  | Recruiter Only |

---

### 💼 Job Routes

| Method | Endpoint                                | Description                        | Access          |
|--------|-----------------------------------------|------------------------------------|-----------------|
| GET    | `/api/jobs/`                            | Get all jobs                       | Public          |
| GET    | `/api/jobs/posted`                      | Get recruiter posted jobs          | Recruiter Only  |
| PUT    | `/api/jobs/:id`                         | Update a job                       | Recruiter Only  |
| DELETE | `/api/jobs/:id`                         | Delete a job                       | Recruiter Only  |
| POST   | `/api/jobs/:id/save`                    | Save a job                         | User Only       |
| DELETE | `/api/jobs/:id/save`                    | Unsave a job                       | User Only       |
| GET    | `/api/jobs/saved`                       | Get saved jobs                     | User Only       |
| POST   | `/api/jobs/:id/apply`                   | Apply to a job                     | User Only       |
| GET    | `/api/jobs/applied`                     | Get applied jobs                   | User Only       |

---

### 💳 Payment Routes

| Method | Endpoint                                                            | Description                               | Access          |
|--------|---------------------------------------------------------------------|-------------------------------------------|-----------------|
| POST   | `/api/payments/wallet/order`                                        | Create wallet order                       | Recruiter Only  |
| POST   | `/api/payments/wallet/verify`                                       | Verify wallet payment                     | Recruiter Only  |
| POST   | `/api/payments/job-post/order`                                      | Create job post order                     | Recruiter Only  |
| POST   | `/api/payments/job-post/verify`                                     | Verify job post payment                   | Recruiter Only  |
| POST   | `/api/payments/jobs/:jobId/candidates/:candidateId/unlock`         | Unlock candidate mobile number            | Recruiter Only  |
| GET    | `/api/payments/wallet`                                              | Get recruiter wallet balance              | Recruiter Only  |



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
