# Job-Board Backend (Node.js / Express / MongoDB)

## Stack
- Node.js 20
- Express 4
- MongoDB Atlas via Mongoose 8
- JWT auth (`jsonwebtoken`) + bcrypt
- Deployed on Render

## Quick Start
```bash
git clone <repo>
cd <repo>
npm install
cp .env.example .env   # fill MONGO_URI & JWT_SECRET
npm run dev            # or npm start

Auth flow 
| Method | Endpoint        | Body                            |
| ------ | --------------- | ------------------------------- |
| POST   | `/api/register` | `name, email, password, resume` |
| POST   | `/api/login`    | `email, password`               |

Authorization: Bearer <jwt>

Core routes
jobs 
| Method | Endpoint        | Auth      | Purpose            |
| ------ | --------------- | --------- | ------------------ |
| GET    | `/api/jobs`     | –         | public job listing |
| POST   | `/api/jobs`     | Recruiter | create job         |
| PUT    | `/api/jobs/:id` | Recruiter | edit own job       |
| DELETE | `/api/jobs/:id` | Recruiter | delete own job     |
| GET    | `/api/jobs/me`  | Recruiter | jobs **I** posted  |

User
| Method | Endpoint               | Auth | Purpose                   |
| ------ | ---------------------- | ---- | ------------------------- |
| POST   | `/api/jobs/:id/apply`  | User | apply (no resume in body) |
| GET    | `/api/applications/me` | User | list my applications      |
| POST   | `/api/jobs/:id/save`   | User | bookmark job              |
| DELETE | `/api/jobs/:id/save`   | User | remove bookmark           |
| GET    | `/api/jobs/saved`      | User | list bookmarked jobs      |


Models (summary)
User – name, email, password(hashed), resume(url, required), savedJobs[], jobsApplied[]
Recruiter – profile tied to one User; owns many Jobs
Job – title, desc, category, type, salary, skills, etc.
Application – job, applicant, coverLetter, status(enum) (no resume field)

Resume Behavior
User uploads / links resume once during registration.
When applying, the recruiter automatically receives the applicant’s stored resume.
No endpoint exists yet for users to update their resume after registration.

## Auth Flow – Detailed

1. **Registration**  
   ```http
   POST /api/register
   Content-Type: application/json

   {
     "name": "Alice",
     "email": "alice@mail.com",
     "password": "secret123",
     "resume": "https://cdn.com/alice-resume.pdf"
   }

POST /api/login
Content-Type: application/json

{
  "email": "alice@mail.com",
  "password": "secret123"
}

on success

{
  "token": "<jwt>",
  "user": { "_id": "...", "name": "Alice", "email": "...", "role": "user" }
}

GET /api/jobs/me
Authorization: Bearer <jwt>



API Endpoints

Authentication
- POST /api/auth/register/user
  - Action: Register a new user.
- POST /api/auth/register/recruiter
  - Action: Register a new recruiter.
- POST /api/auth/login
  - Body: { "phone": "1234567890", "password": "myPassword123" }
  - Action: Login a user or recruiter and return a JWT token.

Job Posting and Management
- POST /api/job
  - Body: { "title": "Job Title", "description": "Job Description", "category": "CategoryId", "subCategory": "SubCat", ... }
  - Action: Post a new job by a recruiter.
- GET /api/job
  - Query Params: keyword, location, category
  - Action: List or search jobs.
- GET /api/job/posted
  - Action: Get all jobs posted by the recruiter.
- PUT /api/job/:id
  - Body: Updated job details
  - Action: Update a job by the recruiter.
- DELETE /api/job/:id
  - Action: Delete a job by the recruiter.
- POST /api/job/:id/view
  - Action: Recruiter views a candidate's mobile number and is charged ₹20.

User Application Management
- POST /api/job/:id/apply
  - Body: { "coverLetter": "Dear Hiring Manager...", "resume": "path/to/resume.pdf" }
  - Action: Apply to a job as a user.
- GET /api/job/saved
  - Action: Get all saved jobs by the user.
- POST /api/job/:id/save
  - Action: Save a job for later application by the user.
- DELETE /api/job/:id/save
  - Action: Unsave a job by the user.
- GET /api/job/applied
  - Action: Get all applied jobs by the user.

Wallet Management
- POST /api/payment/add-money
  - Body: { "amount": 500 }
  - Action: Add money to the recruiter's wallet.
- GET /api/payment/wallet
  - Action: Get the recruiter's wallet balance.

Admin-Only Endpoints
- POST /api/category
  - Body: { "name": "Technology", "subCategories": ["Backend", "Frontend"] }
  - Action: Create a new category by admin.
- PUT /api/category/:id
  - Body: { "name": "New Tech Name" }
  - Action: Update an existing category by admin.
- DELETE /api/category/:id
  - Action: Delete a category by admin.
- POST /api/category/:id/sub
  - Body: { "subCategory": "Cybersecurity" }
  - Action: Add a new sub-category to an existing category by admin.
- DELETE /api/category/:id/sub
  - Body: { "subCategory": "Old SubCat" }
  - Action: Remove a sub-category from a category by admin.


