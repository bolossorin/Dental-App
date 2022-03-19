import React, {useCallback, useContext} from "react";

// libs
import {Field, Form, Formik} from "formik";
import axios from "axios";
import * as Yup from "yup";

// components
import {API} from "../../../api/AWS-gateway";
import notify, {ISetNotofication} from "../../Toast";
import {AppContext} from "../../../context/app.context";

const newPasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must Contain 8 Characters, 1 Number and 1 Symbol").required("Old Password is required"),
  newPassword: Yup.string().oneOf([Yup.ref('oldPassword'), null], 'Both password needs to be the same').required("New Password is required"),
});
export const AccountResetPassword = () => {
  const {state} = useContext(AppContext);
  const {email} = state.userState.adminDetails;

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  return (
    <Formik
      validationSchema={newPasswordSchema}
      initialValues={{oldPassword: '', newPassword: ''}}
      onSubmit={async (values) => {
        const body = {email, oldPassword: values.oldPassword, newPassword: values.newPassword};
        try {
          await axios.post(API.ACCOUNT_RESET_PASSWORD, body);
          setNotification({
            type: "success",
            message: "Successfully changed password!",
            position: "top-right",
            autoClose: 2,
          });
        } catch (exp) {
          setNotification({
            type: "error",
            message: "Error to reset password account, please try again!",
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
            <Field className="account-form-profile-input" name='oldPassword' placeholder='Old Password' />
            {errors.oldPassword && touched.oldPassword ?
              <p className='account-error-text'>{errors.oldPassword}</p> : null}
          </div>
          <div className="account-row-content">
            <span className="account-input-span">New</span>
            <Field className="account-form-profile-input" name='newPassword' placeholder='New Password' />
            {errors.newPassword && touched.newPassword ?
              <p className='account-error-text'>{errors.newPassword}</p> : null}
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
