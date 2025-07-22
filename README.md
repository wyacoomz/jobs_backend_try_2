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



