# 🧠 MedRevision API — Master TODO (MVP)

Backend for a medical MCQ learning platform with:
- Spaced repetition system
- Exam simulation
- Structured medical curriculum
- Progress analytics

---

# 🏗️ 1. CORE INFRASTRUCTURE

## 1.1 Project Setup

- [ ] Initialize Express + TypeScript project
  → Create base server structure (app.ts, server.ts)

- [ ] Configure tsconfig.json
  → Strict mode enabled, ESNext modules

- [ ] Setup ESLint + Prettier
  → Maintain code consistency

- [ ] Setup environment loader (Zod validated)
  → Prevent runtime env errors

---

## 1.2 Database Setup (Prisma + PostgreSQL)

- [ ] Initialize Prisma
- [ ] Configure PostgreSQL connection
- [ ] Create base schema structure
- [ ] Setup Prisma client singleton

---

## 1.3 Redis Setup

- [ ] Setup Redis client
  → Used for caching + rate limiting + sessions

- [ ] Define cache utilities
  → get/set/delete helpers

---

## 1.4 Global Middleware System

- [ ] Error handler middleware
  → Centralized API error format

- [ ] Request logger middleware
  → Track API usage

- [ ] Rate limiter middleware
  → Prevent brute force attacks

---

# 🔐 2. AUTH MODULE

## Purpose
Handle authentication, identity, and session security.

---

## Features

- [ ] User registration
- [ ] User login
- [ ] JWT access + refresh tokens
- [ ] Logout system

---

# 👤 3. USER MODULE

## Features

- [ ] Get current user profile
- [ ] Update profile
- [ ] Track stats (streak, progress)

---

# 📚 4. CURRICULUM MODULE

Hierarchy:
Faculty → Year → Module → Chapter → Question

- [ ] Create Faculty
- [ ] Create Year
- [ ] Create Module
- [ ] Create Chapter
- [ ] Fetch curriculum tree

---

# ❓ 5. QUESTION MODULE

- [ ] Create MCQ
- [ ] Update MCQ
- [ ] Delete MCQ
- [ ] Attach answers
- [ ] Add explanations
- [ ] Add tags

---

# 🧠 6. LEARNING SESSIONS

- [ ] Start session
- [ ] Answer question
- [ ] Save attempt
- [ ] Show correction

---

# 🔁 7. SPACED REPETITION

- [ ] Review queue model
- [ ] Schedule next review
- [ ] Daily review generator

---

# 📝 8. EXAMS

- [ ] Generate exam
- [ ] Timed mode
- [ ] Score calculation

---

# 📊 9. ANALYTICS

- [ ] Track attempts
- [ ] Accuracy stats
- [ ] Weak topics

---

# 🔖 10. BOOKMARKS

- [ ] Bookmark question
- [ ] Mark difficult questions

---

# 🔍 11. SEARCH

- [ ] Search questions
- [ ] Filter by module/tag

---

# 🚀 12. DEPLOYMENT

- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Production config
