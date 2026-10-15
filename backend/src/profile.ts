import { Router } from 'express';
import { z } from 'zod';

import { prisma } from './lib/prisma.js';

const router = Router();

const profileSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  emailVerified: true,
  bundesland: true,
  city: true,
  bio: true,
  phone: true,
  avatarUrl: true,
  coverUrl: true,
  languages: true,
  profileCompleted: true,
  createdAt: true,
  updatedAt: true,
} as const;

const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(80).optional(),
  lastName: z.string().trim().min(1).max(80).optional(),
  bundesland: z.string().trim().min(1).max(100).optional(),
  city: z.string().trim().min(1).max(100).optional(),
  bio: z.string().trim().max(1000).nullable().optional(),
  phone: z.string().trim().max(40).nullable().optional(),
  languages: z.array(z.string().trim().min(1).max(40)).max(12).optional(),
});

router.get('/', async (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ message: 'Please sign in to view your profile.' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: profileSelect,
    });

    if (!user) {
      res.status(401).json({ message: 'User account was not found.' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Failed to load profile:', error);
    res.status(500).json({ message: 'Failed to load profile.' });
  }
});

router.patch('/', async (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ message: 'Please sign in to edit your profile.' });
    return;
  }

  const validation = updateProfileSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: 'Please check the profile data.',
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (Object.keys(validation.data).length === 0) {
    res.status(400).json({ message: 'No profile changes were provided.' });
    return;
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { id: true },
    });

    if (!currentUser) {
      res.status(401).json({ message: 'User account was not found.' });
      return;
    }

    const data = validation.data;
    const existingUser = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: {
        firstName: true,
        lastName: true,
        bundesland: true,
        city: true,
        bio: true,
      },
    });

    if (!existingUser) {
      res.status(401).json({ message: 'User account was not found.' });
      return;
    }

    const nextBio = data.bio === undefined ? existingUser.bio : data.bio;
    const nextFirstName = data.firstName ?? existingUser.firstName;
    const nextLastName = data.lastName ?? existingUser.lastName;
    const nextBundesland = data.bundesland ?? existingUser.bundesland;
    const nextCity = data.city ?? existingUser.city;
    const profileCompleted = Boolean(
      nextFirstName.trim() &&
      nextLastName.trim() &&
      nextBundesland.trim() &&
      nextCity.trim() &&
      nextBio?.trim(),
    );

    const user = await prisma.user.update({
      where: { id: req.session.userId },
      data: { ...data, profileCompleted },
      select: profileSelect,
    });

    res.json({ message: 'Profile saved successfully.', user });
  } catch (error) {
    console.error('Failed to update profile:', error);
    res.status(500).json({ message: 'Failed to save profile.' });
  }
});

export default router;
