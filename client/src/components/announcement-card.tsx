import { Announcement } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { Pin } from "lucide-react";

export default function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  return (
    <Card className={announcement.isPinned ? "border-primary" : undefined}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">{announcement.title}</h3>
          {announcement.isPinned && (
            <Pin className="h-4 w-4 text-primary" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Posted on {format(new Date(announcement.createdAt), "PPP")}
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm">{announcement.content}</p>
      </CardContent>
    </Card>
  );
}
