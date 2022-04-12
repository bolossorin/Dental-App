import React, {useCallback, useContext} from "react";

// libs
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";

// components
import notify, {ISetNotofication} from "../../Toast";
import {AppContext} from "../../../context/app.context";

const newPasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must Contain 8 Characters, 1 Number and 1 Symbol").required("Old Password is required"),
  newPassword: Yup.string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must Contain 8 Characters, 1 Number and 1 Symbol").required("Old Password is required"),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Both password needs to be the same').required("New Password is required"),
});
export const AccountResetPassword = ({passwordResetApi, type}) => {
  const {state} = useContext(AppContext);
  const {access_token} = state.dentistState;

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  return (
    <Formik
      validationSchema={newPasswordSchema}
      initialValues={{currentPassword: '', newPassword: '', confirmPassword: ''}}
      onSubmit={async (values) => {
        try {

          let config;
          if (type === 'admin') {
            const token = localStorage.getItem('access_token_admin');
            config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
            await passwordResetApi({oldPassword: values.currentPassword, newPassword: values.newPassword}, config);
          }
          if (type === 'dentist') {
            config = {headers: {Authorization: `Bearer ${access_token}`}};
            await passwordResetApi({old_password: values.currentPassword, new_password: values.newPassword}, config);
          }
          setNotification({type: "success", message: "Successfully changed password!", position: "top-right"});
        } catch (error: any) {
          setNotification({
            type: "error",
            message: Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message
          });
        }
      }}>
      {({errors, touched}) =>
        <Form className="account-profile-block-box">
          <div className="account-form-profile-label">
            <label className="account-form-profile-label">Reset Password</label>
          </div>
          <div className="account-row-content">
            <span className="account-input-span">Current</span>
            <Field className="account-form-profile-input" name='currentPassword' placeholder='Old Password' />
            {errors.currentPassword && touched.currentPassword ?
              <p className='account-error-text'>{errors.currentPassword}</p> : null}
          </div>
          <div className="account-row-content">
            <span className="account-input-span">New</span>
            <Field className="account-form-profile-input" name='newPassword' placeholder='New Password' />
            {errors.newPassword && touched.newPassword ?
              <p className='account-error-text'>{errors.newPassword}</p> : null}
          </div>
          <div className="account-row-content">
            <span className="account-input-span">Confirm</span>
            <Field className="account-form-profile-input" name='confirmPassword' placeholder='Confirm Password' />
            {errors.confirmPassword && touched.confirmPassword ?
              <p className='account-error-text'>{errors.confirmPassword}</p> : null}
          </div>
          <div className="account-row-content">
            <button className="account-button-green" type="submit">
              Reset Password
            </button>
          </div>
        </Form>}
    </Formik>
  )
}
