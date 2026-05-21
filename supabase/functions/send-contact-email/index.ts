import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const TO_EMAIL   = 'flyincloud2001@gmail.com';
const FROM_EMAIL = 'onboarding@resend.dev';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { name, email, message } = await req.json() as {
      name: string;
      email: string;
      message: string;
    };

    const html = `
<div style="font-family:sans-serif;max-width:600px;padding:20px;">
  <h2 style="color:#1e293b;margin-bottom:16px;">📩 個人網站聯絡表單</h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px;">
    <tr style="background:#f8fafc;">
      <td style="padding:10px 14px;color:#64748b;font-weight:600;width:80px;">姓名</td>
      <td style="padding:10px 14px;font-weight:600;">${name}</td>
    </tr>
    <tr>
      <td style="padding:10px 14px;color:#64748b;font-weight:600;">信箱</td>
      <td style="padding:10px 14px;"><a href="mailto:${email}">${email}</a></td>
    </tr>
    <tr style="background:#f8fafc;">
      <td style="padding:10px 14px;color:#64748b;font-weight:600;">訊息</td>
      <td style="padding:10px 14px;white-space:pre-wrap;">${message}</td>
    </tr>
  </table>
</div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: `[個人網站] 聯絡表單來信 — ${name}`,
        html,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(JSON.stringify({ error: err }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  } catch (e) {
    console.error('send-contact-email error:', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...cors },
    });
  }
});
