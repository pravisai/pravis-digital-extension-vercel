// src/lib/calendar.ts
export const fetchCalendarEvents = async (accessToken: string) => {
    const now = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&singleEvents=true&orderBy=startTime`;
  
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      let errorMessage = 'Failed to fetch events';
      try {
        const errorData = await response.json();
        console.error('Google Calendar API Error:', errorData);
        errorMessage = errorData.error?.message || `API error: ${response.statusText}`;
      } catch (e) {
        console.error('Google Calendar API Error (non-JSON response):', await response.text());
        errorMessage = `API error: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
  
    const data = await response.json();
    return data.items || [];
  };
  