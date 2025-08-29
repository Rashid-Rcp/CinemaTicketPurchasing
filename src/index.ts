import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import createCinemaRouter from './routes/createCinema';
import bookTicketRouter from './routes/bookTicket';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', createCinemaRouter);
app.use('/api', bookTicketRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
