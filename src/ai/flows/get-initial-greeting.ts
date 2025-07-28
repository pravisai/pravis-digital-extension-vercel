
'use server';
/**
 * @fileOverview This file handles the server-side logic for generating an initial greeting.
 * It fetches user data and calendar events to provide a personalized welcome message.
 */

import { auth } from '@/lib/firebase/config';
import { getValidAccessToken } from '@/lib/firebase/auth';
import { fetchCalendarEvents } from '@/lib/calender';
import { generateGreeting } from './generate-greeting';

export async function getInitialGreeting(): Promise<string> {
    const user = auth.currentUser;

    if (!user) {
        return "Shall we begin?";
    }

    try {
        const validToken = getValidAccessToken();
        let events: any[] = [];
        
        if (validToken) {
            const { events: fetchedEvents, error } = await fetchCalendarEvents(validToken);
            if (!error) {
                events = fetchedEvents.map(e => ({ 
                    summary: e.summary, 
                    start: e.start?.dateTime || e.start?.date || '' 
                }));
            } else {
                console.warn("Could not fetch calendar events for greeting:", error);
            }
        }

        const { greeting } = await generateGreeting({
            userName: user.displayName || 'Sir',
            events: events,
        });

        return greeting;
    } catch (e) {
        console.error("Failed to generate initial greeting:", e);
        return `Welcome back, ${user.displayName || 'Sir'}. I'm ready for your command.`;
    }
}
