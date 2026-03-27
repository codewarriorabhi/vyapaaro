import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, destination } = await req.json();

    if (!type || !destination) {
      return new Response(
        JSON.stringify({ error: "type and destination are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Set expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Delete any existing unverified OTPs for this destination
    await supabaseAdmin
      .from("otp_codes")
      .delete()
      .eq("destination", destination)
      .eq("type", type)
      .eq("verified", false);

    // Store OTP in database
    const { error: dbError } = await supabaseAdmin
      .from("otp_codes")
      .insert({
        type,
        destination,
        code: otp,
        expires_at: expiresAt.toISOString(),
        verified: false,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to store OTP" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send OTP based on type
    if (type === "email") {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");

      if (!resendApiKey) {
        return new Response(
          JSON.stringify({ error: "RESEND_API_KEY not configured" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Sending OTP to ${destination}: ${otp}`);

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: destination,
          subject: "Your Vyapaaro Verification Code",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; text-align: center;">
              <h2 style="color: #f97316;">Vyapaaro</h2>
              <p>Your verification code is:</p>
              <h1 style="font-size: 36px; letter-spacing: 8px; color: #333; margin: 20px 0;">${otp}</h1>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        }),
      });

      console.log("Resend response status:", resendResponse.status);

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json();
        console.error("Resend error:", errorData);
        return new Response(
          JSON.stringify({ error: errorData.message || "Failed to send email" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const responseData = await resendResponse.json();
      console.log("Resend response:", responseData);
    } else if (type === "phone") {
      // For phone OTP, you would integrate with an SMS provider like Twilio
      // For now, we'll just log it for development purposes
      console.log(`SMS OTP to ${destination}: ${otp}`);
      
      // TODO: Integrate with SMS provider (Twilio, MessageBird, etc.)
      // Example:
      // const twilioResponse = await fetch('https://api.twilio.com/...', {...});
    }

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
