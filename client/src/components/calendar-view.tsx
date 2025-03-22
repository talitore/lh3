import { Event } from "@shared/schema";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function CalendarView({ events }: { events: Event[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const eventsOnSelectedDate = selectedDate
    ? events.filter(
        (event) =>
          format(new Date(event.startTime), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd"),
      )
    : [];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
      />
      
      <div className="flex-1">
        <h3 className="font-medium mb-4">
          Events on {selectedDate && format(selectedDate, "MMMM d, yyyy")}
        </h3>
        
        <div className="space-y-2">
          {eventsOnSelectedDate.map((event) => (
            <Card
              key={event.id}
              className="cursor-pointer hover:bg-accent"
              onClick={() => setSelectedEvent(event)}
            >
              <CardContent className="p-4">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(event.startTime), "h:mm a")} -{" "}
                  {format(new Date(event.endTime), "h:mm a")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {event.location}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {eventsOnSelectedDate.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No events scheduled
            </p>
          )}
        </div>
      </div>

      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

function EventDetailsDialog({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) {
  const { user } = useAuth();

  const rsvpMutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await apiRequest("POST", `/api/events/${event.id}/rsvp`, {
        status,
        guestCount: 0,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      onClose();
    },
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>{event.description}</p>
          
          <div className="text-sm">
            <div>
              <span className="font-medium">When: </span>
              {format(new Date(event.startTime), "PPP p")} -{" "}
              {format(new Date(event.endTime), "p")}
            </div>
            <div>
              <span className="font-medium">Where: </span>
              {event.location}
            </div>
            {event.fee && (
              <div>
                <span className="font-medium">Fee: </span>${event.fee}
              </div>
            )}
          </div>

          {user && (
            <div className="flex gap-2">
              <Button
                onClick={() => rsvpMutation.mutate("yes")}
                disabled={rsvpMutation.isPending}
              >
                Going
              </Button>
              <Button
                variant="outline"
                onClick={() => rsvpMutation.mutate("maybe")}
                disabled={rsvpMutation.isPending}
              >
                Maybe
              </Button>
              <Button
                variant="outline"
                onClick={() => rsvpMutation.mutate("no")}
                disabled={rsvpMutation.isPending}
              >
                Can't Go
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
