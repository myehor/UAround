
import { Router } from 'express';
import { prisma } from './lib/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const databaseEvents = await prisma.event.findMany();

    const events = databaseEvents.map((event) => ({
      ...event,
      category:
        event.category === 'IT_NETWORKING'
          ? 'IT & Networking'
          : event.category,
      status:
        event.status === 'almostFull'
          ? 'almost-full'
          : event.status === 'fullyBooked'
            ? 'fully-booked'
            : event.status,
    }));

    res.json({
      message: 'Events API is working',
      total: events.length,
      events,
    });
  } catch (error) {
    console.error('Failed to fetch events:', error);

    res.status(500).json({
      message: 'Failed to fetch events from the database',
    });
  }
});

export default router;
