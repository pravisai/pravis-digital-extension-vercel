
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
  const timeMin = now.toISOString();

  let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=250&singleEvents=true&orderBy=startTime`;

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
    isTask: event.summary?.toLowerCase().includes('task:'), // Simple task identification
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

/**
 * Deletes an event from the user's primary Google Calendar.
 * @param accessToken OAuth 2.0 token
 * @param eventId The ID of the event to delete
 */
export const deleteCalendarEvent = async (accessToken: string, eventId: string): Promise<{ error: string | null }> => {
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      console.error('Google Calendar API Error (Delete):', errorData);
      return { error: errorData?.error?.message || 'Could not delete the event.' };
    } catch (e) {
      const textError = await response.text();
       console.error('Non-JSON error response (Delete):', textError);
      return { error: textError || 'Failed to delete event.' };
    }
  }
  return { error: null };
}

/**
 * Updates an event in the user's primary Google Calendar.
 * @param accessToken OAuth 2.0 token
 * @param eventId The ID of the event to update
 * @param details The updated details of the event
 */
export const updateCalendarEvent = async (
  accessToken: string,
  eventId: string,
  details: EventCreationDetails
): Promise<{ event: CalendarEvent | null; error: string | null }> => {
   let start, end;

  if (details.isAllDay) {
    start = { date: format(details.startDate, 'yyyy-MM-dd') };
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
  };

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });
  
  if (!response.ok) {
     try {
      const errorData = await response.json();
      console.error('Google Calendar API Error (Update):', errorData);
      return {
        event: null,
        error: errorData?.error?.message || 'Could not update the event.',
      };
    } catch (e) {
      const textError = await response.text();
      console.error('Non-JSON error response (Update):', textError);
      return {
        event: null,
        error: textError || 'Failed to update event.',
      };
    }
  }
  
  const updatedEvent = await response.json();
  return { event: updatedEvent, error: null };
};
