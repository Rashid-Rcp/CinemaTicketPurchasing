# Quick Setup Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Set Up Environment
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your PostgreSQL details
# DATABASE_URL="postgresql://username:password@localhost:5432/tiket_db?schema=public"
```

## 3. Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push
```

## 4. Seed Database (Optional)
```bash
# Add sample users for testing
npm run seed
```

## 5. Start Development Server
```bash
npm run dev
```

## 6. Test API
```bash
# In a new terminal
node test-api.js
```

## API Endpoints
- `GET /health` - Server status
- `GET /api/users` - All users
- `GET /api/users/names` - User names only
- `POST /api/users` - Create user

## Database Management
```bash
npm run db:studio  # Visual database interface
```

## Build for Production
```bash
npm run build
npm start
```
