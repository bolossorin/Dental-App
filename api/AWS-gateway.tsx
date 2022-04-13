// libs
import axios from "axios";

// DENTIST
export const loginDentistApi = (body) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, body);
export const registerDentistApi = (body) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/signup`, body);
export const passwordResetDentistApi = (body, config) => axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/reset-password`, body, config);
export const updateProfileApi = (body, config) => axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist`, body, config);
export const deleteAccountApi = (config) => axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist`, config);

export const setDentistLocationApi = (body, config) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/location`, body, config);
export const updateDentistLocationApi = (id, body, config) => axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/location/${id}`, body, config);

export const uploadDentistAvatarApi = (body, config) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/avatar`, body, config);

export const getDentistInfoApi = (config) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/authenticated`, config);

export const createSubscriptionApi = (config, price_id) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscription/create/${price_id}`, '', config);
export const deleteSubscriptionApi = (config) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscription/cancel`, '', config);
export const getPriceApi = (price_id) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscription/price/${price_id}`);
export const getSettingsApi = (config) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/settings/subscriptions/authenticated`, config);

export const getDentistServicesApi = (email) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/${email}`);
export const addDentistServiceApi = (service_id, config) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/${service_id}`, '', config);
export const removeDentistServiceApi = (service_id, config) => axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/${service_id}`, config);
export const getUnusedDentistServicesApi = (config) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/authenticated`, config);

export const getDentistGalleryApi = (email) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/gallery/${email}`);
export const setDentistGalleryApi = (service_id, body, config) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/gallery/${service_id}`, body, config);
export const deleteDentistGalleryApi = (service_id, config) => axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/gallery/${service_id}`, config);
export const updateDentistGalleryApi = (body, config) => axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/gallery`, body, config);


// Patient
export const getAllDentistApi = () => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist`);
export const getDentistByEmailApi = (email) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist/${email}`);
export const getDentistGalleryByEmailApi = (email) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/dentist-services/gallery/${email}`);


// Admin
export const loginAdminApi = (body) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/login`, body);
export const passwordResetAdminApi = (body, config) => axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/reset-password`, body, config);

export const getLimitsApi = (config) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/settings/subscriptions`, config);
export const updateLimitsApi = (body, config) => axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/settings/subscriptions`, body, config);

export const getAllServicesApi = () => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/services`);
export const addNewServiceApi = (body, config) => axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/services`, body, config);
export const updateServiceApi = (service_id, body, config) => axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/services/${service_id}`, body, config);
export const deleteServiceApi = (service_id, config) => axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/services/${service_id}`, config);

export const getUsersApi = (config) => axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/dentists`, config);
export const userSuspendApi = (email, config) => axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/suspend/${email}`, '', config);
export const userDeleteApi = (email, config) => axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/delete/${email}`, config);

export const API = {
  PASSWORD_RESET: "/api/dentist/account/reset-password",

  PASSWORD_RESET_VERIFY: "/api/dentist/verify_password_reset",

  SET_DENTIST_LOCATION: "/api/dentist/profile/location",
  STRIPE_CHECK_COUPON: "/api/dentist/payment/activate-coupon",

  // Admin
  PASSWORD_RESET_ADMIN: "/api/admin/reset-password",
  PASSWORD_RESET_VERIFY_ADMIN: "/api/admin/verify_password_reset",
};
