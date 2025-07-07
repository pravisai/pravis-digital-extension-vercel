// src/lib/calendar.ts
export const fetchCalendarEvents = async (accessToken: string) => {
    const now = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&singleEvents=true&orderBy=startTime`;
  
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      console.error('Google Calendar API Error:', data);
      throw new Error(data.error?.message || 'Failed to fetch events');
    }
  
    return data.items || [];
  };
  