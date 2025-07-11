'use server';

import type { CalendarEvent } from '@/types/calendar';

/**
 * Fetches upcoming Google Calendar events using the provided OAuth access token.
 * @param accessToken OAuth 2.0 token retrieved during sign-in
 */
export const fetchCalendarEvents = async (
  accessToken: string
): Promise<{ events: CalendarEvent[]; error: string | null }> => {
  const now = new Date().toISOString();

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=10&singleEvents=true&orderBy=startTime`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
  }));

  return { events, error: null };
};
