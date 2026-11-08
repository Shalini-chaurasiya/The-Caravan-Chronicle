import nodemailer from "nodemailer";

const sendResolutionOtpEmail = async ({
  to,
  name,
  complaintReference,
  code,
}) => {
  const emailUser = process.env.SMTP_USER;
  const emailPassword = process.env.SMTP_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error(
      "Email delivery is not configured. Set SMTP_USER and SMTP_PASSWORD in the backend environment."
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
  const greetingName = String(name || "Citizen").replace(/[<>]/g, "");

  await transporter.sendMail({
    from: emailUser,
    to,
    subject: `Complaint resolution verification - ${complaintReference}`,
    text: `Hello ${greetingName},\n\nYour resolution verification code for complaint ${complaintReference} is ${code}.\n\nThis code expires in 10 minutes. If the work is complete, share this code only with the assigned staff member so they can verify resolution. Never share it with anyone else. If you did not expect this email, you can ignore it.\n\nCaravan Chronicle`,
    html: `<p>Hello ${greetingName},</p><p>Your resolution verification code for complaint <strong>${complaintReference}</strong> is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${code}</p><p>This code expires in 10 minutes. If the work is complete, share it only with the assigned staff member so they can verify resolution. Never share it with anyone else.</p><p>If you did not expect this email, you can ignore it.</p><p>Caravan Chronicle</p>`,
  });
};

export default sendResolutionOtpEmail;
