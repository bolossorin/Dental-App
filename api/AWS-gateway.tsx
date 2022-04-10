// libs
import axios from "axios";

// DENTIST
export const loginDentistApi = (body) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, body);
export const registerDentistApi = (body) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/signup`, body);
export const passwordResetDentistApi = (body, config) => axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/reset-password`, body, config);
export const updateProfileAPI = (body, config) => axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist`, body, config);

export const setDentistLocation = (body, config) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/location`, body, config);
export const updateDentistLocation = (id, body, config) => axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/location/${id}`, body, config);

export const uploadDentistAvatarAPI = (body, config) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/avatar`, body, config);

export const getDentistInfoAPI = (config) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/authenticated`, config);

export const createSubscriptionPI = (config, price_id) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscription/create/${price_id}`, '', config);
export const deleteSubscriptionPI = (config) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscription/cancel`, '', config);
export const getPricePI = (price_id) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscription/price/${price_id}`);
export const getSettingsPI = (config) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/settings/subscriptions/authenticated`, config);

export const getAllServices = () => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/services`);
export const getDentistServices = (email) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/${email}`);
export const addDentistService = (service_id, config) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/${service_id}`, '', config);
export const removeDentistService = (service_id, config) => axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/${service_id}`, config);

export const getAllGallery = (email) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/gallery/${email}`);
export const setGallery = (service_id, body, config) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/gallery/${service_id}`, body, config);


// Patient
export const getAllDentistAPI = () => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist`);
export const getDentistByEmailAPI = (email) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/${email}`);
export const getDentistGalleryByEmailAPI = (email) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/gallery/${email}`);

export const API = {
  PASSWORD_RESET: "/api/dentist/account/reset-password",

  DELETE_ACCOUNT: "/api/dentist/profile/account/deleteAccount",
  UPDATE_ACCOUNT: "/api/dentist/profile/account/updateAccount",
  PASSWORD_RESET_VERIFY: "/api/dentist/verify_password_reset",

  SET_DENTIST_INFORMATION: "/api/dentist/profile/information",
  SET_DENTIST_LOCATION: "/api/dentist/profile/location",
  UPLOAD_DENTIST_COVER: "/api/dentist/profile/cover",

  STRIPE_CHECK_COUPON: "/api/dentist/payment/activate-coupon",

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
