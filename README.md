# 🎬 Cinema Ticket Purchasing Platform API


## 🚀 Features

- **Create Cinemas** with configurable seat counts
- **Book Individual Seats** with duplicate prevention
- **Book Consecutive Seats** automatically
- **Concurrency Safe** - handles multiple simultaneous requests
- **Scalable Architecture** - works across multiple servers
- **TypeScript** - full type safety and modern JavaScript features
- **PostgreSQL** - robust relational database with Prisma ORM

The assignment description did not specifically mention user registration or authentication, so these features were not implemented. Therefore, the API is accessible without authentication.

## 🛠️ Technology Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Runtime**: Node.js

## 📋 API Endpoints

### 1. Create Cinema
```http
POST /api/cinema
Content-Type: application/json

{
  "name": "Cinema Name",
  "numberOfSeats": 10
}
```

**Response:**
```json
{
  "message": "Cinema created successfully",
  "cinemaId": "uuid-here",
  "name": "Cinema Name",
  "numberOfSeats": 10
}
```

### 2. Book Specific Seat
```http
POST /api/book-ticket
Content-Type: application/json

{
  "cinemaId": "uuid-here",
  "seatNumber": 5
}
```

**Response:**
```json
{
  "message": "Seat purchased successfully",
  "seat": {
    "seatNumber": 5,
    "status": "purchased",
    "cinemaId": "uuid-here"
  }
}
```

### 3. Book Consecutive Seats
```http
POST /api/book-consecutive
Content-Type: application/json

{
  "cinemaId": "uuid-here"
}
```

**Response:**
```json
{
  "message": "Two consecutive seats purchased successfully",
  "seats": [
    {
      "seatNumber": 1,
      "status": "purchased",
      "cinemaId": "uuid-here"
    },
    {
      "seatNumber": 2,
      "status": "purchased",
      "cinemaId": "uuid-here"
    }
  ]
}
```