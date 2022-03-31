// libs
import axios from "axios";

export const loginDentistApi = (body) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, body);

export const registerDentistApi = (body) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/signup`, body);


export const API = {
  LOGOUT: "/api/dentist/account/logout",
  VERIFY_REGISTER: "/api/dentist/account/register_verify",
  PASSWORD_RESET: "/api/dentist/account/reset-password",

  ACCOUNT_RESET_PASSWORD: "/api/dentist/profile/account/resetPassword",
  DELETE_ACCOUNT: "/api/dentist/profile/account/deleteAccount",
  UPDATE_ACCOUNT: "/api/dentist/profile/account/updateAccount",
  PASSWORD_RESET_VERIFY: "/api/dentist/verify_password_reset",

  SET_DENTIST_INFORMATION: "/api/dentist/profile/information",
  GET_DENTIST_FULL_DATA: "/api/dentist/profile/dentist-profile",
  SET_DENTIST_LOCATION: "/api/dentist/profile/location",
  GET_DENTIST_LOCATION: "/api/dentist/profile/location",
  DENTIST_SERVICES: "/api/dentist/profile/services",
  UPLOAD_DENTIST_AVATAR: "/api/dentist/profile/avatar",
  UPLOAD_DENTIST_COVER: "/api/dentist/profile/cover",

  STRIPE_CHARGE: "/api/dentist/payment/charge",
  STRIPE_REFUND: "/api/dentist/payment/refund",
  STRIPE_SUBSCRIPTION: "/api/dentist/payment/subscription",
  STRIPE_CHECK_COUPON: "/api/dentist/payment/activate-coupon",
  STRIPE_GET_PREMIUM_PRICE: "/api/dentist/payment/price",

  SET_DENTIST_GALLERY: "/api/dentist/gallery",

  GET_ALL_DENTISTS: "/api/dentist/search/dentists",

  // Admin
  LOGIN_ADMIN: "/api/admin/login",
  PASSWORD_RESET_ADMIN: "/api/admin/reset-password",
  PASSWORD_RESET_VERIFY_ADMIN: "/api/admin/verify_password_reset",
  SETTINGS_CHANGE: "/api/admin/settings/subscriber",
  CHANGE_SERVICES: "/api/admin/settings/services",
  GET_USERS: "/api/admin/users",
  SUSPEND_USER: "/api/admin/users/suspend",
  DELETE_USER: "/api/profile/account/deleteAccount",
  SETTINGS_FULL_INFO: "/api/admin/settings",
  STAT_CUR_MONTHS: "/api/admin/dashboard",
};
