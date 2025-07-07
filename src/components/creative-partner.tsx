
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Calendar as CalendarIcon, Edit, Trash2, ChevronDown, ListFilter, BarChart, Sun, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
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


type TaskCategory = "Work" | "Personal" | "Management";
type TaskPriority = "Low" | "Medium" | "High";

interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: Date | null;
  completed: boolean;
}

const categoryConfig: Record<TaskCategory, { color: string, badge: string }> = {
  Work: { color: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800' },
  Personal: { color: 'bg-green-500', badge: 'bg-green-100 text-green-800' },
  Management: { color: 'bg-purple-500', badge: 'bg-purple-100 text-purple-800' },
};

const priorityConfig: Record<TaskPriority, { color: string, badge: string }> = {
  Low: { color: 'text-gray-500', badge: 'border-gray-300 text-gray-500' },
  Medium: { color: 'text-yellow-500', badge: 'border-yellow-300 text-yellow-600 bg-yellow-50' },
  High: { color: 'text-red-500', badge: 'border-red-300 text-red-600 bg-red-50' },
};

export function CreativePartner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<{ category: TaskCategory | 'All', status: 'All' | 'Completed' | 'Incomplete' }>({ category: 'All', status: 'All' });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  useEffect(() => {
    try {
        const storedTasks = localStorage.getItem('productivity-suite-tasks');
        if (storedTasks) {
            const parsedTasks = JSON.parse(storedTasks).map((t: any) => ({
                ...t,
                dueDate: t.dueDate ? new Date(t.dueDate) : null,
            }));
            setTasks(parsedTasks);
        }
    } catch (error) {
        console.error("Failed to parse tasks from localStorage", error)
        setTasks([])
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productivity-suite-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      category: 'Work',
      priority: 'Medium',
      dueDate: null,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };
  
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => searchTerm === '' || task.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(task => filter.category === 'All' || task.category === filter.category)
      .filter(task => {
        if (filter.status === 'All') return true;
        if (filter.status === 'Completed') return task.completed;
        if (filter.status === 'Incomplete') return !task.completed;
        return true;
      })
      .filter(task => {
        if (!selectedDate) return true;
        // Only show tasks for the selected date. isSameDay is from date-fns
        return task.dueDate && isSameDay(task.dueDate, selectedDate);
      });
  }, [tasks, searchTerm, filter, selectedDate]);

  const completionProgress = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    return tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  }, [tasks]);
  
  const dueDates = useMemo(() => {
    return tasks
        .filter(task => task.dueDate)
        .map(task => task.dueDate as Date);
  }, [tasks]);

  const TaskItem = ({ task }: { task: Task }) => (
    <Card className={`mb-2 group transition-shadow duration-200 hover:shadow-md ${task.completed ? 'bg-muted/50' : 'bg-card'}`}>
      <CardContent className="p-3 flex items-center gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => handleToggleComplete(task.id)}
          className="h-5 w-5"
        />
        <div className="flex-1">
          <label htmlFor={`task-${task.id}`} className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </label>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Badge variant="outline" className={cn("capitalize", priorityConfig[task.priority].badge)}>{task.priority}</Badge>
            <Badge variant="outline" className={categoryConfig[task.category].badge}>{task.category}</Badge>
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {format(task.dueDate, 'MMM d')}
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
                    This action cannot be undone. This will permanently delete this task.
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
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTask} className="flex gap-2">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g., Finish the report for Q3"
              />
              <Button type="submit"><Plus className="mr-2 h-4 w-4"/>Add Task</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>
                        {selectedDate ? `Tasks for ${format(selectedDate, 'MMM d')}` : "Today's Tasks"}
                    </CardTitle>
                    <CardDescription>{filteredTasks.length} tasks</CardDescription>
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline"><ListFilter className="mr-2 h-4 w-4"/>Filter</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilter({ ...filter, status: 'All' })}>All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter({ ...filter, status: 'Incomplete' })}>Incomplete</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter({ ...filter, status: 'Completed' })}>Completed</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-3">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => <TaskItem key={task.id} task={task} />)
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                        {selectedDate ? "No tasks for this day." : "No tasks found."}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>You've completed {tasks.filter(t=>t.completed).length} of {tasks.length} tasks.</CardDescription>
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
            <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                {(['All', 'Work', 'Personal', 'Management'] as const).map(cat => (
                    <Button key={cat} variant={filter.category === cat ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setFilter({ ...filter, category: cat })}>
                        {cat !== 'All' && <span className={`h-2 w-2 rounded-full mr-2 ${categoryConfig[cat as TaskCategory].color}`}></span>}
                        {cat}
                        <span className="ml-auto text-muted-foreground text-xs">
                            {cat === 'All' ? tasks.length : tasks.filter(t => t.category === cat).length}
                        </span>
                    </Button>
                ))}
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

function EditTaskDialog({ task, onSave, onCancel }: { task: Task, onSave: (task: Task) => void, onCancel: () => void }) {
    const [title, setTitle] = useState(task.title);
    const [category, setCategory] = useState<TaskCategory>(task.category);
    const [priority, setPriority] = useState<TaskPriority>(task.priority);
    const [dueDate, setDueDate] = useState<Date | null>(task.dueDate);

    const handleSave = () => {
        onSave({ ...task, title, category, priority, dueDate });
    };

    return (
        <AlertDialog open={true} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Task</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title"/>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                {category} <ChevronDown className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-popover-trigger-width)]">
                            <DropdownMenuItem onClick={() => setCategory('Work')}>Work</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCategory('Personal')}>Personal</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCategory('Management')}>Management</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                {priority} Priority <ChevronDown className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-popover-trigger-width)]">
                            <DropdownMenuItem onClick={() => setPriority('Low')}>Low</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPriority('Medium')}>Medium</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPriority('High')}>High</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
