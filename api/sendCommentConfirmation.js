import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email, confirmationCode } = req.body;
  if (!email || !confirmationCode)
    return res.status(400).json({ message: "Missing fields" });

  await resend.emails.send({
    from: "The Crumby Baker <no-reply@thecrumbybaker.com>",
    to: email,
    subject: "Confirm your comment",
    html: `<p>Please click <a href="https://thecrumbybaker.com/api/confirmComment?code=${confirmationCode}">here</a> to confirm your comment.</p>`,
  });

  return res.status(200).json({ message: "Email sent" });
}
