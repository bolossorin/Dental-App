export const API = {
  LOGIN: "/api/account/login",
  REGISTER: "/api/account/register",
  LOGOUT: "/api/account/logout",
  VERIFY_REGISTER: "/api/account/register_verify",
  PASSWORD_RESET: "/api/account/reset-password",

  ACCOUNT_RESET_PASSWORD: "/api/profile/account/resetPassword",
  DELETE_ACCOUNT: "/api/profile/account/deleteAccount",
  PASSWORD_RESET_VERIFY: "/api/verify_password_reset",

  SET_DENTIST_INFORMATION: "/api/profile/information",
  GET_DENTIST_FULL_DATA: "/api/profile/dentist-profile",
  SET_DENTIST_LOCATION: "/api/profile/location",
  GET_DENTIST_LOCATION: "/api/profile/location",
  SET_DENTIST_SERVICES: "/api/profile/services",
  GET_ALL_SERVICES: "/api/profile/services",
  UPLOAD_DENTIST_AVATAR: "/api/profile/avatar",
  UPLOAD_DENTIST_COVER: "/api/profile/cover",

  STRIPE_CHARGE: "/api/payment/charge",
  STRIPE_REFUND: "/api/payment/refund",
  STRIPE_SUBSCRIPTION_CREATE: "/api/payment/subscription",
  STRIPE_CHECK_COUPON: "/api/payment/activate-coupon",
  STRIPE_GET_PREMIUM_PRICE: "/api/payment/price",

  SET_DENTIST_GALLERY: "/api/gallery",

  GET_ALL_DENTISTS: "/api/search/dentists",
};
