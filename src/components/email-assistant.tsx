
"use client"

import React, { useState } from 'react'
import {
  Archive,
  FileText,
  Inbox,
  PenSquare,
  Search,
  Send,
  Star,
  Trash2,
  Users,
  Tag,
  Clock,
  MoreVertical,
  Reply,
  ReplyAll,
  Forward,
  ArrowLeft,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'


const mockEmails = [
  {
    id: 1,
    sender: 'Olivia Martin',
    email: 'olivia.martin@example.com',
    subject: 'Dinner Invitation',
    body: 'Hey, are you free for dinner this Friday? I was thinking we could try that new Italian place downtown. Let me know what you think!',
    date: '7/6/2025, 4:07:37 PM',
    read: false,
  },
  {
    id: 2,
    sender: 'John Doe',
    subject: 'Project Update: Q3 Report',
    body: "Hi team, please find the attached Q3 report. We've made great progress and I'd like to share the highlights with you all.",
    date: '7/6/2025, 2:15:11 PM',
    read: true,
  },
  {
    id: 3,
    sender: 'Acme Inc.',
    subject: 'Your Weekly Digest is here!',
    body: 'Catch up on the latest news, articles, and updates from our blog. This week, we cover the future of AI in business.',
    date: '7/6/2025, 11:30:45 AM',
    read: true,
  },
  {
    id: 4,
    sender: 'Sophia Davis',
    subject: 'Re: Quick question',
    body: 'Thanks for getting back to me so quickly! That answers everything. I appreciate your help.',
    date: '7/5/2025, 5:55:02 PM',
    read: false,
  },
  {
    id: 5,
    sender: 'Design Weekly',
    subject: 'Inspiration for your next project',
    body: 'Discover the latest trends in UI/UX, amazing color palettes, and get inspired for your next design project.',
    date: '7/5/2025, 9:00:00 AM',
    read: true,
  },
  {
    id: 6,
    sender: 'Liam Harris',
    subject: 'Brainstorming session for new feature',
    body: "Let's schedule a meeting for next week to brainstorm ideas for the new feature. Please let me know your availability.",
    date: '7/4/2025, 3:20:00 PM',
    read: false,
  },
]

type Email = (typeof mockEmails)[0]

const navLinks = [
  { name: 'Inbox', icon: Inbox, count: 3 },
  { name: 'Starred', icon: Star },
  { name: 'Sent', icon: Send },
  { name: 'Drafts', icon: FileText },
  { name: 'Trash', icon: Trash2 },
  { name: 'Archived', icon: Archive },
]

const categories = [
  { name: 'Social', icon: Users, color: 'text-rose-400' },
  { name: 'Promotions', icon: Tag, color: 'text-rose-400' },
]

export function EmailAssistant() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(mockEmails[0])

  return (
    <TooltipProvider>
      <div className="h-full w-full flex flex-col text-foreground bg-background">
        <div className="flex-1 flex md:grid md:grid-cols-[240px_400px_1fr] overflow-hidden">
          <div className="bg-background border-r border-border/50 p-4 hidden md:flex flex-col gap-4">
            <div className="px-2">
              <Button variant="secondary" className="w-full h-11">
                <PenSquare className="mr-2" />
                Compose
              </Button>
            </div>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  variant={link.name === 'Inbox' ? "secondary" : "ghost"}
                  className='w-full justify-start gap-3 px-3 h-10 text-base'
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                  {link.count && <span className="ml-auto bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{link.count}</span>}
                </Button>
              ))}
            </nav>
            <Separator className="bg-border/50"/>
            <div className="px-3 text-sm font-semibold uppercase text-muted-foreground">Categories</div>
            <nav className="flex flex-col gap-1">
              {categories.map((cat) => (
                <Button key={cat.name} variant="ghost" className="w-full justify-start gap-3 px-3 h-10 text-base">
                  <cat.icon className={cn('w-5 h-5', cat.color)} />
                  {cat.name}
                </Button>
              ))}
            </nav>
          </div>

          <div className={cn("flex flex-col border-r border-border/50 w-full md:w-auto", selectedEmail && "hidden md:flex")}>
            <div className="p-4 border-b border-border/50">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-10 bg-muted/50 border-border/50 h-11" />
                </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="flex flex-col">
                {mockEmails.map((email) => (
                  <button
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={cn(
                      'flex flex-col gap-1.5 p-4 border-b border-border/20 text-left hover:bg-accent focus:bg-accent outline-none transition-colors',
                      selectedEmail?.id === email.id && 'bg-accent',
                      !email.read && 'bg-primary/5',
                    )}
                  >
                    <h3 className={cn("text-base font-semibold", !email.read && "text-primary-foreground/90")}>{email.sender}</h3>
                    <h4 className={cn("text-sm font-medium", !email.read && "text-primary-foreground/80")}>{email.subject}</h4>
                    <p className='text-sm text-muted-foreground truncate'>
                      {email.body}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className={cn("flex flex-col bg-background flex-1", !selectedEmail && "hidden md:flex")}>
            {selectedEmail ? (
              <>
                <div className="p-4 flex justify-between items-center border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedEmail(null)}>
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="text-lg">{selectedEmail.sender.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-lg">{selectedEmail.sender}</h2>
                      <p className="text-sm text-muted-foreground">{selectedEmail.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <p className="text-sm mr-2">{selectedEmail.date}</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <Button variant="ghost" size="icon"><Trash2 className="h-5 w-5" /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                     <Tooltip>
                      <TooltipTrigger asChild>
                         <Button variant="ghost" size="icon"><Clock className="h-5 w-5" /></Button>
                      </TooltipTrigger>
                      <TooltipContent>Snooze</TooltipContent>
                    </Tooltip>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                        <DropdownMenuItem>Star this message</DropdownMenuItem>
                        <DropdownMenuItem>Add to tasks</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-6">
                  <h1 className="text-2xl font-bold mb-6">{selectedEmail.subject}</h1>
                  <p className="text-base whitespace-pre-wrap leading-7">
                    {selectedEmail.body}
                  </p>
                </ScrollArea>
                <div className="p-6 border-t border-border/50 bg-background space-y-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline"><Reply className="mr-2 h-4 w-4" /> Reply</Button>
                    <Button variant="outline"><ReplyAll className="mr-2 h-4 w-4" /> Reply All</Button>
                    <Button variant="outline"><Forward className="mr-2 h-4 w-4" /> Forward</Button>
                  </div>
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"></path>
                          <path d="M12 17.5c-3.03 0-5.5-2.47-5.5-5.5S8.97 6.5 12 6.5s5.5 2.47 5.5 5.5-2.47 5.5-5.5 5.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z" fill="currentColor"></path>
                      </svg>
                      <CardTitle className="text-base font-semibold">Pravis Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Could not generate summary for this email.</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="flex-1 flex-col items-center justify-center text-muted-foreground hidden md:flex">
                <Inbox className="h-16 w-16 mb-4 text-muted-foreground/50"/>
                <p className="text-lg">Select an email to read</p>
                <p className="text-sm text-muted-foreground">Nothing to see here yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
