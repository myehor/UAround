export type EventCategory =
  | 'Sport'
  | 'Party'
  | 'Social'
  | 'Music'
  | 'IT & Networking'
  | 'Education'
  | 'Family'
  | 'Culture'
  | 'Volunteering'
  | 'Other';

export type EventStatus =
  | 'open'
  | 'almost-full'
  | 'fully-booked'
  | 'closed'
  | 'cancelled';

export type Event = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  imageUrl: string;

  date: string;
  startTime: string;
  endTime?: string;

  bundesland: string;
  city: string;
  venue: string;
  address?: string;

  participantLimit?: number;
  registeredCount: number;

  status: EventStatus;

  creatorId: string;
  createdBy?: {
    id: string
    firstName: string
    lastName: string
    avatarUrl: string | null
  } | null
  createdAt: string;
  updatedAt: string;
};