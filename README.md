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

# 🚀 Job-Portal API Endpoints

> Base URL: `http://localhost:5000`

---

## 🔐 Auth
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| POST | `/api/auth/register/user` | Register new user | ❌ |
| POST | `/api/auth/register/recruiter` | Register new recruiter | ❌ |
| POST | `/api/auth/login/user` | Login as user | ❌ |
| POST | `/api/auth/login/recruiter` | Login as recruiter | ❌ |
| POST | `/api/auth/loginphone` | Login / auto-register with phone | ❌ |
| GET | `/api/auth/logout` | Logout current session | ❌ |
| GET | `/api/auth/me` | Current user info | ✅ |
| GET | `/api/auth/ME` | Current recruiter info | ✅ |

---

## 🧑‍💼 Users
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| GET | `/api/users` | Count active users | ❌ |
| GET | `/api/users/:id` | Get user by ID | ❌ |

---

## 🏢 Recruiters
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| GET | `/api/recruiters` | Count active recruiters | ❌ |
| PUT | `/api/recruiters` | Update recruiter profile | ✅ |

---

## 📂 Categories
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| POST | `/api/categories` | Create category | ❌ |
| GET | `/api/categories` | List all categories | ❌ |
| PUT | `/api/categories/:id` | Update category | ❌ |
| DELETE | `/api/categories/:id` | Delete category | ❌ |
| GET | `/api/categories/:categoryName/jobs` | Jobs by category name | ❌ |

---

## 📁 Sub-Categories
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| POST | `/api/subcategories` | Create sub-category | ❌ |
| GET | `/api/subcategories` | List all sub-categories | ❌ |
| PUT | `/api/subcategories/:id` | Update sub-category | ❌ |
| DELETE | `/api/subcategories/:id` | Delete sub-category | ❌ |

---

## 💼 Jobs
| Method | Endpoint | Description | Auth & Role |
|--------|-----------|-------------|-------------|
| GET | `/api/jobs` | Public job listing (filterable) | ❌ |
| GET | `/api/jobs/posted` | My posted jobs | ✅ Recruiter |
| PUT | `/api/jobs/:id` | Update my job | ✅ Recruiter |
| DELETE | `/api/jobs/:id` | Delete my job | ✅ Recruiter |
| POST | `/api/jobs/:id/save` | Save job | ✅ User |
| DELETE | `/api/jobs/:id/save` | Unsave job | ✅ User |
| GET | `/api/jobs/saved` | My saved jobs | ✅ User |
| POST | `/api/jobs/:id/apply` | Apply for job | ✅ User |
| GET | `/api/jobs/applied` | My applications | ✅ User |
| GET | `/api/jobs/:id/applications` | Applicants for job | ✅ Recruiter |

---

## 💳 Payments
| Method | Endpoint | Description | Auth & Role |
|--------|-----------|-------------|-------------|
| POST | `/api/payments/job-post/order` | Create order for job post | ✅ Recruiter |
| POST | `/api/payments/job-post/verify` | Verify job-post payment | ✅ Recruiter |
| POST | `/api/payments/phone-view/order/:userId` | Order to view phone | ✅ Recruiter |
| POST | `/api/payments/phone-view/verify/:userId` | Verify phone-view payment | ✅ Recruiter |

---

## 📊 Dashboard
| Method | Endpoint | Description | Auth |
|--------|-----------|-------------|------|
| GET | `/api/dashboard/user` | User dashboard stats | ✅ |
| GET | `/api/dashboard/recruiter` | Recruiter dashboard stats | ✅ |

---

## 🛠️ Admin
| Method | Endpoint | Description | Auth & Role |
|--------|-----------|-------------|-------------|
| GET | `/api/admin/users` | List all users | ✅ Admin |
| GET | `/api/admin/recruiters` | List all recruiters | ✅ Admin |
| GET | `/api/admin/price/job-post` | Get job-post price | ❌ |
| PUT | `/api/admin/price/job-post` | Update job-post price | ✅ Admin |

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
| Transaction | `models/Transaction.js` |

🛠️ Future Enhancements
```
replace payment gateway keys with live keys 
Email & SMS notifications
