'use server';

/**
 * Fetches upcoming Google Calendar events using the provided OAuth access token.
 * @param accessToken OAuth 2.0 token retrieved during sign-in
 */
export const fetchCalendarEvents = async (accessToken: string) => {
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
    const errorData = await response.json();
    console.error('Google Calendar API Error:', errorData);
    return { events: [], error: errorData.error?.message || 'Unknown error' };
  }

  const data = await response.json();

  const events = data.items.map((event: any) => ({
    id: event.id,
    summary: event.summary || 'No Title',
    start: event.start.dateTime || event.start.date,
    end: event.end.dateTime || event.end.date,
    location: event.location || 'Not specified',
    description: event.description || '',
  }));

  return { events, error: null };
};
