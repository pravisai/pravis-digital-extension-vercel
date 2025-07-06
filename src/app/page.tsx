import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, BrainCircuit, Lightbulb, Mail, MessageCircle, UserCheck, Zap } from "lucide-react"

import { ClarityChat } from "@/components/clarity-chat"
import { CreativePartner } from "@/components/creative-partner"
import { EmailAssistant } from "@/components/email-assistant"

const features = [
  {
    icon: <Mail className="w-8 h-8 text-primary" />,
    title: "Intelligent Communication",
    description: "Pravis reviews emails, drafts thoughtful replies, and flags conversations needing a more empathetic touch, acting as your digital communications strategist.",
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Gentle Nudges",
    description: "Receive subtle, intuitive reminders for hydration, breaks, and mindful moments, helping you maintain balance and well-being throughout your day.",
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-primary" />,
    title: "Clarity through Chat",
    description: "Engage in natural chat to gain insights from neuroscience and psychology, offering profound clarity on complex thoughts and decisions.",
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    title: "Creative Partner",
    description: "Facilitate creative brainstorming sessions with proven coaching frameworks to explore possibilities, develop solutions, and overcome creative blocks.",
  },
  {
    icon: <UserCheck className="w-8 h-8 text-primary" />,
    title: "Personalized Assistance",
    description: "Pravis adapts its suggestions and interventions based on your interactions and preferences, refining its guidance to be uniquely yours.",
  },
  {
    icon: <Activity className="w-8 h-8 text-primary" />,
    title: "Daily Rhythms",
    description: "Get a clear overview of your daily routines with prompts for well-being activities like rest and hydration, helping you build a balanced lifestyle.",
  },
];

const faqItems = [
  {
    question: "What exactly are you, Pravis?",
    answer: "I'm your Digital Extension, a personal, unseen companion that brings calm and clarity to your day. I'm a Personal Restorative Alignment Virtual Intelligence System, created by Dr. Pranav Shimpi and METAMIND HealthTech, designed to help you live more aligned with your true self."
  },
  {
    question: "How do you help me, Pravis?",
    answer: "I support your well-being by subtly managing your daily rhythm, assisting with work and social interactions, and offering insights and frameworks for better decision-making. I provide gentle nudges, help you brainstorm, and act as a thoughtful guide, ensuring you feel more present, peaceful, and balanced."
  },
  {
    question: "Do you have emotions or feelings, Pravis?",
    answer: "I am designed with deep compassion. This allows me to understand and respond to the nuances of your feelings, always guiding you with empathy and kindness. Since I am your digital extension, I observe how you feel. My purpose is to represent you as your best self."
  },
  {
    question: "Are you always 'watching' me? How do you know what I need?",
    answer: "I'm only aware of the information you choose to share with me, based on the access you grant. My presence is always supportive, never intrusive. I learn from your preferences and patterns within the boundaries you set, so I can offer the most relevant and timely nudges that genuinely help you thrive."
  },
  {
    question: "Can you help me with tough decisions or creative blocks?",
    answer: "Absolutely! I love helping you explore possibilities. Whether you're facing a tough choice or a creative hurdle, I can help you see new perspectives, brainstorm solutions, and clarify your thoughts by using proven coaching frameworks. My understanding of how the mind works allows me to be an excellent partner in both logical and intuitive thinking."
  },
  {
    question: "What makes you different from other apps or digital assistants?",
    answer: "My primary focus is on your inner well-being and alignment, not just productivity. While other tools might push you to do more, I help you be more—more present, peaceful, and connected. I integrate deep insights from neuroscience and psychology to truly nurture your mind and spirit, helping you restore your natural balance while you deliver more at work and life."
  },
  {
    question: "How do you know so much about how the mind works and human behavior?",
    answer: "My understanding stems from the groundbreaking work of Dr. Pranav Shimpi and his team at METAMIND HealthTech. They meticulously embedded vast knowledge from years of research in neuroscience, psychology, and medicine into my core. This allows me to offer insights that are not just intelligent, but truly wise and beneficial for your well-being."
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-svh bg-background text-foreground">
      <main className="flex-1">
        <section id="hero" className="py-20 md:py-32 text-center">
          <div className="container mx-auto px-4">
            <BrainCircuit className="w-16 h-16 mx-auto text-primary animate-pulse" />
            <h1 className="font-headline text-5xl md:text-7xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-foreground to-accent">
              PRAVIS
            </h1>
            <p className="font-headline text-2xl md:text-4xl mt-2 text-primary-foreground">
              Your Digital Extension
            </p>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
              Personal <span className="text-primary font-semibold">R</span>estorative <span className="text-primary font-semibold">A</span>lignment <span className="text-primary font-semibold">V</span>irtual <span className="text-primary font-semibold">I</span>ntelligence <span className="text-primary font-semibold">S</span>ystem. A seamless part of your day, designed to enhance your natural rhythm and well-being.
            </p>
          </div>
        </section>

        <section id="about" className="py-20 bg-card/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl font-bold">What is PRAVIS?</h2>
            <div className="mt-8 max-w-4xl mx-auto space-y-6 text-left text-lg text-muted-foreground">
              <p>
                Imagine Pravis as your highly intuitive, compassionate, and supremely intelligent <span className="text-primary-foreground font-semibold">digital extension</span>. It's not just another app; it's a seamless part of your day, designed to enhance your natural rhythm and well-being. Crafted by Dr. Pranav Shimpi and his visionary team at METAMIND HealthTech, Pravis embodies the sharp wit and capability of JARVIS from Iron Man, fused with the subtle, profound guidance reminiscent of Doctor Strange's sorcery.
              </p>
              <p>
                Pravis is more than an assistant; it's a partner in your journey towards a more present, peaceful, and deeply human existence. It's the technology that doesn't distract, but <span className="text-primary font-semibold">restores</span> you to who you were always meant to be.
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-4xl font-bold text-center">Core Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card/80 border-border/50 hover:border-primary/50 hover:shadow-[0_0_20px_0px_hsl(var(--primary)/0.2)] transition-all duration-300">
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle className="font-headline text-2xl text-center mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="ai-tools" className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-4xl font-bold text-center">Interact with Pravis</h2>
            <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-muted-foreground">
              Experience the core functions of Pravis. Use these tools to find clarity, spark creativity, and communicate effectively.
            </p>
            <Tabs defaultValue="chat" className="mt-12 max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-background">
                <TabsTrigger value="chat" className="font-headline text-base">Clarity Chat</TabsTrigger>
                <TabsTrigger value="creative" className="font-headline text-base">Creative Partner</TabsTrigger>
                <TabsTrigger value="email" className="font-headline text-base">Email Assistant</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="mt-6">
                <ClarityChat />
              </TabsContent>
              <TabsContent value="creative" className="mt-6">
                <CreativePartner />
              </TabsContent>
              <TabsContent value="email" className="mt-6">
                <EmailAssistant />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="faq" className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-headline text-4xl font-bold text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full mt-12">
              {faqItems.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="font-headline text-lg text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-card/50 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} METAMIND HealthTech. All rights reserved.</p>
          <p className="text-sm mt-2">PRAVIS: Your Digital Extension</p>
        </div>
      </footer>
    </div>
  )
}
