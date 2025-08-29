import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/book-consecutive', async (req: Request, res: Response) => {
  // Purchase the first two free consecutive seats in cinema C. If there are no two consecutive seats available, return an error, otherwise return the list of seats.
  // assuming that "C" is the cinema id, and this id is used for booking the ticket
  try {
    const { cinemaId } = req.body;

    // Validate input
    if (!cinemaId || cinemaId.trim().length === 0) {
      return res.status(400).json({
        error: 'Cinema ID is required and cannot be empty.'
      });
    }

    // Use a transaction to ensure atomicity and prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Find cinema by ID
      const cinema = await tx.cinema.findUnique({
        where: {
          id: cinemaId.trim()
        }
      });

      if (!cinema) {
        throw new Error('Cinema not found.');
      }

      // Get all seats for the cinema ordered by seat number
      const seats = await tx.seat.findMany({
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
        throw new Error('No two consecutive seats available in this cinema.');
      }

      // Purchase both seats atomically using updateMany
      const updateResult = await tx.seat.updateMany({
        where: {
          id: { in: consecutiveSeats.map(seat => seat.id) },
          status: 'available' // Only update if still available
        },
        data: { status: 'purchased' }
      });

      if (updateResult.count !== 2) {
        throw new Error('Unable to purchase both seats. They may have been taken by another request.');
      }

      // Get the updated seats
      const updatedSeats = await tx.seat.findMany({
        where: {
          id: { in: consecutiveSeats.map(seat => seat.id) }
        },
        orderBy: {
          seatNumber: 'asc'
        }
      });

      return { cinema, seats: updatedSeats };
    });

    res.status(200).json({
      message: 'Two consecutive seats purchased successfully',
      seats: result.seats.map(seat => ({
        seatNumber: seat.seatNumber,
        status: seat.status,
        cinemaId: result.cinema.id
      }))
    });

  } catch (error: any) {
    console.error('Error booking consecutive seats:', error);
    
    if (error.message === 'Cinema not found.') {
      return res.status(404).json({
        error: 'Cinema not found.'
      });
    }
    
    if (error.message === 'No two consecutive seats available in this cinema.') {
      return res.status(409).json({
        error: 'No two consecutive seats available in this cinema.'
      });
    }
    
    if (error.message === 'Unable to purchase both seats. They may have been taken by another request.') {
      return res.status(409).json({
        error: 'Unable to purchase both seats. They may have been taken by another request.'
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
