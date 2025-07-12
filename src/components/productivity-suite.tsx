
"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, ListTodo, Calendar as CalendarIcon, Loader2, AlertCircle, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isSameDay, parseISO, startOfDay } from 'date-fns';
import { fetchCalendarEvents, deleteCalendarEvent, updateCalendarEvent, type EventCreationDetails } from '@/lib/calender';
import type { CalendarEvent } from '@/types/calendar';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Typewriter } from './animations/typewriter';
import { CreateEventDialog } from './create-event-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { AnimatePresence, motion } from 'framer-motion';

const EventItem = ({ event, onDelete, onEdit }: { event: CalendarEvent, onDelete: (id: string) => void, onEdit: (event: CalendarEvent) => void }) => {
    const startTime = event.start.dateTime ? format(parseISO(event.start.dateTime), 'h:mm a') : 'All day';
    const isTask = !!event.isTask;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-lg bg-card/50 hover:bg-accent transition-colors border border-border/20 mb-3 group"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                    {isTask ? <ListTodo className="h-5 w-5 mt-1 text-primary" /> : <CalendarIcon className="h-5 w-5 mt-1 text-primary" />}
                    <div>
                        <p className="font-semibold text-base">{event.summary}</p>
                        <p className="text-sm text-muted-foreground">{startTime}</p>
                    </div>
                </div>
                 <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(event)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this {isTask ? 'task' : 'event'} from your calendar.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(event.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </motion.div>
    );
};

export function ProductivitySuite({ accessToken }: { accessToken: string }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { events: fetchedEvents, error: fetchError } = await fetchCalendarEvents(accessToken);
            if (fetchError) throw new Error(fetchError);
            setEvents(fetchedEvents);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred while fetching events.");
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleEventCreatedOrUpdated = () => {
        fetchEvents();
        setEditingEvent(null);
    };

    const handleDelete = async (eventId: string) => {
        const originalEvents = [...events];
        setEvents(events.filter(e => e.id !== eventId)); // Optimistic update

        const { error } = await deleteCalendarEvent(accessToken, eventId);
        if (error) {
            toast({ variant: "destructive", title: "Error Deleting", description: error });
            setEvents(originalEvents); // Revert on failure
        } else {
            toast({ title: "Deleted", description: "The event has been removed from your calendar." });
        }
    };
    
    const handleEdit = (event: CalendarEvent) => {
        setEditingEvent(event);
        setIsCreateDialogOpen(true);
    }
    
    const handleDialogClose = () => {
        setEditingEvent(null);
        setIsCreateDialogOpen(false);
    }

    const dailyItems = useMemo(() => {
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
        return events
            .map(event => {
                if (event.start?.dateTime) return parseISO(event.start.dateTime);
                if (event.start?.date) return startOfDay(parseISO(event.start.date));
                return null;
            })
            .filter((d): d is Date => d !== null);
    }, [events]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 h-full gap-6">
            <aside className="lg:col-span-1 flex flex-col gap-6">
                <Button size="lg" className="w-full text-lg" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-5 w-5"/> Create Event or Task
                </Button>
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
            </aside>
            <main className="lg:col-span-2 flex flex-col bg-card/30 rounded-lg border">
                <header className="p-4 flex justify-between items-center border-b">
                     <Typewriter text={date ? format(date, 'EEEE, LLLL d') : 'Productivity Suite'} className="text-2xl font-bold" />
                    <Button variant="outline" onClick={fetchEvents} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Refresh"}
                    </Button>
                </header>
                <ScrollArea className="flex-1">
                    <div className="p-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                        ) : error ? (
                            <Alert variant="destructive" className="m-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error Fetching Data</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : dailyItems.length > 0 ? (
                            <AnimatePresence>
                                {dailyItems.map(item => <EventItem key={item.id} event={item} onDelete={handleDelete} onEdit={handleEdit} />)}
                            </AnimatePresence>
                        ) : (
                            <div className="text-center py-20 text-muted-foreground">
                                <CalendarIcon className="mx-auto h-12 w-12" />
                                <p className="mt-4 text-lg">No events or tasks scheduled for this day.</p>
                                <p className="text-sm">Enjoy your free time or add a new item!</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </main>
             <CreateEventDialog 
                key={editingEvent?.id || 'new'}
                accessToken={accessToken}
                isOpen={isCreateDialogOpen}
                onOpenChange={handleDialogClose}
                onEventCreated={handleEventCreatedOrUpdated}
                eventToEdit={editingEvent}
             />
        </div>
    );
}
