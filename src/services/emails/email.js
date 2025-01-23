//comfigs
const config = require("../../config");
//nodemailer
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  // port: 465,
  // secure: true,
  auth: {
    user: process.env.GMAIL_APP_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

//OTP generated for reseting user password
const sendOTPPasswordEmail = async function (email, otp) {
  try {
    const html = `
        <!DOCTYPE html>
          <html lang="en">

          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset OTP</title>
              <style>
                  body {
                      font-family: 'Arial', sans-serif;
                      background-color: #f9f9f9;
                      color: #333;
                      margin: 0;
                      padding: 0;
                  }

                  .container {
                      max-width: 600px;
                      margin: 20px auto;
                      padding: 20px;
                      background-color: #ffffff;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      border-radius: 8px;
                  }

                  h1 {
                      color: #007bff;
                  }

                  p {
                      font-size: 16px;
                      line-height: 1.6;
                      color: #555;
                }

                  .otp-code {
                      font-size: 36px;
                      font-weight: bold;
                      color: #28a745;
                      padding: 12px;
                      background-color: #e1f5e3;
                      border-radius: 8px;
                      margin: 20px 0;
                      text-align: center;
                  }

                  .expiration-message {
                      font-size: 16px;
                      color: #ff6347;
                      margin-top: 10px;
                  }

                  .footer {
                      margin-top: 20px;
                      text-align: center;
                      color: #777;
                  }
              </style>
          </head>

          <body>
              <div class="container">
                  <h1>Password Reset OTP</h1>
                  <p>Dear User,</p>
                  <p>Your OTP for password reset is:</p>
                  <div class="otp-code">${otp}</div>
                  <p>Please use this OTP to reset your password.</p>
                  <p class="expiration-message">Note: This OTP is valid for 15 minutes.</p>
                  <p>If you did not request this password reset, please ignore this email.</p>
                  <div class="footer">
                      <p>Best regards,<br>Trucking App</p>
                  </div>
              </div>
          </body>

          </html>
      `;

      let message = {
        from: config.gmail_app_user,
        to: email,
        subject: "Password Reset",
        text: "Your OTP for reseting password",
        html: html,
      };

      await transporter.sendMail(message);
    } catch (err) {
      console.log("Error sending Email: ", err);
    }
  };

  const sendAccountCreationEmail = async function (email, password, user) {
    try {
      const html = `
        <!DOCTYPE html>
          <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Created</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }

                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #ffffff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                    }

                    h1 {
                        color: #007bff;
                    }

                    p {
                        font-size: 16px;
                        line-height: 1.6;
                        color: #555;
                    }

                    .highlight {
                        font-weight: bold;
                        color: #28a745;
                    }

                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        color: #777;
                    }

                    a {
                        color: #007bff;
                        text-decoration: none;
                    }

                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to Trucking!</h1>
                    <p>Dear ${user.fullName},</p>
                    <p>We are pleased to inform you that your account has been successfully created. Below are your login details:</p>

                    <p><span class="highlight">Email/Username:</span> ${user.email}</p>
                    <p><span class="highlight">Password:</span> ${password}</p>

                    <p>Please log in to your account. For security reasons, we recommend changing your password after your first login.</p>

                    <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:trucking@gmail.com">trucking@gmail.com</a>.</p>

                    <div class="footer">
                        <p>Best regards,<br>Trucking Support Team</p>
                    </div>
                </div>
          </body>
          </html>
    `;

    let message = {
      from: config.gmail_app_user,
      to: email,
      subject: "Account Created",
      text: "Welcome to Trucking App",
      html: html,
    };

    await transporter.sendMail(message);
  } catch (err) {
    console.log("Error sending Email: ", err);
  }
};

module.exports = {
  sendOTPPasswordEmail,
  sendAccountCreationEmail,
};

{/* <p>Please log in to your account at <a href="[Website URL]">[Website URL]</a>. For security reasons, we recommend changing your password after your first login.</p> */ }
