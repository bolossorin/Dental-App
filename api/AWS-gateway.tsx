export const API = {
  LOGIN: "/api/dentist/account/login",
  REGISTER: "/api/dentist/account/register",
  LOGOUT: "/api/dentist/account/logout",
  VERIFY_REGISTER: "/api/dentist/account/register_verify",
  PASSWORD_RESET: "/api/dentist/account/reset-password",

  ACCOUNT_RESET_PASSWORD: "/api/dentist/profile/account/resetPassword",
  DELETE_ACCOUNT: "/api/dentist/profile/account/deleteAccount",
  PASSWORD_RESET_VERIFY: "/api/dentist/verify_password_reset",

  SET_DENTIST_INFORMATION: "/api/dentist/profile/information",
  GET_DENTIST_FULL_DATA: "/api/dentist/profile/dentist-profile",
  SET_DENTIST_LOCATION: "/api/dentist/profile/location",
  GET_DENTIST_LOCATION: "/api/dentist/profile/location",
  SET_DENTIST_SERVICES: "/api/dentist/profile/services",
  GET_ALL_SERVICES: "/api/dentist/profile/services",
  UPLOAD_DENTIST_AVATAR: "/api/dentist/profile/avatar",
  UPLOAD_DENTIST_COVER: "/api/dentist/profile/cover",

  STRIPE_CHARGE: "/api/dentist/payment/charge",
  STRIPE_REFUND: "/api/dentist/payment/refund",
  STRIPE_SUBSCRIPTION_CREATE: "/api/dentist/payment/subscription",
  STRIPE_CHECK_COUPON: "/api/dentist/payment/activate-coupon",
  STRIPE_GET_PREMIUM_PRICE: "/api/dentist/payment/price",

  SET_DENTIST_GALLERY: "/api/dentist/gallery",

  GET_ALL_DENTISTS: "/api/dentist/search/dentists",
};
