import React, {useCallback} from "react";

// libs
import axios from "axios";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";

// components
import {API} from "../../../api/AWS-gateway";
import notify, {ISetNotofication} from "../../Toast";

const billingSchema = Yup.object().shape({
  card: Yup.string().matches(/([0-9]{16})/, 'Card must be at most 16 characters').max(16, 'Card must be at most 16 characters').required('Card number date is required'),
  expiration: Yup.string().typeError('Invalid. Example: MM/YY').max(5, 'Invalid. Example: MM/YY').matches(/([0-9]{2})\/([0-9]{2})/, 'Invalid. Example: MM/YY').required('Expiration date is required'),
  ccv: Yup.string().label('CVC').min(3).max(8).required(),
  post_code: Yup.string(),
});
export const Billing = () => {
  const setNotification = useCallback<ISetNotofication>(
    ({...notifyProps}) => {
      notify({...notifyProps});
    },
    []
  );

  return (
    <Formik
      validationSchema={billingSchema}
      initialValues={{card: '', expiration: '', ccv: '', post_code: ''}}
      onSubmit={async (values) => {
        try {
          await axios.post(API.STRIPE_SUBSCRIPTION, values);
          setNotification({
            type: "success",
            message: "Successfully updated!",
            position: "top-right",
            autoClose: 2,
          });
        } catch (exp) {
          setNotification({
            type: "error",
            message: "Error, please try again!",
          });
        }
      }}>
      {({errors, touched}) =>
        <Form className="account-profile-block-box">
          <div className="account-form-profile-label">
            <label className="account-form-profile-label">Billing Information</label>
          </div>
          <div className="account-row-content">
            <span className="account-input-span">Card No.</span>
            <Field className="account-form-profile-input" name='card' placeholder='XXXX XXXX XXXX XXXX' />
            {errors.card && touched.card ?
              <p className='account-error-text'>{errors.card}</p> : null}
          </div>
          <div className="account-row-content">
            <span className="account-input-span">Exp.</span>
            <Field className="account-form-profile-input" name='expiration' placeholder='MM/YY' />
            {errors.expiration && touched.expiration ?
              <p className='account-error-text'>{errors.expiration}</p> : null}
          </div>
          <div className="account-row-content">
            <span className="account-input-span">CCV</span>
            <Field className="account-form-profile-input" name='ccv' placeholder='CCV' />
            {errors.ccv && touched.ccv ?
              <p className='account-error-text'>{errors.ccv}</p> : null}
          </div>
          <div className="account-row-content">
            <span className="account-input-span">Post Code</span>
            <Field className="account-form-profile-input" name='post_code' placeholder='Post Code' />
            {errors.post_code && touched.post_code ?
              <p className='account-error-text'>{errors.post_code}</p> : null}
          </div>
          <div className="account-row-content">
            <button className="account-button-green" type="submit">
              CONFIRM SUBSCRIPTION
            </button>
          </div>
        </Form>}
    </Formik>
  )
}
