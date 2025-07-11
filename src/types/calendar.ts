
export interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    start: {
      dateTime?: string;
      date?: string;
    };
    end: {
      dateTime?: string;
      date?: string;
    };
    attendees?: {
      email: string;
      responseStatus: string;
    }[];
    hangoutLink?: string;
    location?: string;
  }
  