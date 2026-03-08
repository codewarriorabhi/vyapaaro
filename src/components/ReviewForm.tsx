import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ReviewFormProps {
  shopId: string;
  onSubmitted: () => void;
  existingReview?: { id: string; rating: number; comment: string } | null;
}

const ReviewForm = ({ shopId, onSubmitted, existingReview }: ReviewFormProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    if (comment.trim().length < 3) {
      toast({ title: "Please write a review (min 3 characters)", variant: "destructive" });
      return;
    }
    if (comment.length > 1000) {
      toast({ title: "Review too long (max 1000 characters)", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({ title: "Please log in to leave a review", variant: "destructive" });
        return;
      }

      if (existingReview) {
        const { error } = await supabase
          .from("shop_reviews")
          .update({ rating, comment: comment.trim() })
          .eq("id", existingReview.id);
        if (error) throw error;
        toast({ title: "Review updated!" });
      } else {
        const { error } = await supabase
          .from("shop_reviews")
          .insert({ shop_id: shopId, user_id: session.user.id, rating, comment: comment.trim() });
        if (error) {
          if (error.code === "23505") {
            toast({ title: "You've already reviewed this shop", description: "Edit your existing review instead.", variant: "destructive" });
          } else throw error;
          return;
        }
        toast({ title: "Review submitted!" });
      }
      onSubmitted();
    } catch (err: any) {
      toast({ title: "Failed to submit review", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-card space-y-3">
      <h3 className="text-sm font-bold">{existingReview ? "Edit Your Review" : "Write a Review"}</h3>

      {/* Star Rating */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                star <= (hoverRating || rating)
                  ? "fill-primary text-primary"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-sm text-muted-foreground ml-2 self-center">
            {rating === 1 ? "Poor" : rating === 2 ? "Fair" : rating === 3 ? "Good" : rating === 4 ? "Very Good" : "Excellent"}
          </span>
        )}
      </div>

      {/* Comment */}
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this shop..."
        maxLength={1000}
        className="min-h-[80px] resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{comment.length}/1000</span>
        <Button onClick={handleSubmit} disabled={submitting} size="sm">
          {submitting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Submitting...</> : existingReview ? "Update Review" : "Submit Review"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
