# Tiket API

A RESTful API built with Express.js, PostgreSQL, Prisma, and TypeScript.

## Features

- Express.js server with TypeScript
- PostgreSQL database with Prisma ORM
- User management API endpoints
- CORS enabled
- Environment-based configuration

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository and navigate to the project directory:
```bash
cd tiket
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit the `.env` file with your PostgreSQL connection details:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/tiket_db?schema=public"
PORT=3000
NODE_ENV=development
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push the schema to your database
npm run db:push
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Users
- `GET /api/users` - Get all users (full data)
- `GET /api/users/names` - Get all user names only
- `POST /api/users` - Create a new user

### Example API Usage

#### Get all user names
```bash
curl http://localhost:3000/api/users/names
```

#### Create a new user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## Database Schema

The application includes a `User` model with the following fields:
- `id` - Auto-incrementing primary key
- `name` - User's full name
- `email` - Unique email address
- `createdAt` - Timestamp when user was created
- `updatedAt` - Timestamp when user was last updated

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start production server
- `npm run seed` - Seed database with sample users
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio for database management

## Project Structure

```
tiket/
├── src/
│   ├── index.ts          # Main server file
│   ├── routes/
│   │   └── userRoutes.ts # User API routes
│   ├── types/
│   │   └── user.ts       # TypeScript type definitions
│   └── seed.ts           # Database seeding script
├── prisma/
│   └── schema.prisma     # Database schema
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── env.example           # Environment variables template
├── test-api.js           # API testing script
└── README.md            # This file
```

## Development

The project uses TypeScript for type safety and better development experience. The server automatically restarts when you make changes to the source code during development.

## Database Management

You can use Prisma Studio to manage your database visually:
```bash
npm run db:studio
```

This will open a web interface where you can view and edit your data.

## Testing

After starting the server, you can test the API endpoints using the included test script:

```bash
# In a new terminal
node test-api.js
```

This will test all the main endpoints and show the responses.
