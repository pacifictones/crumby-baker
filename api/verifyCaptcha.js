export default async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  //Access the secret key from environment variables
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  //Verify the reCAPTCHA token with Google's API
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "CAPTCHA verification failed" });
    }
  } catch (error) {
    console.error("Error verifying CAPTCHA:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
