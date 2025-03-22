import { useQuery } from "@tanstack/react-query";
import { Event, RSVP } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users } from "lucide-react";

export default function EventPage() {
  const { user } = useAuth();
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const eventsByDate = events?.reduce((acc, event) => {
    const date = format(new Date(event.startTime), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Upcoming Events</h1>
          {user?.isAdmin && (
            <Button variant="default" size="lg">
              Create Event
            </Button>
          )}
        </div>

        <div className="space-y-8">
          {eventsByDate &&
            Object.entries(eventsByDate)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, eventsOnDate]) => (
                <div key={date}>
                  <h2 className="text-xl font-semibold mb-4">
                    {format(new Date(date), "EEEE, MMMM d, yyyy")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {eventsOnDate.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              ))}

          {(!events || events.length === 0) && (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  No upcoming events scheduled
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const { data: rsvps } = useQuery<RSVP[]>({
    queryKey: [`/api/events/${event.id}/rsvps`],
  });

  const confirmedAttendees = rsvps?.filter((rsvp) => rsvp.status === "yes").length || 0;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <div className="space-y-3">
          <div className="flex items-center text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>
              {format(new Date(event.startTime), "h:mm a")} -{" "}
              {format(new Date(event.endTime), "h:mm a")}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{confirmedAttendees} attending</span>
          </div>
          {event.fee && (
            <div className="text-sm font-medium">
              Fee: ${event.fee}
            </div>
          )}
        </div>
        <div className="mt-4">
          <Button className="w-full">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}
