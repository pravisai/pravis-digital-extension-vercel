
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
  Home,
  User,
  Volume2,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

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
    <div className="h-full w-full flex flex-col text-foreground bg-background rounded-lg border border-border/20 shadow-lg">
      <div className="flex-1 grid grid-cols-[240px_350px_1fr] overflow-hidden">
        <div className="bg-card/30 border-r border-border/20 p-3 flex flex-col gap-4">
          <div className="px-2">
            <Button className="w-full h-12 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <PenSquare className="mr-2" />
              Compose
            </Button>
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 px-3 h-10 text-sm',
                  link.name === 'Inbox' && 'bg-accent/50 text-accent-foreground'
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
                {link.count && <span className="ml-auto bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{link.count}</span>}
              </Button>
            ))}
          </nav>
          <Separator className="bg-border/20"/>
          <div className="px-3 text-xs font-semibold uppercase text-muted-foreground">Categories</div>
          <nav className="flex flex-col gap-1">
            {categories.map((cat) => (
              <Button key={cat.name} variant="ghost" className="w-full justify-start gap-3 px-3 h-10 text-sm">
                <cat.icon className={cn('w-5 h-5', cat.color)} />
                {cat.name}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col border-r border-border/20">
          <div className="p-3 border-b border-border/20">
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="bg-accent/50">All</Button>
              <Button variant="ghost">Unread</Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-9 bg-input/50 border-border/30" />
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {mockEmails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={cn(
                    'flex flex-col gap-1 p-4 border-b border-border/20 text-left hover:bg-accent/30 focus:bg-accent/40 outline-none',
                    selectedEmail?.id === email.id && 'bg-teal-900/40 hover:bg-teal-900/50',
                    !email.read && 'font-bold'
                  )}
                >
                  <h3 className="text-sm">{email.sender}</h3>
                  <h4 className="text-sm">{email.subject}</h4>
                  <p className={cn('text-xs truncate', selectedEmail?.id === email.id ? 'text-teal-300' : 'text-muted-foreground')}>
                    {email.body}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col bg-card/10">
          {selectedEmail ? (
            <>
              <div className="p-4 flex justify-between items-center border-b border-border/20">
                <div className="flex items-center gap-3">
                   <Avatar>
                    <AvatarFallback>{selectedEmail.sender.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{selectedEmail.sender}</h2>
                    <p className="text-xs text-muted-foreground">{selectedEmail.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                   <p className="text-xs">{selectedEmail.date}</p>
                   <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon"><Clock className="h-4 w-4" /></Button>
                   <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>
              <ScrollArea className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6">{selectedEmail.subject}</h1>
                <p className="text-base whitespace-pre-wrap leading-relaxed">
                  {selectedEmail.body}
                </p>
              </ScrollArea>
              <div className="p-4 border-t border-border/20 bg-card/50">
                <div className="flex items-center gap-2 mb-4">
                  <Button variant="outline"><Reply className="mr-2 h-4 w-4" /> Reply</Button>
                  <Button variant="outline"><ReplyAll className="mr-2 h-4 w-4" /> Reply All</Button>
                  <Button variant="outline"><Forward className="mr-2 h-4 w-4" /> Forward</Button>
                </div>
                <div className="border rounded-lg p-4 bg-background/50 border-border/30">
                    <div className="flex items-center gap-2 font-semibold mb-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"></path>
                            <path d="M12 17.5c-3.03 0-5.5-2.47-5.5-5.5S8.97 6.5 12 6.5s5.5 2.47 5.5 5.5-2.47 5.5-5.5 5.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z" fill="currentColor"></path>
                        </svg>
                        Pravis Summary
                    </div>
                    <p className="text-sm text-muted-foreground">Could not generate summary for this email.</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Select an email to read</p>
            </div>
          )}
        </div>
      </div>
      
       <div className="flex items-center justify-between p-2 border-t border-border/20 bg-card/30">
          <div className="flex items-center">
              <Button variant="ghost" size="sm" className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 font-bold h-auto px-3 py-1.5">
                  N 
                  <span className="font-normal mx-2">1 Issue</span>
                   &times;
              </Button>
          </div>
          <div className="flex items-center absolute left-1/2 -translate-x-1/2">
              <Button variant="ghost" className="flex-col h-auto p-1 gap-1 text-muted-foreground hover:text-foreground">
                  <Home className="h-5 w-5"/>
                  <span className="text-xs">Home</span>
              </Button>
               <Button variant="ghost" className="relative h-20 w-20">
                 <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-40 -z-10"></div>
                 <div className="relative bg-primary text-primary-foreground rounded-full p-4 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
                        <path d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                    </svg>
                 </div>
              </Button>
              <Button variant="ghost" className="flex-col h-auto p-1 gap-1 text-muted-foreground hover:text-foreground">
                  <User className="h-5 w-5"/>
                  <span className="text-xs">Profile</span>
              </Button>
          </div>
           <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Volume2 className="h-5 w-5"/>
           </Button>
      </div>

    </div>
  )
}
