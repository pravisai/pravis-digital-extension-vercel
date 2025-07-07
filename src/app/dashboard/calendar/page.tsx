import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarPage() {
  return (
    <div className="flex justify-center items-start pt-10 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="items-center text-center">
            <CalendarIcon className="h-12 w-12 text-primary mb-4" />
          <CardTitle>Your Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Calendar
            mode="single"
            className="p-0 rounded-md border"
          />
          <p className="text-center text-muted-foreground mt-6">
            This is a placeholder for your calendar integration.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
