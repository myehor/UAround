
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
