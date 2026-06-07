# MedRevision API 🧠

Backend API for a **medical MCQ learning platform** designed to help medical students revise efficiently using:

- Spaced repetition system
- Exam simulation mode
- Progress tracking & analytics
- Structured medical content hierarchy (Faculty → Year → Module → Chapter → Questions)

Built with **Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, and JWT authentication**.

---

## 🚀 Features (MVP)

### 🔐 Authentication
- Register / Login system
- JWT access + refresh tokens
- Secure password hashing (bcrypt)

### 📚 Medical Content System
- Faculty → Academic Year → Module → Chapter structure
- MCQ question management
- Tags for medical topics

### 🧠 Learning System
- MCQ answering system
- Instant correction & explanations
- Attempt tracking per user

### 🔁 Spaced Repetition
- Smart revision queue
- Automatic rescheduling of questions
- Daily review system

### 📝 Exam Mode
- Timed exam simulation
- Randomized questions
- Score calculation

### 📊 Analytics (basic MVP)
- Accuracy tracking
- Weak chapters detection
- Activity history

---

## 🛠 Tech Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT Authentication
- Zod validation

---

## 📁 Project Structure

```bash
src/
├── config/         # Environment, DB, Redis config
├── modules/        # Feature-based modules
│   ├── auth/
│   ├── users/
│   ├── questions/
│   ├── revisions/
│   ├── exams/
│   └── analytics/
├── middlewares/
├── shared/
├── app.ts
└── server.ts