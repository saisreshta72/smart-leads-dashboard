# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack.

## Tech Stack
- Frontend: React.js, TypeScript, TailwindCSS
- Backend: Node.js, Express.js, TypeScript
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt

## Features
- JWT Authentication (Register/Login)
- Role Based Access Control (Admin/Sales)
- Leads CRUD (Create, Read, Update, Delete)
- Advanced Filtering by Status, Source
- Debounced Search by Name or Email
- Sort by Latest/Oldest
- Backend Pagination (10 per page)
- CSV Export
- Responsive UI
- Loading and Empty States

## Setup Instructions

### Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your MongoDB URI and JWT Secret
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

## Environment Variables
See `.env.example` in the server folder.

## API Endpoints
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/leads` - Get all leads (with filters)
- POST `/api/leads` - Create lead
- PUT `/api/leads/:id` - Update lead
- DELETE `/api/leads/:id` - Delete lead (admin only)
- GET `/api/leads/export` - Export leads as CSV