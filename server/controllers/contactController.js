// @desc   Submit concierge inquiry (no email provider required for demo)
// @route  POST /api/contact
const submitContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  const clean = {
    name: String(name || "").trim(),
    email: String(email || "").trim(),
    subject: String(subject || "General inquiry").trim(),
    message: String(message || "").trim(),
  };

  if (!clean.name || clean.name.length < 2) {
    return res.status(400).json({ message: "Please enter your name." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  if (!clean.message || clean.message.length < 10) {
    return res
      .status(400)
      .json({ message: "Please write a message (at least 10 characters)." });
  }

  return res.status(201).json({
    message:
      "Thank you. A member of our concierge team will respond within one business day.",
    reference: `QS-${Date.now().toString(36).toUpperCase()}`,
  });
  
};

module.exports = { submitContact };
