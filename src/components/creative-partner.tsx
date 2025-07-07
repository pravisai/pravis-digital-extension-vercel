
"use client"

import React, { useState, useEffect } from "react"
import { Plus, Pen, Trash2, Calendar as CalendarIcon, Lightbulb, Zap, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Task = {
  id: number
  title: string
  description: string
  dueDate: string
  priority: "Low" | "Medium" | "High"
  category: "Work" | "Personal" | "Management"
  completed: boolean
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Finalize the Q1 project proposal for client review",
    dueDate: "7/7/2025",
    priority: "High",
    category: "Work",
    completed: false,
  },
  {
    id: 2,
    title: "Review team feedback",
    description: "Go through feedback from the last sprint retrospective",
    dueDate: "7/7/2025",
    priority: "Medium",
    category: "Management",
    completed: true,
  },
  {
    id: 3,
    title: "Update portfolio website",
    description: "Add recent projects and update skills section",
    dueDate: "7/8/2025",
    priority: "Low",
    category: "Personal",
    completed: false,
  },
]

const priorityStyles = {
    High: "bg-red-500/10 text-red-500 border-red-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Low: "bg-green-500/10 text-green-500 border-green-500/20",
}

export function ProductivitySuite() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    try {
        const storedTasks = localStorage.getItem("productivity-suite-tasks")
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks))
        } else {
            setTasks(initialTasks)
        }
    } catch (error) {
        console.error("Failed to parse tasks from localStorage", error);
        setTasks(initialTasks);
    }
  }, [])

  useEffect(() => {
    try {
        localStorage.setItem("productivity-suite-tasks", JSON.stringify(tasks))
    } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
    }
  }, [tasks])

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle,
        description: "No description provided.",
        dueDate: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric'}),
        priority: "Medium",
        category: "Personal",
        completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
  };

  const handleToggleComplete = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  }

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const completedCount = tasks.filter(task => task.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  
  const categoryCounts = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  return (
    <div className="w-full">
        <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-transparent border-b rounded-none p-0 mb-6">
                <TabsTrigger value="tasks" className="pb-3 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Tasks</TabsTrigger>
                <TabsTrigger value="intentions" className="pb-3 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Daily Intentions</TabsTrigger>
                <TabsTrigger value="calendar" className="pb-3 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Calendar</TabsTrigger>
                <TabsTrigger value="progress" className="pb-3 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Progress</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg"><Plus size={18} /> Add New Task</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddTask} className="flex gap-2">
                                    <Input
                                        placeholder="Enter a new task..."
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                    />
                                    <Button type="submit">Add Task</Button>
                                </form>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">Today's Tasks</CardTitle>
                                    <span className="text-sm text-muted-foreground">{completedCount}/{tasks.length} completed</span>
                                </div>
                                <Progress value={progressPercentage} className="mt-2 h-1.5" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {tasks.map(task => (
                                    <div key={task.id} className="flex items-start gap-4 p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                        <Checkbox
                                            id={`task-${task.id}`}
                                            checked={task.completed}
                                            onCheckedChange={() => handleToggleComplete(task.id)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1 grid gap-1">
                                            <label htmlFor={`task-${task.id}`} className={cn("font-medium leading-none", task.completed && "line-through text-muted-foreground")}>{task.title}</label>
                                            <p className="text-sm text-muted-foreground">{task.description}</p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <CalendarIcon size={14}/>
                                                <span>Due: {task.dueDate}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                           <Badge variant="outline" className={cn("hidden md:inline-flex", priorityStyles[task.priority])}>{task.priority}</Badge>
                                           <Badge variant="secondary" className="hidden md:inline-flex">{task.category}</Badge>
                                           <div className="flex gap-0.5">
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><Pen size={14} /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDeleteTask(task.id)}><Trash2 size={14} /></Button>
                                           </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle className="text-lg">Task Categories</CardTitle></CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between items-center"><p className="text-muted-foreground">Work</p><Badge variant="secondary" className="font-mono">{categoryCounts['Work'] || 0}</Badge></div>
                                <div className="flex justify-between items-center"><p className="text-muted-foreground">Personal</p><Badge variant="secondary" className="font-mono">{categoryCounts['Personal'] || 0}</Badge></div>
                                <div className="flex justify-between items-center"><p className="text-muted-foreground">Management</p><Badge variant="secondary" className="font-mono">{categoryCounts['Management'] || 0}</Badge></div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start gap-2 font-normal"><Lightbulb size={16} className="text-muted-foreground" /> AI Task Suggestions</Button>
                                <Button variant="outline" className="w-full justify-start gap-2 font-normal"><Zap size={16} className="text-muted-foreground" /> Focus Mode</Button>
                                <Button variant="outline" className="w-full justify-start gap-2 font-normal"><BarChart3 size={16} className="text-muted-foreground" /> Productivity Report</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="intentions"><Card><CardContent className="p-8"><p className="text-center text-muted-foreground">Daily Intentions coming soon.</p></CardContent></Card></TabsContent>
            <TabsContent value="calendar"><Card><CardContent className="p-8"><p className="text-center text-muted-foreground">Calendar coming soon.</p></CardContent></Card></TabsContent>
            <TabsContent value="progress"><Card><CardContent className="p-8"><p className="text-center text-muted-foreground">Progress tracking coming soon.</p></CardContent></Card></TabsContent>
        </Tabs>
    </div>
  )
}
