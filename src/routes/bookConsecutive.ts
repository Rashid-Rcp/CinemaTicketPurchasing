import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/book-consecutive', async (req: Request, res: Response) => {
    //Purchase the first two free consecutive seats in cinema C. If there are no two consecutive seats available, return an error, otherwise return the list of seats.
    // assuming that "C" is the cinema id, and this id is used for booking the ticket
  try {
    const { cinemaId } = req.body;

    // Validate input
    if (!cinemaId || cinemaId.trim().length === 0) {
      return res.status(400).json({
        error: 'Cinema ID is required and cannot be empty.'
      });
    }

    // Find cinema by ID
    const cinema = await prisma.cinema.findUnique({
      where: {
        id: cinemaId.trim()
      }
    });

    if (!cinema) {
      return res.status(404).json({
        error: 'Cinema not found.'
      });
    }

    // Get all seats for the cinema ordered by seat number
    const seats = await prisma.seat.findMany({
      where: {
        cinemaId: cinema.id
      },
      orderBy: {
        seatNumber: 'asc'
      }
    });

    // Find the first two consecutive free seats
    let consecutiveSeats: any[] = [];
    
    for (let i = 0; i < seats.length - 1; i++) {
      const currentSeat = seats[i];
      const nextSeat = seats[i + 1];
      
      // Check if current and next seat are both free and consecutive
      if (currentSeat.status !== 'purchased' && 
          nextSeat.status !== 'purchased' &&
          nextSeat.seatNumber === currentSeat.seatNumber + 1) {
        
        consecutiveSeats = [currentSeat, nextSeat];
        break;
      }
    }

    if (consecutiveSeats.length === 0) {
      return res.status(409).json({
        error: 'No two consecutive seats available in this cinema.'
      });
    }

    // Purchase both seats using Prisma transaction
    const updatedSeats = await prisma.$transaction(async (tx) => {
      const updatedSeats = [];
      
      for (const seat of consecutiveSeats) {
        const updatedSeat = await tx.seat.update({
          where: { id: seat.id },
          data: { status: 'purchased' }
        });
        updatedSeats.push(updatedSeat);
      }
      
      return updatedSeats;
    });

    res.status(200).json({
      message: 'Two consecutive seats purchased successfully',
      seats: updatedSeats.map(seat => ({
        seatNumber: seat.seatNumber,
        status: seat.status,
        cinemaId: cinema.id
      }))
    });

  } catch (error) {
    console.error('Error booking consecutive seats:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
