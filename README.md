# 🚀 OSC Backend

## 📌 Introduction

OSC Backend is a **GraphQL-based** backend service built with **TypeScript** and **Express**. It is designed for a **Learning Management System (LMS)**, providing **user authentication, course management, and role-based authorization** using JWT authentication. The project leverages **Prisma ORM for PostgreSQL**, **Redis for caching**, and follows best practices for **testing, database migrations, and security**.

---

## 🎯 Features

✅ **User Authentication & Authorization** (Admin/User roles)  
✅ **GraphQL API** for managing courses & users  
✅ **Redis Caching** for optimized query performance  
✅ **Prisma ORM** for PostgreSQL database management  
✅ **Role-Based Access Control (RBAC)** with JWT  
✅ **Unit & Integration Testing** using Jest & Supertest  
✅ **Environment-based configurations (.env support)**  
✅ **Database migrations with Prisma**  
✅ **Docker support for containerized deployment**

---

## 🛠️ Tech Stack

| Technology     | Description                |
| -------------- | -------------------------- |
| **Node.js**    | Runtime                    |
| **Express**    | Backend framework          |
| **GraphQL**    | API Query language         |
| **TypeScript** | Strongly-typed JavaScript  |
| **Prisma**     | ORM for PostgreSQL         |
| **PostgreSQL** | Database                   |
| **Redis**      | Caching layer              |
| **Jest**       | Unit & integration testing |
| **Supertest**  | API testing                |
| **Docker**     | Containerization           |

---

## 🚀 Project Setup

### 1️⃣ Clone the repository

```sh
git clone https://github.com/Devjibs/osc-backend.git
cd osc-backend
```

### 2️⃣ Install dependencies

```sh
pnpm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```ini
# Database Configuration
DATABASE_URL="postgresql://osc_user:osc_password123@localhost:5432/oscdb"

# JWT Configuration
JWT_SECRET=the-secret-key
JWT_EXPIRES_IN=1h

PORT=4000
```

---

## 📦 Database Setup & Migrations

### 1️⃣ Run PostgreSQL (if not running already)

```sh
sudo systemctl start postgresql
```

### 2️⃣ Apply database migrations

```sh
pnpm prisma migrate dev --name init
```

### 3️⃣ Generate Prisma Client

```sh
pnpm prisma generate
```

---

## 🚀 Running the Project

### 1️⃣ Start the Redis Server

```sh
redis-server
```

### 2️⃣ Start the Express Server

```sh
pnpm start:dev
```

The API will be available at `http://localhost:4000/graphql`

---

## 🧪 Running Tests

### 1️⃣ Run all tests

```sh
pnpm test --runInBand
```

### 2️⃣ Run a specific test file

```sh
pnpm test tests/auth.test.ts
```

### 3️⃣ Run tests with coverage report

```sh
pnpm test --coverage
```

---

## 📘 API Documentation

This project exposes a **GraphQL Playground** at:

```
http://localhost:4000/graphql
```

Example GraphQL Query to Fetch Courses:

```graphql
query {
  courses {
    id
    title
    description
  }
}
```

Example Mutation to Add a Course:

```graphql
mutation {
  addCourse(
    input: {
      title: "GraphQL Basics"
      description: "Learn GraphQL"
      duration: "6 weeks"
      outcome: "Master GraphQL"
    }
  ) {
    id
    title
  }
}
```

---

## ⚡ Redis Cache Implementation

To speed up responses, Redis caches course queries:

- **Cache Key Format:** `courses:all` or `courses:{id}`
- **Cache Expiration:** 10 minutes (`600 seconds`)
- **Cache Invalidation:** On `addCourse`, `updateCourse`, or `deleteCourse`

To manually flush Redis:

```sh
redis-cli flushall
```

---

## 🔑 Authentication & Authorization

This project uses **JWT-based authentication**.

- Users register & log in using GraphQL mutations.
- JWT token must be sent in the `Authorization` header:

```http
Authorization: Bearer <TOKEN>
```

### Roles & Permissions:

| Role      | Permissions                            |
| --------- | -------------------------------------- |
| **ADMIN** | Can create, update, and delete courses |
| **USER**  | Can only view and enroll in courses    |

---

## 🚨 Error Handling

All GraphQL responses follow this format:

```json
{
  "errors": [
    {
      "message": "Unauthorized access",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["deleteCourse"]
    }
  ]
}
```

---

## 🚀 Deployment

### 1️⃣ Build the production-ready app

```sh
pnpm build
```

### 2️⃣ Run with PM2 for process management

```sh
pnpm pm2 start dist/main.js --name osc-backend
```

### 3️⃣ Docker Deployment

#### Build and Run Docker Container

```sh
docker build -t osc-backend .
docker run -p 4000:4000 --env-file .env osc-backend
```

#### Stop and Remove Docker Container

```sh
docker stop osc-backend && docker rm osc-backend
```

---

## 🤝 Contributing

### 1️⃣ Fork the Repository

```sh
git fork https://github.com/Devjibs/osc-backend.git
```

### 2️⃣ Create a New Branch

```sh
git checkout -b feature/your-feature
```

### 3️⃣ Commit and Push Changes

```sh
git commit -m "Added a new feature"
git push origin feature/your-feature
```

### 4️⃣ Create a Pull Request

Open a pull request to the **main branch** and describe your changes.

---

## 📞 Contact

For any inquiries, reach out to:  
Authored By: **Habeeb Ajide (ajidejibola@yahoo.com)**
