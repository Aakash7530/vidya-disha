import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const FROM_NAME = "Vidya Disha";
const FROM_EMAIL = "vidyadisha01@gmail.com";

function encodeRFC2822(to: string, subject: string, htmlBody: string, textBody: string): string {
  const boundary = "boundary_" + Math.random().toString(36).slice(2);
  const message = [
    `From: ${FROM_NAME} <${FROM_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    textBody,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlBody,
    ``,
    `--${boundary}--`,
  ].join("\r\n");

  // base64url encode
  const bytes = new TextEncoder().encode(message);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GMAIL_KEY = Deno.env.get("GOOGLE_MAIL_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY || !GMAIL_KEY) throw new Error("Email service not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Verify caller is admin
    const supaUser = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "", {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await supaUser.auth.getUser();
    if (!userData?.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supaAdmin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roleCheck } = await supaAdmin.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
    if (!roleCheck) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { contactId, reply } = await req.json();
    if (!contactId || !reply?.trim()) {
      return new Response(JSON.stringify({ error: "Missing contactId or reply" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: contact, error: cErr } = await supaAdmin.from("contacts").select("*").eq("id", contactId).single();
    if (cErr || !contact) throw new Error("Contact not found");

    const subject = `Re: Your message to Vidya Disha`;
    const text = `Hi ${contact.name},\n\n${reply}\n\n— Vidya Disha Team\nvidyadisha01@gmail.com\n\n---\nYour original message:\n${contact.message}`;
    const html = `<div style="font-family:Arial,sans-serif;max-width:600px;color:#222;line-height:1.6">
      <p>Hi ${contact.name.replace(/</g, "&lt;")},</p>
      <p>${reply.replace(/</g, "&lt;").replace(/\n/g, "<br>")}</p>
      <p style="margin-top:24px">— Vidya Disha Team<br><a href="mailto:vidyadisha01@gmail.com">vidyadisha01@gmail.com</a></p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
      <p style="color:#888;font-size:13px"><strong>Your original message:</strong><br>${contact.message.replace(/</g, "&lt;").replace(/\n/g, "<br>")}</p>
    </div>`;

    const raw = encodeRFC2822(contact.email, subject, html, text);

    const gmailRes = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GMAIL_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });

    if (!gmailRes.ok) {
      const err = await gmailRes.text();
      throw new Error(`Gmail send failed [${gmailRes.status}]: ${err}`);
    }

    await supaAdmin.from("contacts").update({
      admin_reply: reply,
      status: "resolved",
      replied_at: new Date().toISOString(),
    }).eq("id", contactId);

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("send-contact-reply error:", msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
