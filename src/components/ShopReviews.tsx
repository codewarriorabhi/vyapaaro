import { useState, useEffect, useCallback } from "react";
import { Star, MessageSquare, Trash2, Pencil, Loader2, Store } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ReviewForm from "./ReviewForm";

interface Review {
  id: string;
  shop_id: string;
  user_id: string;
  rating: number;
  comment: string;
  owner_reply: string | null;
  owner_reply_at: string | null;
  created_at: string;
  profile?: { first_name: string; surname: string; avatar_url: string | null };
}

interface ShopReviewsProps {
  shopId: string;
  isOwner?: boolean;
}

const ShopReviews = ({ shopId, isOwner = false }: ShopReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [editing, setEditing] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);

      // Fetch reviews
      const { data: reviewData } = await supabase
        .from("shop_reviews")
        .select("*")
        .eq("shop_id", shopId)
        .order("created_at", { ascending: false });

      const reviewList = (reviewData || []) as Review[];

      // Fetch profiles for reviewers
      const userIds = [...new Set(reviewList.map((r) => r.user_id))];
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, first_name, surname, avatar_url")
          .in("user_id", userIds);

        const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));
        reviewList.forEach((r) => {
          const p = profileMap.get(r.user_id);
          if (p) r.profile = p as any;
        });
      }

      setReviews(reviewList);

      // Find current user's review
      if (session?.user?.id) {
        const mine = reviewList.find((r) => r.user_id === session.user.id);
        setUserReview(mine || null);
      }

      // Get average
      const { data: ratingData } = await supabase.rpc("get_shop_rating", { _shop_id: shopId });
      if (ratingData && Array.isArray(ratingData) && ratingData.length > 0) {
        setAvgRating(Number(ratingData[0].avg_rating) || 0);
        setReviewCount(Number(ratingData[0].review_count) || 0);
      }
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete your review?")) return;
    const { error } = await supabase.from("shop_reviews").delete().eq("id", reviewId);
    if (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
    } else {
      toast({ title: "Review deleted" });
      setUserReview(null);
      setEditing(false);
      fetchReviews();
    }
  };

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    setReplySubmitting(true);
    const { error } = await supabase
      .from("shop_reviews")
      .update({ owner_reply: replyText.trim(), owner_reply_at: new Date().toISOString() })
      .eq("id", reviewId);
    setReplySubmitting(false);
    if (error) {
      toast({ title: "Failed to reply", variant: "destructive" });
    } else {
      toast({ title: "Reply posted" });
      setReplyingTo(null);
      setReplyText("");
      fetchReviews();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card">
        <div className="text-center">
          <p className="text-3xl font-extrabold text-primary">{avgRating}</p>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(avgRating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</p>
        </div>

        {/* Rating distribution */}
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-muted-foreground">{star}</span>
                <Star className="h-3 w-3 fill-primary text-primary" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-6 text-right text-muted-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Form */}
      {userId && !isOwner && (
        userReview && !editing ? (
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">Your Review</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(true)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(userReview.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= userReview.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{userReview.comment}</p>
          </div>
        ) : (
          <ReviewForm
            shopId={shopId}
            existingReview={editing && userReview ? { id: userReview.id, rating: userReview.rating, comment: userReview.comment } : null}
            onSubmitted={() => { setEditing(false); fetchReviews(); }}
          />
        )
      )}

      {!userId && (
        <div className="bg-card rounded-xl p-4 shadow-card text-center">
          <p className="text-sm text-muted-foreground">Log in to leave a review</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.filter((r) => r.user_id !== userId).map((review) => (
          <div key={review.id} className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {review.profile?.avatar_url && <AvatarImage src={review.profile.avatar_url} />}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {(review.profile?.first_name?.[0] || "?").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {review.profile ? `${review.profile.first_name} ${review.profile.surname}` : "Anonymous"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>

            {/* Owner Reply */}
            {review.owner_reply && (
              <div className="mt-3 ml-4 pl-3 border-l-2 border-primary/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <Store className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-primary">Shop Owner</span>
                  {review.owner_reply_at && (
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(review.owner_reply_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{review.owner_reply}</p>
              </div>
            )}

            {/* Owner Reply Button */}
            {isOwner && !review.owner_reply && (
              replyingTo === review.id ? (
                <div className="mt-3 space-y-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    maxLength={500}
                    className="min-h-[60px] resize-none text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleReply(review.id)} disabled={replySubmitting}>
                      {replySubmitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}Reply
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setReplyingTo(null); setReplyText(""); }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="ghost" className="mt-2 gap-1 text-xs" onClick={() => setReplyingTo(review.id)}>
                  <MessageSquare className="h-3 w-3" /> Reply
                </Button>
              )
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopReviews;
