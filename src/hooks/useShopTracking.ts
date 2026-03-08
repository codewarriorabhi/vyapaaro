import { supabase } from "@/integrations/supabase/client";

type EventType = "view" | "click" | "inquiry" | "call" | "whatsapp" | "share";

export async function trackShopEvent(shopId: string, eventType: EventType) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from("shop_events").insert({
      shop_id: shopId,
      event_type: eventType,
      user_id: session?.user?.id || null,
    });
  } catch (err) {
    console.error("Failed to track event:", err);
  }
}
