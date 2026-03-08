import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Pencil, Trash2, Eye, Bell } from "lucide-react";

const ReviewsActivitySettings = () => {
  const [reviewNotifs, setReviewNotifs] = useState(true);
  const [reviewVisibility, setReviewVisibility] = useState(true);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Reviews & Activity</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your reviews and activity preferences</p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-1">
        <button
          onClick={() => toast({ title: "Coming soon", description: "Review editing will be available soon." })}
          className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Pencil className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Edit Your Reviews</p>
            <p className="text-xs text-muted-foreground">Modify reviews you've posted</p>
          </div>
        </button>

        <button
          onClick={() => toast({ title: "Coming soon", description: "Review deletion will be available soon." })}
          className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
            <Trash2 className="h-4 w-4 text-destructive" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Delete Reviews</p>
            <p className="text-xs text-muted-foreground">Remove reviews you've posted</p>
          </div>
        </button>
      </div>

      {/* Toggles */}
      <div className="space-y-1">
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <div>
              <Label htmlFor="review_visibility" className="font-medium cursor-pointer">Review Visibility</Label>
              <p className="text-xs text-muted-foreground">Make your reviews visible to others</p>
            </div>
          </div>
          <Switch id="review_visibility" checked={reviewVisibility} onCheckedChange={setReviewVisibility} />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div>
              <Label htmlFor="review_notifs" className="font-medium cursor-pointer">Review Notifications</Label>
              <p className="text-xs text-muted-foreground">Get notified about review activity</p>
            </div>
          </div>
          <Switch id="review_notifs" checked={reviewNotifs} onCheckedChange={setReviewNotifs} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => toast({ title: "Settings saved" })}>Save Changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
};

export default ReviewsActivitySettings;
