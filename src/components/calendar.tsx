
"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar as CalendarIcon, Users, Video, MapPin, Loader2, AlertCircle, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, isSameDay, parseISO, startOfDay } from 'date-fns';
import { fetchCalendarEvents } from '@/lib/calender';
import type { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Typewriter } from './animations/typewriter';

const EventItem = ({ event }: { event: CalendarEvent }) => {
    const startTime = event.start.dateTime ? format(parseISO(event.start.dateTime), 'h:mm a') : 'All day';
    const endTime = event.end.dateTime ? format(parseISO(event.end.dateTime), 'h:mm a') : '';

    const getInitials = (email: string) => {
        const nameParts = email.split('@')[0].split('.').map(part => part.charAt(0).toUpperCase());
        return nameParts.join('');
    };

    return (
        <div className="p-4 rounded-lg bg-card/50 hover:bg-accent transition-colors border border-border/20 mb-3">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="font-semibold text-base">{event.summary}</p>
                    <p className="text-sm text-muted-foreground">{startTime} {endTime && `- ${endTime}`}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
            <div className="mt-3 space-y-2 text-sm">
                {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.location}</span>
                    </div>
                )}
                {event.hangoutLink && (
                    <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-primary" />
                        <a href={event.hangoutLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            Join Google Meet
                        </a>
                    </div>
                )}
                {event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center gap-2 pt-2">
                        <Users className="h-4 w-4 text-primary" />
                        <div className="flex -space-x-2">
                            <TooltipProvider>
                                {event.attendees.slice(0, 5).map(attendee => (
                                    <Tooltip key={attendee.email}>
                                        <TooltipTrigger asChild>
                                            <Avatar className="h-6 w-6 border-2 border-background">
                                                <AvatarFallback>{getInitials(attendee.email)}</AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{attendee.email}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </TooltipProvider>
                            {event.attendees.length > 5 && (
                                <Avatar className="h-6 w-6 border-2 border-background">
                                    <AvatarFallback>+{event.attendees.length - 5}</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export function CalendarView({ accessToken }: { accessToken: string }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { events: fetchedEvents, error: fetchError } = await fetchCalendarEvents(accessToken);
            if (fetchError) {
                throw new Error(fetchError);
            }
            setEvents(fetchedEvents);
        } catch (err: any) {
            console.error("Failed to fetch calendar events:", err);
            setError(err.message || "An unknown error occurred while fetching events.");
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || "Could not fetch calendar events. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, toast]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const dailyEvents = useMemo(() => {
        if (!date) return [];
        return events
            .filter(event => {
                const eventDate = event.start.dateTime ? parseISO(event.start.dateTime) : (event.start.date ? startOfDay(parseISO(event.start.date)) : null);
                return eventDate && isSameDay(eventDate, date);
            })
            .sort((a, b) => {
                const aDate = a.start.dateTime ? parseISO(a.start.dateTime).valueOf() : 0;
                const bDate = b.start.dateTime ? parseISO(b.start.dateTime).valueOf() : 0;
                return aDate - bDate;
            });
    }, [date, events]);
    
    const eventDays = useMemo(() => {
        return events.map(event => event.start.dateTime ? parseISO(event.start.dateTime) : startOfDay(parseISO(event.start.date!)));
    }, [events]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 h-full gap-6">
            <aside className="lg:col-span-1 flex flex-col gap-6">
                <Button size="lg" className="w-full text-lg"><Plus className="mr-2 h-5 w-5"/> Create Event</Button>
                <Card>
                    <CardContent className="p-2">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="p-0"
                            modifiers={{ hasEvent: eventDays }}
                            modifiersClassNames={{
                                hasEvent: 'relative bg-primary/10 rounded-md',
                            }}
                        />
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Upcoming</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">Your next 3 events.</p>
                     </CardContent>
                </Card>
            </aside>
            <main className="lg:col-span-3 flex flex-col bg-card/30 rounded-lg border">
                <header className="p-4 flex justify-between items-center border-b">
                    <div>
                        <Typewriter text={date ? format(date, 'EEEE, LLLL d') : 'Calendar'} className="text-2xl font-bold" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={fetchEvents} disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Refresh"}
                        </Button>
                        <Button variant="outline">Day</Button>
                        <Button variant="outline">Week</Button>
                        <Button variant="secondary">Month</Button>
                    </div>
                </header>
                <ScrollArea className="flex-1">
                    <div className="p-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : error ? (
                            <Alert variant="destructive" className="m-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error Fetching Events</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : dailyEvents.length > 0 ? (
                            dailyEvents.map(event => <EventItem key={event.id} event={event} />)
                        ) : (
                            <div className="text-center py-20 text-muted-foreground">
                                <CalendarIcon className="mx-auto h-12 w-12" />
                                <p className="mt-4 text-lg">No events scheduled for this day.</p>
                                <p className="text-sm">Enjoy your free time!</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </main>
        </div>
    );
}
