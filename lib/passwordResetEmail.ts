import nodemailer from "nodemailer";

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  appUrl: string;
};

export function validatePasswordResetEmailConfig() {
  getSmtpConfig();
}

function getSmtpConfig(): SmtpConfig {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, APP_URL } = process.env;
  const port = Number(SMTP_PORT);

  if (
    !SMTP_HOST ||
    !SMTP_PORT ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !SMTP_USER ||
    !SMTP_PASSWORD ||
    !SMTP_FROM ||
    !APP_URL
  ) {
    throw new Error("Password reset email is not configured. Set all SMTP_* variables and APP_URL.");
  }

  let appUrl: URL;
  try {
    appUrl = new URL(APP_URL);
  } catch {
    throw new Error("APP_URL must be an absolute HTTP or HTTPS URL.");
  }

  if (appUrl.protocol !== "http:" && appUrl.protocol !== "https:") {
    throw new Error("APP_URL must be an absolute HTTP or HTTPS URL.");
  }

  return {
    host: SMTP_HOST,
    port,
    user: SMTP_USER,
    password: SMTP_PASSWORD,
    from: SMTP_FROM,
    appUrl: appUrl.origin,
  };
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const config = getSmtpConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.password },
  });
  const resetUrl = new URL("/forgot-password", config.appUrl);
  resetUrl.searchParams.set("token", token);

  await transporter.sendMail({
    from: config.from,
    to: email,
    subject: "Reset your Lalitha Home Foods password",
    text: [
      "We received a request to reset the password for your Lalitha Home Foods account.",
      `Use this link within 30 minutes: ${resetUrl.toString()}`,
      "If you did not request this, you can ignore this email.",
    ].join("\n\n"),
    html: `<p>We received a request to reset the password for your Lalitha Home Foods account.</p><p><a href="${resetUrl.toString()}">Reset your password</a></p><p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>`,
  });
}
