# Finance Tracker

A full-stack personal finance management application for tracking income, expenses, budgets, and spending patterns.

## Features
- User registration and login
- Income and expense tracking
- Transaction categorization
- Daily, weekly, and monthly summaries
- Monthly budget management
- Category-wise spending statistics

## Tech Stack
**Frontend:** HTML, CSS, JavaScript  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose

## Architecture
```
Browser → HTML/CSS/JavaScript → Express.js → Mongoose → MongoDB
```

## Backend Modules
- Authentication and user management
- Transaction management
- Budget management
- Daily / weekly / monthly analytics
- Category-wise spending summaries

## API Examples
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Create a user |
| POST | `/login` | Authenticate a user |
| POST | `/add-expense` | Add a transaction |
| GET | `/expenses` | Retrieve transactions |
| GET | `/transactions/monthly` | Monthly summary |
| GET | `/budget/status` | Budget status |
| GET | `/summary/category` | Category-wise spending |

## Running Locally
```bash
npm install
node server.js
```
Start MongoDB locally, then open `http://localhost:3000`.

## Engineering Focus
Demonstrates backend API development, MongoDB persistence, request handling, and application flow from UI to database.

---

Maintained by **Aarzu Sharma** | Computer Engineering