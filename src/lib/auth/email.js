import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_EMAIL_PASS,
  },
});

// Function to send password reset email
export const sendResetOTPEmail = async (email, otp) => {
  const emailContent = baseEmailTemplate(`
    <p>You requested to reset your password.</p>
    <p>Your one-time OTP is: <strong>${otp}</strong></p>
    <p>This OTP will expire in 10 minutes.</p>
  `);

  await transport.sendMail({
    from: process.env.APP_EMAIL,
    to: email,
    subject: "Password Reset OTP",
    html: emailContent,
  });
};

// Function to send confirmation email after password reset
export const sendPasswordChangeConfirmation = async (email) => {
  const emailContent = baseEmailTemplate(`
    <p>Your password has been successfully changed.</p>
    <p>If you did not perform this action, please <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/portal/auth/forgot-password">reset your password</a> immediately and contact our support team.</p>
  `);

  await transport.sendMail({
    from: process.env.APP_EMAIL,
    to: email,
    subject: "Password Changed Successfully",
    html: emailContent,
  });
};

// Base template for email
const baseEmailTemplate = (content) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fef7f0; /* lighter warm background */
            color: #333;
            width: 100%;
          }
          .container {
            width: 100%;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            box-sizing: border-box;
          }
          .header {
            background: linear-gradient(90deg, #fbbf24, #f59e0b, #d97706); /* amber to orange gradient */
            padding: 20px;
            text-align: center;
            color: #ffffff;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 2px;
            font-family: 'Trebuchet MS', sans-serif;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
          }
          .content {
            padding: 20px;
            line-height: 1.6;
            width: 100%;
            color: #1f2937; /* dark gray for readability */
          }
          a {
            color: #f59e0b; /* amber link color */
            text-decoration: underline;
          }
          .footer {
            background-color: #fef7f0; /* match body background */
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af; /* grayish text for footer */
            width: 100%;
          }
          @media only screen and (max-width: 600px) {
            .container {
              padding: 0;
              width: 100%;
            }
            .content {
              padding: 15px;
            }
            .header {
              font-size: 28px;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; width: 100%; background-color: #fef7f0;">
        <div style="width: 100%; background-color: #fef7f0; padding: 0;">
          <div class="container" style="width: 100%;">
            <div class="header">
              YADAH
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} YADAH WORSHIP MINISTRY. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
