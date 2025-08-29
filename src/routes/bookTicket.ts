import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

interface BookTicketRequest {
  cinemaId: string;
  seatNumber: number;
}

router.post('/book-ticket', async (req: Request, res: Response) => {
 //Purchase a specific seat number in cinema C. If the seat is already purchased, return an error, otherwise return the seat.
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

    // Find the cinema by ID
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

    // Find the specific seat
    const seat = await prisma.seat.findFirst({
      where: {
        cinemaId: cinema.id,
        seatNumber: seatNumber
      }
    });

    if (!seat) {
      return res.status(404).json({
        error: 'Seat not found.'
      });
    }

    // Check if seat is already purchased
    if (seat.status === 'purchased') {
      return res.status(409).json({
        error: 'Seat is already purchased.',
        seatNumber: seat.seatNumber,
        cinemaId: cinema.id
      });
    }

    // Purchase the seat
    const updatedSeat = await prisma.seat.update({
      where: {
        id: seat.id
      },
      data: {
        status: 'purchased'
      }
    });

    res.status(200).json({
      message: 'Seat purchased successfully',
      seat: {
        seatNumber: updatedSeat.seatNumber,
        status: updatedSeat.status,
        cinemaId: cinema.id
      }
    });

  } catch (error) {
    console.error('Error booking ticket:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
