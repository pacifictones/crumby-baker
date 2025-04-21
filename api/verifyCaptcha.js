import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    // Respond with 200 so the browser’s CORS pre‑flight succeeds.
    // You can also add CORS headers here if you ever serve from a different origin.
    return res.status(200).end();
  }

  if (req.method !== "POST")
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });

  const { token, name, email, message } = req.body;
  if (!token)
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });

  /* ── 1. Verify reCAPTCHA ─────────────────────────────────── */
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verifyRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    }
  );
  const verifyData = await verifyRes.json();
  if (!verifyData.success || (verifyData.score && verifyData.score < 0.5)) {
    return res
      .status(400)
      .json({ success: false, message: "reCAPTCHA failed" });
  }

  /* ── 2. Send e‑mail via Resend ───────────────────────────── */
  const toAddress = process.env.CONTACT_RECIPIENT || "me@thecrumbybaker.com";

  try {
    await resend.emails.send({
      from: "The Crumby Baker <no-reply@thecrumbybaker.com>",
      to: [toAddress],
      subject: "New message from contact form",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Email send error" });
  }
}
