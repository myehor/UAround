
import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  imageData: z.string().optional(),
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

// GET /api/events/:eventId/registration
router.get('/:eventId/registration', async (req, res) => {
  const userId = req.session.userId
  const { eventId } = req.params

  if (!userId) {
    res.status(401).json({
      message: 'Please sign in to check your registration.',
    })
    return
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    })

    if (!event) {
      res.status(404).json({ message: 'Event not found.' })
      return
    }

    const registration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
      select: { id: true },
    })

    res.status(200).json({
      isRegistered: Boolean(registration),
    })
  } catch (error) {
    console.error('Failed to check event registration:', error)

    res.status(500).json({
      message: 'Failed to check registration status.',
    })
  }
})

// GET /api/events/:eventId/participants — участники мероприятия
router.get('/:eventId/participants', async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!event) {
      res.status(404).json({
        message: 'Event not found.',
      });
      return;
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      select: {
        registeredAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { registeredAt: 'asc' },
    });

    const participants = registrations.map(({ user }) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    }));

    res.json({
      message: 'Event participants loaded successfully.',
      total: participants.length,
      participants,
    });
  } catch (error) {
    console.error('Failed to fetch event participants:', error);

    res.status(500).json({
      message: 'Failed to fetch event participants.',
    });
  }
});

// POST /api/events/:eventId/register — регистрация на мероприятие
router.post('/:eventId/register', async (req, res) => {
  const userId = req.session.userId;
  const { eventId } = req.params;

  if (!userId) {
    res.status(401).json({
      message: 'Please sign in to register for an event.',
    });
    return;
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const event = await tx.event.findUnique({
          where: { id: eventId },
          include: {
            registrations: {
              where: { userId },
              select: { id: true },
            },
          },
        });

        if (!event) {
          return { status: 404, message: 'Event not found.' };
        }

        if (event.ownerUserId === userId || event.creatorId === userId) {
          return {
            status: 400,
            message: 'You cannot register for your own event.',
          };
        }

        if (event.status !== 'open' && event.status !== 'almostFull') {
          return {
            status: 400,
            message: 'This event is not open for registration.',
          };
        }

        if (event.registrations.length > 0) {
          return {
            status: 409,
            message: 'You are already registered for this event.',
          };
        }

        const registeredCount = await tx.eventRegistration.count({
          where: { eventId },
        });

        if (
          event.participantLimit !== null &&
          registeredCount >= event.participantLimit
        ) {
          return {
            status: 400,
            message: 'This event is fully booked.',
          };
        }

        await tx.eventRegistration.create({
          data: { userId, eventId },
        });

        const nextCount = registeredCount + 1;
        const nextStatus =
          event.participantLimit !== null &&
          nextCount >= event.participantLimit
            ? 'fullyBooked'
            : event.participantLimit !== null &&
                nextCount >= event.participantLimit * 0.8
              ? 'almostFull'
              : 'open';

        await tx.event.update({
          where: { id: eventId },
          data: {
            registeredCount: nextCount,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          },
        });

        return {
          status: 201,
          message: 'Successfully registered for the event.',
          registeredCount: nextCount,
          registrationStatus: nextStatus,
        };
      },
      { isolationLevel: 'Serializable' },
    );

    res.status(result.status).json(result);
  } catch (error) {
    console.error('Failed to register for event:', error);

    res.status(500).json({
      message: 'Failed to register for this event. Please try again.',
    });
  }
});

// DELETE /api/events/:eventId/register — отмена регистрации
router.delete('/:eventId/register', async (req, res) => {
  const userId = req.session.userId;
  const { eventId } = req.params;

  if (!userId) {
    res.status(401).json({
      message: 'Please sign in to cancel your registration.',
    });
    return;
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const event = await tx.event.findUnique({
          where: { id: eventId },
        });

        if (!event) {
          return { status: 404, message: 'Event not found.' };
        }

        const registration = await tx.eventRegistration.findUnique({
          where: {
            userId_eventId: { userId, eventId },
          },
        });

        if (!registration) {
          return {
            status: 404,
            message: 'You are not registered for this event.',
          };
        }

        await tx.eventRegistration.delete({
          where: { id: registration.id },
        });

        const nextCount = Math.max(
          await tx.eventRegistration.count({ where: { eventId } }),
          0,
        );

        const nextStatus =
          event.status === 'closed' || event.status === 'cancelled'
            ? event.status
            : event.participantLimit !== null &&
                nextCount >= event.participantLimit
              ? 'fullyBooked'
              : event.participantLimit !== null &&
                  nextCount >= event.participantLimit * 0.8
                ? 'almostFull'
                : 'open';

        await tx.event.update({
          where: { id: eventId },
          data: {
            registeredCount: nextCount,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          },
        });

        return {
          status: 200,
          message: 'Registration cancelled successfully.',
          registeredCount: nextCount,
          registrationStatus: nextStatus,
        };
      },
      { isolationLevel: 'Serializable' },
    );

    res.status(result.status).json(result);
  } catch (error) {
    console.error('Failed to cancel event registration:', error);

    res.status(500).json({
      message: 'Failed to cancel registration. Please try again.',
    });
  }
});


 // GET /api/events/my/attending — мероприятия, на которые записан текущий пользователь
router.get('/my/attending', async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.status(401).json({
      message: 'Please sign in to view your attending events.',
    });
    return;
  }

  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: true,
      },
      orderBy: { registeredAt: 'desc' },
    });

    const events = registrations.map(({ event }) => formatEvent(event));

    res.json({
      message: 'Your attending events loaded successfully.',
      total: events.length,
      events,
    });
  } catch (error) {
    console.error('Failed to fetch attending events:', error);

    res.status(500).json({
      message: 'Failed to fetch your attending events.',
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

    let imageUrl = '/images/event-placeholder.png';

    if (data.imageData) {
      const match = data.imageData.match(
        /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/,
      );

      if (!match) {
        res.status(400).json({
          message: 'Please upload a valid JPG, PNG, or WebP image.',
        });
        return;
      }

      const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
      const imageBuffer = Buffer.from(match[2], 'base64');

      if (
        imageBuffer.length === 0 ||
        imageBuffer.length > 5 * 1024 * 1024
      ) {
        res.status(400).json({
          message: 'Event image must be no larger than 5 MB.',
        });
        return;
      }

      const uploadsDir = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '..',
        'uploads',
        'events',
      );

      await mkdir(uploadsDir, { recursive: true });

      const filename = `${randomUUID()}.${extension}`;

      await writeFile(path.join(uploadsDir, filename), imageBuffer);

      imageUrl = `/uploads/events/${filename}`;
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
        imageUrl,
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
