export default async (req, res) => {
  const { token } = req.body;

  //Access the secret key from environment variables
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  //Verify the reCAPTCHA token with Google's API
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "secret=${secretKey}&response=${token}",
    }
  );

  const data = await response.json();

  if (data.success) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
};
