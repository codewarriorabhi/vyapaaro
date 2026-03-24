/// <reference lib="deno.ns" />
import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// In-memory OTP store (for production, use a database table)
// For now we store OTPs in a simple KV approach via Supabase
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, destination } = await req.json();

    if (!type || !destination) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

    // Store OTP in database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Upsert OTP record
    await supabaseAdmin.from("otp_codes").upsert(
      { destination, code: otp, type, expires_at: expiresAt, verified: false },
      { onConflict: "destination,type" }
    );

    if (type === "email") {
      // Send email via Resend API
      try {
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (resendApiKey) {
          await fetch("https://api.resend.com/emails/queue", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Vyapaaro <onboarding@resend.dev>",
              to: destination,
              subject: "Your Vyapaaro OTP Code",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #333;">Your OTP Code</h2>
                  <p>Your verification code is:</p>
                  <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; border-radius: 8px;">
                    ${otp}
                  </div>
                  <p style="color: #666; font-size: 14px; margin-top: 20px;">
                    This code expires in 10 minutes. If you didn't request this code, please ignore this email.
                  </p>
                </div>
              `,
              text: `Your Vyapaaro OTP code is: ${otp}. This code expires in 10 minutes.`
            }),
          });
        } else {
          console.log(`[EMAIL OTP - NO RESEND KEY] ${destination}: ${otp}`);
        }
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        console.log(`[EMAIL OTP - FALLBACK] ${destination}: ${otp}`);
      }
    } else if (type === "phone") {
      // Send SMS via Twilio
      const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
      const twilioToken = Deno.env.get("TWILIO_AUTH_TOKEN");
      const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER");

      if (twilioSid && twilioToken && twilioPhone) {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
        const body = new URLSearchParams({
          To: destination,
          From: twilioPhone,
          Body: `Your Vyapaaro verification code is: ${otp}. Valid for 10 minutes.`,
        });

        await fetch(twilioUrl, {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa(`${twilioSid}:${twilioToken}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });
      } else {
        console.log(`[SMS OTP] ${destination}: ${otp}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-otp error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
