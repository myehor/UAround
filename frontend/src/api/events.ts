
import type { Event } from '../types/event';

type EventsResponse = {
  message: string;
  total: number;
  events: Event[];
};

export async function getEvents(): Promise<Event[]> {
  const response = await fetch('/api/events');

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  const data: EventsResponse = await response.json();

  return data.events;
}


export type CreateEventPayload = {
  title: string
  description: string
  category:
    | 'Sport'
    | 'Party'
    | 'Social'
    | 'Music'
    | 'IT & Networking'
    | 'Education'
    | 'Family'
    | 'Culture'
    | 'Volunteering'
    | 'Other'
  imageUrl?: string
  date: string
  startTime: string
  endTime?: string
  bundesland: string
  city: string
  venue: string
  address?: string
  participantLimit?: number
}

type CreateEventResponse = {
  message: string
  event: Event
}

export async function createEvent(
  payload: CreateEventPayload,
): Promise<Event> {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as Partial<CreateEventResponse> & {
    message?: string
  }

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create event.')
  }

  if (!data.event) {
    throw new Error('The server did not return the created event.')
  }

  return data.event
}

export async function getMyEvents(): Promise<Event[]> {
  const response = await fetch('/api/events/my', {
    credentials: 'include',
  })

  const data: EventsResponse = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch your events.')
  }

  return data.events
}
