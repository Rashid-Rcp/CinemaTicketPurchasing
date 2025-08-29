import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

interface BookTicketRequest {
  cinemaId: string;
  seatNumber: number;
}

router.post('/book-ticket', async (req: Request, res: Response) => {
  // Purchase a specific seat number in cinema C. If the seat is already purchased, return an error, otherwise return the seat.
  // assuming that "C" is the cinema id, and this id is used for booking the ticket
  try {
    const { cinemaId, seatNumber }: BookTicketRequest = req.body;

    // Validate input
    if (!cinemaId || cinemaId.trim().length === 0) {
      return res.status(400).json({
        error: 'Cinema ID is required and cannot be empty.'
      });
    }

    if (!seatNumber || seatNumber <= 0 || !Number.isInteger(seatNumber)) {
      return res.status(400).json({
        error: 'Invalid seat number. Must be a positive integer.'
      });
    }

    // Use a transaction with optimistic locking to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Find the cinema by ID
      const cinema = await tx.cinema.findUnique({
        where: {
          id: cinemaId.trim()
        }
      });

      if (!cinema) {
        throw new Error('Cinema not found.');
      }

      // Find and update the seat atomically using updateMany with conditions
      // This prevents race conditions by checking and updating in a single operation
      const updateResult = await tx.seat.updateMany({
        where: {
          cinemaId: cinema.id,
          seatNumber: seatNumber,
          status: 'available' // Only update if still available
        },
        data: {
          status: 'purchased'
        }
      });

      if (updateResult.count === 0) {
        // Check if seat exists but is already purchased
        const existingSeat = await tx.seat.findFirst({
          where: {
            cinemaId: cinema.id,
            seatNumber: seatNumber
          }
        });

        if (!existingSeat) {
          throw new Error('Seat not found.');
        }

        if (existingSeat.status === 'purchased') {
          throw new Error('Seat is already purchased.');
        }

        throw new Error('Seat is not available for purchase.');
      }

      // Get the updated seat
      const updatedSeat = await tx.seat.findFirst({
        where: {
          cinemaId: cinema.id,
          seatNumber: seatNumber
        }
      });

      return { cinema, seat: updatedSeat };
    });

    res.status(200).json({
      message: 'Seat purchased successfully',
      seat: {
        seatNumber: result.seat!.seatNumber,
        status: result.seat!.status,
        cinemaId: result.cinema.id
      }
    });

  } catch (error: any) {
    console.error('Error booking ticket:', error);
    
    if (error.message === 'Cinema not found.') {
      return res.status(404).json({
        error: 'Cinema not found.'
      });
    }
    
    if (error.message === 'Seat not found.') {
      return res.status(404).json({
        error: 'Seat not found.'
      });
    }
    
    if (error.message === 'Seat is already purchased.') {
      return res.status(409).json({
        error: 'Seat is already purchased.',
      });
    }
    
    if (error.message === 'Seat is not available for purchase.') {
      return res.status(409).json({
        error: 'Seat is not available for purchase.',
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
