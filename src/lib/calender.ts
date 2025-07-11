
'use server';

import type { CalendarEvent } from '@/types/calendar';
import { format, set, type Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';

/**
 * Fetches upcoming Google Calendar events using the provided OAuth access token.
 * Can filter for "tasks" which are all-day events with a specific creator.
 * @param accessToken OAuth 2.0 token retrieved during sign-in
 * @param tasksOnly If true, fetches only events created by this app (assumed to be tasks)
 */
export const fetchCalendarEvents = async (
  accessToken: string,
  tasksOnly = false
): Promise<{ events: CalendarEvent[]; error: string | null }> => {
  const now = new Date();
  const timeMin = tasksOnly ? new Date(now.setFullYear(now.getFullYear() - 1)).toISOString() : now.toISOString();

  let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=250&singleEvents=true&orderBy=startTime`;
  if (tasksOnly) {
    // This is a simple way to identify tasks created by the app.
    // A more robust way might be to use extended properties.
    url += `&q=Created from Pravis Productivity Suite`;
  }


  const response = await fetch(
    url,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    try {
      const errorData = await response.json();
      console.error('Google Calendar API Error:', errorData);
      return {
        events: [],
        error: errorData?.error?.message || 'Unknown error occurred while fetching calendar events.',
      };
    } catch (e) {
      const textError = await response.text();
      console.error('Non-JSON error response:', textError);
      return {
        events: [],
        error: textError || 'Failed to fetch calendar events.',
      };
    }
  }

  const data = await response.json();

  const events: CalendarEvent[] = (data.items || []).map((event: any) => ({
    id: event.id,
    summary: event.summary || 'No Title',
    start: event.start,
    end: event.end,
    location: event.location || 'Not specified',
    description: event.description || '',
    attendees: event.attendees || [],
    hangoutLink: event.hangoutLink,
    creator: event.creator,
  }));

  return { events, error: null };
};


export interface EventCreationDetails {
  summary: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
}

/**
 * Creates a new event in the user's primary Google Calendar.
 * @param accessToken OAuth 2.0 token
 * @param details The details of the event to create
 */
export const createCalendarEvent = async (
  accessToken: string,
  details: EventCreationDetails
): Promise<{ event: CalendarEvent | null; error: string | null }> => {

  let start, end;

  if (details.isAllDay) {
    start = { date: format(details.startDate, 'yyyy-MM-dd') };
    // For all-day events, the end date is exclusive, so add one day.
    end = { date: format(new Date(details.endDate.getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd') };
  } else {
    const [startHour, startMinute] = (details.startTime || "00:00").split(':').map(Number);
    const startDateTime = set(details.startDate, { hours: startHour, minutes: startMinute });

    const [endHour, endMinute] = (details.endTime || "00:00").split(':').map(Number);
    const endDateTime = set(details.endDate, { hours: endHour, minutes: endMinute });

    start = { dateTime: startDateTime.toISOString() };
    end = { dateTime: endDateTime.toISOString() };
  }

  const event = {
    summary: details.summary,
    description: details.description,
    start,
    end,
    // extendedProperties: {
    //   private: { 'created_by': 'pravis_app' }
    // }
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });

  if (!response.ok) {
     try {
      const errorData = await response.json();
      console.error('Google Calendar API Error:', errorData);
      return {
        event: null,
        error: errorData?.error?.message || 'Unknown error occurred while creating the event.',
      };
    } catch (e) {
      const textError = await response.text();
      console.error('Non-JSON error response:', textError);
      return {
        event: null,
        error: textError || 'Failed to create event.',
      };
    }
  }

  const createdEvent = await response.json();
  return { event: createdEvent, error: null };
}
