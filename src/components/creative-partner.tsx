
"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Calendar as CalendarIcon, Edit, Trash2, ChevronDown, ListFilter, BarChart, Sun, Zap, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, parseISO, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { CalendarEvent } from '@/types/calendar';
import { fetchCalendarEvents, createCalendarEvent } from '@/lib/calender';
import { useToast } from '@/hooks/use-toast';


export function CreativePartner({ accessToken }: { accessToken: string }) {
  const [tasks, setTasks] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();
  const [isAddingTask, setIsAddingTask] = useState(false);

  const [editingTask, setEditingTask] = useState<CalendarEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<{ status: 'All' | 'Completed' | 'Incomplete' }>({ status: 'All' });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const { events: fetchedEvents, error: fetchError } = await fetchCalendarEvents(accessToken, true); // true for tasks
        if (fetchError) {
            throw new Error(fetchError);
        }
        setTasks(fetchedEvents);
    } catch (err: any) {
        console.error("Failed to fetch tasks:", err);
        setError(err.message || "An unknown error occurred while fetching tasks.");
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch tasks from Google Calendar.",
        });
    } finally {
        setIsLoading(false);
    }
  }, [accessToken, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDueDate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a title and a due date for the task."
      });
      return;
    };
    setIsAddingTask(true);
    try {
      const result = await createCalendarEvent(accessToken, newTaskTitle, "Created from Pravis Productivity Suite.", newTaskDueDate);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: "Task Created",
        description: `"${newTaskTitle}" has been added to your calendar.`,
      });
      setNewTaskTitle('');
      setNewTaskDueDate(undefined);
      fetchTasks(); // Refresh tasks
    } catch (err: any) {
      console.error("Failed to create task:", err);
      toast({
          variant: "destructive",
          title: "Error Creating Task",
          description: err.message || "Could not create the task. Please try again.",
      });
    } finally {
      setIsAddingTask(false);
    }
  };
  
  const handleDeleteTask = (id: string) => {
    // TODO: Implement Google Calendar event deletion
    console.log("Deleting task:", id);
    toast({ title: "Note", description: "Deleting events from calendar is not yet implemented."})
  };

  const handleUpdateTask = (updatedTask: CalendarEvent) => {
    // TODO: Implement Google Calendar event update
     console.log("Updating task:", updatedTask);
    toast({ title: "Note", description: "Updating events from calendar is not yet implemented."})
    setEditingTask(null);
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => searchTerm === '' || task.summary.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(task => {
        if (!selectedDate) return true;
        const eventDate = task.start?.date ? startOfDay(parseISO(task.start.date)) : (task.start?.dateTime ? parseISO(task.start.dateTime) : null);
        return eventDate && isSameDay(eventDate, selectedDate);
      });
  }, [tasks, searchTerm, selectedDate]);

  const completionProgress = useMemo(() => {
    // Cannot determine completion from calendar events easily, so this is illustrative
    return 50;
  }, [tasks]);
  
  const dueDates = useMemo(() => {
    return tasks
      .map(task => {
        if (task.start?.dateTime) return parseISO(task.start.dateTime);
        if (task.start?.date) return startOfDay(parseISO(task.start.date));
        return null;
      })
      .filter((d): d is Date => d !== null);
  }, [tasks]);

  const TaskItem = ({ task }: { task: CalendarEvent }) => (
    <Card className={`mb-2 group transition-shadow duration-200 hover:shadow-md bg-card`}>
      <CardContent className="p-3 flex items-center gap-4">
        <Checkbox
          id={`task-${task.id}`}
          // checked={task.completed}
          // onCheckedChange={() => handleToggleComplete(task.id)}
          className="h-5 w-5"
        />
        <div className="flex-1">
          <label htmlFor={`task-${task.id}`} className={`font-medium`}>
            {task.summary}
          </label>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
             {task.start?.date && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {format(startOfDay(parseISO(task.start.date)), 'MMM d')}
              </span>
            )}
             {task.start?.dateTime && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {format(parseISO(task.start.dateTime), 'MMM d, h:mm a')}
              </span>
            )}
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}><Edit className="h-4 w-4" /></Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this task from your calendar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteTask(task.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Task to Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-2">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g., Finalize project proposal"
                className="flex-grow"
              />
              <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full md:w-[280px] justify-start text-left font-normal",
                        !newTaskDueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTaskDueDate ? format(newTaskDueDate, "PPP") : <span>Pick a due date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTaskDueDate}
                      onSelect={setNewTaskDueDate}
                      initialFocus
                    />
                  </PopoverContent>
              </Popover>
              <Button type="submit" disabled={isAddingTask} className="w-full md:w-auto">
                {isAddingTask ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4"/>}
                Add Task
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>
                        {selectedDate ? `Tasks for ${format(selectedDate, 'MMM d')}` : "All Tasks"}
                    </CardTitle>
                    <CardDescription>{filteredTasks.length} tasks from your calendar</CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search tasks..." 
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                 </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-3">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <Alert variant="destructive" className="m-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error Fetching Tasks</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : filteredTasks.length > 0 ? (
                    filteredTasks.map(task => <TaskItem key={task.id} task={task} />)
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                        {tasks.length > 0 ? "No tasks match your filters." : "You have no tasks in your calendar."}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>Visualizing progress from calendar tasks.</CardDescription>
            </CardHeader>
            <CardContent>
                <Progress value={completionProgress} className="h-3" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                    {selectedDate ? `Filtered to ${format(selectedDate, 'PPP')}` : 'Select a day to filter tasks.'}
                </CardDescription>
                 <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setSelectedDate(undefined)}>Clear selection</Button>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="p-0"
                    modifiers={{ hasDueDate: dueDates }}
                    modifiersClassNames={{
                        hasDueDate: 'relative bg-primary/10 rounded-md',
                    }}
                />
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                 <Button variant="ghost" className="w-full justify-start"><BarChart className="mr-2 h-4 w-4"/>Productivity Report</Button>
                 <Button variant="ghost" className="w-full justify-start"><Sun className="mr-2 h-4 w-4"/>Set Daily Intentions</Button>
                 <Button variant="ghost" className="w-full justify-start"><Zap className="mr-2 h-4 w-4"/>AI Task Suggestions</Button>
            </CardContent>
        </Card>
      </div>

      {editingTask && <EditTaskDialog task={editingTask} onSave={handleUpdateTask} onCancel={() => setEditingTask(null)} />}
    </div>
  )
}

function EditTaskDialog({ task, onSave, onCancel }: { task: CalendarEvent, onSave: (task: CalendarEvent) => void, onCancel: () => void }) {
    const [summary, setSummary] = useState(task.summary);
    const [dueDate, setDueDate] = useState<Date | null>(task.start?.date ? startOfDay(parseISO(task.start.date)) : (task.start?.dateTime ? parseISO(task.start.dateTime) : null));

    const handleSave = () => {
        // Create an updated task object to send back
        // For simplicity, we'll keep the existing start/end times if they exist
        const updatedTask = { ...task, summary };
        if (dueDate) {
          // If only a date is present, it's an all-day event
          if (task.start.date && !task.start.dateTime) {
            updatedTask.start.date = format(dueDate, 'yyyy-MM-dd');
            updatedTask.end.date = format(dueDate, 'yyyy-MM-dd');
          } else { // It's a timed event
            // This is a simplified update, assumes event duration is constant
             updatedTask.start.dateTime = dueDate.toISOString();
             updatedTask.end.dateTime = new Date(dueDate.getTime() + (new Date(task.end.dateTime!).getTime() - new Date(task.start.dateTime!).getTime())).toISOString();
          }
        }
        onSave(updatedTask);
    };

    return (
        <AlertDialog open={true} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Task</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                    <Input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Task summary"/>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dueDate || undefined}
                          onSelect={(date) => setDueDate(date || null)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave}>Save Changes</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
