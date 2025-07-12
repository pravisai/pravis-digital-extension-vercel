
"use client"

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { createCalendarEvent, updateCalendarEvent, type EventCreationDetails } from "@/lib/calender";
import type { CalendarEvent } from '@/types/calendar';

const eventFormSchema = z.object({
  summary: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  isAllDay: z.boolean(),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)").optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)").optional(),
}).refine(data => {
    if (!data.isAllDay) {
        return !!data.startTime && !!data.endTime;
    }
    return true;
}, {
    message: "Start and end times are required for timed events.",
    path: ["startTime"],
}).refine(data => {
    if (!data.isAllDay && data.startTime && data.endTime) {
        const start = new Date(`${format(data.startDate, 'yyyy-MM-dd')}T${data.startTime}`);
        const end = new Date(`${format(data.endDate, 'yyyy-MM-dd')}T${data.endTime}`);
        return end > start;
    }
    return data.endDate >= data.startDate;
}, {
    message: "End date and time must be after start date and time.",
    path: ["endDate"],
});


type EventFormValues = z.infer<typeof eventFormSchema>;

interface CreateEventDialogProps {
    accessToken: string;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onEventCreated: () => void;
    eventToEdit?: CalendarEvent | null;
}

export function CreateEventDialog({ accessToken, isOpen, onOpenChange, onEventCreated, eventToEdit }: CreateEventDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const isEditing = !!eventToEdit;

    const getDefaultValues = () => {
        if (isEditing && eventToEdit) {
            const isAllDayEvent = !!eventToEdit.start.date;
            return {
                summary: eventToEdit.summary || "",
                description: eventToEdit.description || "",
                isAllDay: isAllDayEvent,
                startDate: parseISO(eventToEdit.start.date || eventToEdit.start.dateTime!),
                endDate: parseISO(eventToEdit.end.date || eventToEdit.end.dateTime!),
                startTime: isAllDayEvent ? "" : format(parseISO(eventToEdit.start.dateTime!), "HH:mm"),
                endTime: isAllDayEvent ? "" : format(parseISO(eventToEdit.end.dateTime!), "HH:mm"),
            }
        }
        return {
            summary: "",
            description: "",
            isAllDay: false,
            startDate: new Date(),
            endDate: new Date(),
            startTime: format(new Date(), "HH:mm"),
            endTime: format(new Date(new Date().getTime() + 60 * 60 * 1000), "HH:mm")
        }
    };

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: getDefaultValues(),
    });

    useEffect(() => {
        reset(getDefaultValues());
    }, [eventToEdit, reset]);

    const isAllDay = watch("isAllDay");
    const startDate = watch("startDate");

     useEffect(() => {
        // When start date changes, if end date is before it, update end date.
        const endDate = watch("endDate");
        if (endDate < startDate) {
           setValue("endDate", startDate);
        }
    }, [startDate, setValue, watch]);

    const onSubmit = async (data: EventFormValues) => {
        setIsLoading(true);
        const details: EventCreationDetails = { ...data };

        try {
            let result;
            if (isEditing && eventToEdit) {
                result = await updateCalendarEvent(accessToken, eventToEdit.id, details);
            } else {
                result = await createCalendarEvent(accessToken, details);
            }

            if (result.error) {
                throw new Error(result.error);
            }
            toast({
                title: isEditing ? "Event Updated" : "Event Created",
                description: `"${data.summary}" has been saved.`,
            });
            onEventCreated();
            onOpenChange(false);
        } catch (err: any) {
            console.error("Failed to save event:", err);
            toast({
                variant: "destructive",
                title: "Error Saving Event",
                description: err.message || "Could not save the event. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update the details for your event.' : 'Add a new event to your primary Google Calendar.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="summary">Title</Label>
                        <Controller
                            name="summary"
                            control={control}
                            render={({ field }) => <Input id="summary" placeholder="e.g., Team Meeting or Task: Finish report" {...field} />}
                        />
                        {errors.summary && <p className="text-sm text-destructive mt-1">{errors.summary.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => <Textarea id="description" {...field} />}
                        />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Controller
                            name="isAllDay"
                            control={control}
                            render={({ field }) => <Switch id="all-day" checked={field.value} onCheckedChange={field.onChange} />}
                        />
                        <Label htmlFor="all-day">All-day event</Label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Start Date</Label>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                        </div>

                         {!isAllDay && (
                            <div>
                                <Label htmlFor="startTime">Start Time</Label>
                                 <Controller
                                    name="startTime"
                                    control={control}
                                    render={({ field }) => <Input id="startTime" type="time" {...field} />}
                                />
                            </div>
                        )}
                        
                        <div>
                             <Label>End Date</Label>
                             <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={{ before: startDate }} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                        </div>
                        
                        {!isAllDay && (
                            <div>
                                <Label htmlFor="endTime">End Time</Label>
                                <Controller
                                    name="endTime"
                                    control={control}
                                    render={({ field }) => <Input id="endTime" type="time" {...field} />}
                                />
                            </div>
                        )}
                    </div>
                     {errors.endDate && <p className="text-sm text-destructive mt-1">{errors.endDate.message}</p>}
                     {errors.startTime && <p className="text-sm text-destructive mt-1">{errors.startTime.message}</p>}

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? 'Save Changes' : 'Create Event'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
