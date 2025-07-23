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

PORT=5000
MONGO_URI=mongodb+srv://abdul:987654321@cluster0.jnpbyp9.mongodb.net/
JWT_SECRET=987654321
---

Feature / Endpoint

| Feature / Endpoint               | Method          | Auth      | Role      | Description               |
| -------------------------------- | --------------- | --------- | --------- | ------------------------- |
| **Auth**                         |                 |           |           |                           |
| `/api/auth/register/user`        | POST            | multipart | user      | Register user             |
| `/api/auth/register/recruiter`   | POST            | multipart | recruiter | Register recruiter        |
| `/api/auth/login/user`           | POST            | JSON      | user      | Login                     |
| `/api/auth/login/recruiter`      | POST            | JSON      | recruiter | Login                     |
| `/api/auth/loginphone`           | POST            | JSON      | any       | OTP login                 |
| **Admin**                        |                 |           |           |                           |
| `/api/admin/users`               | GET             | JWT       | admin     | List all users            |
| `/api/admin/recruiters`          | GET             | JWT       | admin     | List all recruiters       |
| **Categories & Sub-Categories**  |                 |           |           |                           |
| `/api/category`                  | GET             | —         | any       | List categories           |
| `/api/category`                  | POST/PUT/DELETE | JWT       | admin     | CRUD                      |
| `/api/subcategories`             | GET             | —         | any       | List sub-categories       |
| `/api/subcategories`             | POST/PUT/DELETE | JWT       | admin     | CRUD                      |
| **Jobs**                         |                 |           |           |                           |
| `/api/job`                       | GET             | —         | any       | Public search             |
| `/api/job`                       | POST            | JWT       | recruiter | Post job (₹20, max 5)     |
| `/api/job/posted`                | GET             | JWT       | recruiter | My posted jobs            |
| `/api/job/:id`                   | PUT/DELETE      | JWT       | recruiter | Edit / delete             |
| `/api/job/:id/applicants`        | GET             | JWT       | recruiter | Free list (name + skills) |
| `/api/job/:id/mobile`            | GET             | JWT       | recruiter | Paid list (phone)         |
| **User Actions**                 |                 |           |           |                           |
| `/api/job/:id/save`              | POST            | JWT       | user      | Save job                  |
| `/api/job/:id/save`              | DELETE          | JWT       | user      | Un-save job               |
| `/api/job/saved`                 | GET             | JWT       | user      | Saved jobs                |
| `/api/job/:id/apply`             | POST            | JWT       | user      | Apply                     |
| `/api/job/applied`               | GET             | JWT       | user      | Applications              |
| **Payment & Wallet**             |                 |           |           |                           |
| `/api/payment/add-money`         | POST            | JWT       | any       | Top-up wallet             |
| `/api/payment/post-job`          | POST            | JWT       | recruiter | Internal charge           |
| `/api/payment/wallet`            | GET             | JWT       | any       | Balance                   |
| `/api/payment/contacted`         | POST            | JWT       | recruiter | Mark contacted            |
| `/api/payment/job/:jobId/mobile` | GET             | JWT       | recruiter | Unlock phones (₹20)       |
| **Recruiter Profile**            |                 |           |           |                           |
| `/api/recruiter`                 | GET             | —         | any       | Stats                     |
| `/api/recruiter`                 | PUT             | JWT       | recruiter | Edit profile              |
| **Dashboards**                   |                 |           |           |                           |
| `/api/dashboard/user`            | GET             | JWT       | user      | savedJobs + appliedJobs   |
| `/api/dashboard/recruiter`       | GET             | JWT       | recruiter | stats + walletBalance     |



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
