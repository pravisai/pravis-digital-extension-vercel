
export interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    start: {
      dateTime?: string;
      date?: string;
      timeZone?: string;
    };
    end: {
      dateTime?: string;
      date?: string;
      timeZone?: string;
    };
    attendees?: {
      email: string;
      responseStatus: string;
    }[];
    hangoutLink?: string;
    location?: string;
    creator?: {
      email: string;
      self: boolean;
    };
    isTask?: boolean;
  }
  
