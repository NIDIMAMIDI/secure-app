import { sendMail } from "../../utils/mail/sendgrid.mail.js";
import { resetPasswordTemplate } from "../../utils/template/reset.password.template.js";

// Send an email with a generated password for forgot password functionality
export const forgotPasswordMailSend = async (email, password) => {
  const toEmail = email; // Recipient's email address
  const subject =
    "Generated Password Successfully. Reset Password Generation Successful"; // Email subject
  const text = "."; // Plain text body of the email
  const html = resetPasswordTemplate(password); // HTML body of the email using a template

  // Send the email using sendMail function
  await sendMail(toEmail, subject, text, html);
};
