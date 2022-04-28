import * as Yup from "yup";

export const gdcSchema = Yup.string()
  .matches(/[0-9]{5}/, "Min 5 numbers")
  .max(5, 'Max 5 numbers')
  .required('GDC Number is required');

export const dentistNameSchema = Yup.string()
  .matches(/[A-Za-z]{1,28}/, "Invalid Name")
  .required('Name is required');

export const phoneSchema = Yup.string()
  .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, 'Invalid Phone');

export const websiteSchema = Yup.string()
  .matches(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/, 'Invalid Website');

export const emailSchema = Yup.string()
  .email("Invalid email")
  .required("Email is required");
