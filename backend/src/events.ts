
import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';

import { prisma } from './lib/prisma.js';

const router = Router();

const eventCategories = [
  'Sport',
  'Party',
  'Social',
  'Music',
  'IT & Networking',
  'Education',
  'Family',
  'Culture',
  'Volunteering',
  'Other',
] as const;

const createEventSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(1000),
  category: z.enum(eventCategories),
  imageUrl: z.string().url().max(2000).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  bundesland: z.string().trim().min(1).max(100),
  city: z.string().trim().min(1).max(100),
  venue: z.string().trim().min(1).max(200),
  address: z.string().trim().max(300).optional(),
  participantLimit: z.number().int().min(1).max(10000).optional(),
});

function formatEvent<T extends {
  category: string;
  status: string;
}>(event: T) {
  return {
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
  };
}

// GET /api/events — общий каталог
router.get('/', async (_req, res) => {
  try {
    const databaseEvents = await prisma.event.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const events = databaseEvents.map(formatEvent);

    res.json({
      message: 'Events loaded successfully.',
      total: events.length,
      events,
    });
  } catch (error) {
    console.error('Failed to fetch events:', error);

    res.status(500).json({
      message: 'Failed to fetch events from the database.',
    });
  }
});

// GET /api/events/my — мероприятия, созданные текущим пользователем
router.get('/my', async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.status(401).json({
      message: 'Please sign in to view your events.',
    });
    return;
  }

  try {
    const databaseEvents = await prisma.event.findMany({
      where: { ownerUserId: userId },
      orderBy: { createdAt: 'desc' },
    });

    const events = databaseEvents.map(formatEvent);

    res.json({
      message: 'Your events loaded successfully.',
      total: events.length,
      events,
    });
  } catch (error) {
    console.error('Failed to fetch user events:', error);

    res.status(500).json({
      message: 'Failed to fetch your events.',
    });
  }
});

// POST /api/events — создание мероприятия от имени текущего пользователя
router.post('/', async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.status(401).json({
      message: 'Please sign in to create an event.',
    });
    return;
  }

  const validation = createEventSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: 'Please check the event data.',
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  const data = validation.data;

  if (data.endTime && data.endTime <= data.startTime) {
    res.status(400).json({
      message: 'End time must be later than start time.',
    });
    return;
  }

  if (data.date < new Date().toISOString().slice(0, 10)) {
    res.status(400).json({
      message: 'Event date cannot be in the past.',
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      res.status(401).json({
        message: 'Your account could not be found. Please sign in again.',
      });
      return;
    }

    const now = new Date().toISOString();
    const category =
      data.category === 'IT & Networking'
        ? 'IT_NETWORKING'
        : data.category;

    const createdEvent = await prisma.event.create({
      data: {
        id: randomUUID(),
        title: data.title,
        description: data.description,
        category,
        imageUrl:
          data.imageUrl ??
          'https://picsum.photos/seed/uaround-event/800/450',
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        bundesland: data.bundesland,
        city: data.city,
        venue: data.venue,
        address: data.address || null,
        participantLimit: data.participantLimit,
        registeredCount: 0,
        status: 'open',
        creatorId: user.id,
        ownerUserId: user.id,
        createdAt: now,
        updatedAt: now,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Event created successfully.',
      event: formatEvent(createdEvent),
    });
  } catch (error) {
    console.error('Failed to create event:', error);

    res.status(500).json({
      message: 'Failed to create event. Please try again later.',
    });
  }
});

export default router;
