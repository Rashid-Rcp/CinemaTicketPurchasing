import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

interface CreateCinemaRequest {
  name: string;
  numberOfSeats: number;
}

router.post('/cinema', async (req: Request, res: Response) => {
//Create a cinema with N seats. Returns the cinema ID.
// assume that the cinema ID is the unique id geneted while creating the cinema
// and this id is used for booking the ticket
// as the ID is using for booking the ticket, the cinema name is not required to be unique


  try {
    const { name, numberOfSeats }: CreateCinemaRequest = req.body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Cinema name is required and cannot be empty.'
      });
    }

    if (!numberOfSeats || numberOfSeats <= 0 || !Number.isInteger(numberOfSeats)) {
      return res.status(400).json({
        error: 'Invalid number of seats. Must be a positive integer.'
      });
    }

    // Create cinema and seats in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the cinema
      const cinema = await tx.cinema.create({
        data: {
          name: name.trim(),
          numberOfSeats
        }
      });

      // Create seats for the cinema
      const seats = [];
      for (let i = 1; i <= numberOfSeats; i++) {
        seats.push({
          cinemaId: cinema.id,
          seatNumber: i,
          status: 'available'
        });
      }

      await tx.seat.createMany({
        data: seats
      });

      return cinema;
    });

    res.status(201).json({
      message: 'Cinema created successfully',
      cinemaId: result.id,
      name: result.name,
      numberOfSeats: result.numberOfSeats
    });

    // after successfull creation, the api will return the cinema id, this cinema id used for booking the ticket

  } catch (error) {
    console.error('Error creating cinema:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
