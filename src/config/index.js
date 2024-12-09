require("dotenv").config();

module.exports = {
  port: process.env.PORT || 8080,
  dbUrl: process.env.DB,
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  gmail_app_password: process.env.GMAIL_APP_PASSWORD,
  gmail_app_user: process.env.GMAIL_APP_USER,
  forgot_password_key: process.env.FORGOT_PASSWORD_KEY,
  apollo_url: process.env.APOLLO_URL,
  apollo_api_key: process.env.APOLLO_X_API_KEY,
};
