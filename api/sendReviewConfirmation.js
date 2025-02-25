import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  console.log("⚠️ [sendReviewConfirmation] API route called!");
  console.log("⚠️ [sendReviewConfirmation] Request body:", req.body);
  console.log(
    "⚠️ [sendReviewConfirmation] Resend API Key loaded?",
    !!process.env.RESEND_API_KEY
  );

  if (req.method != "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { reviewId, email, confirmationCode } = req.body;

    if (!email || !confirmationCode) {
      return res
        .status(400)
        .json({ message: "Missing email or confirmation code" });
    }

    // Send confirmation email
    await resend.emails.send({
      from: "The Crumby Baker <no-reply@crumby-baker.vercel.app>",
      to: email,
      subject: "Confirm Your Review",
      html: `<p>Click <a href="https://crumby-baker.vercel.app/api/confirmReview?code=${confirmationCode}">here</a> to confirm your review.</p>`,
    });

    return res.status(200).json({ message: "Confirmation email sent" });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ message: "Error sending email" });
  }
}
