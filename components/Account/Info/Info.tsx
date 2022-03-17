import React, {useCallback, useContext, useState} from "react";

// libs
import axios from "axios";
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";

// components
import {API} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";

const accountInfoSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  gdcNumber: Yup.string().matches(/[0-9]{5}/, 'Invalid gdc number').required("GDC number is required"),
});
const newPasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must Contain 8 Characters, 1 Number and 1 Symbol").required("Old Password is required"),
  newPassword: Yup.string().oneOf([Yup.ref('oldPassword'), null], 'Both password needs to be the same').required("New Password is required"),
});
export const AccountInfoBlock: React.FC = () => {
  const {state} = useContext(AppContext);
  const {email, gdcNumber}: any = state.userState;

  const [canDelete, setCanDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const setNotification = useCallback<ISetNotofication>(
    ({...notifyProps}) => {
      notify({...notifyProps});
    },
    []
  );

  const handleDeleteAccount = async () => {
    if (canDelete) {
      try {
        await axios.delete(`${API.DELETE_ACCOUNT}?email=${email}`);
      } catch (exp) {
        setNotification({
          type: "error",
          message: "Error to delete account, please try again!",
        });
      }
    }
    if (!canDelete) {
      setNotification({
        type: "warning",
        message: "Please check your consent and try deleting again!",
      });
    }
  };

  return (
    <ProfileBox title='Account Information' subTitle='Login Details'>
      <Formik
        validationSchema={accountInfoSchema}
        initialValues={{email: email, gdcNumber: gdcNumber}}
        onSubmit={async (values) => {
          const body = {email: values.email, gdcNumber: values.gdcNumber};
          try {
            await axios.post(API.UPDATE_ACCOUNT, body);
            setNotification({
              type: "success",
              message: "Successfully updated account information!",
              position: "top-right",
              autoClose: 2,
            });
          } catch (error) {
            console.log(error, 'error')
            setNotification({
              type: "error",
              message: "Error, please try again!",
            });
          }
        }}>
        {({resetForm, errors, touched}) =>
          <Form className="account-profile-block-box">
            <div className="account-form-profile-label">
              <label className="account-form-profile-label">Account Email</label>
              <Field className="account-form-profile-input" name='email' placeholder='Email' disabled={!isEdit} />
              {errors.email && touched.email ? <p className='account-error-text'>{errors.email}</p> : null}
            </div>
            <div className="account-form-profile-label">
              <label className="account-form-profile-label">GDC Number</label>
              <Field className="account-form-profile-input" name='gdcNumber' placeholder='GDC Number'
                     disabled={!isEdit} />
              {errors.gdcNumber && touched.gdcNumber ? <p className='account-error-text'>{errors.gdcNumber}</p> : null}
            </div>
            {!isEdit && <>
              <div className="account-form-profile-label ">
                <label className="account-form-profile-label" htmlFor="delete">Delete Account</label>
              </div>
              <div className="account-checkbox">
                <input id='checkbox' type="checkbox" checked={canDelete} onChange={() => setCanDelete(!canDelete)} />
                <label className="account-checkbox-text" htmlFor="checkbox">
                  I acknowledge that by deleting my account, my profile and information will be permanently deleted.
                </label>
              </div>
            </>}
            <div className="account-form-login-buttons">
              {isEdit && <button type='submit' className="account-button-green">
                Update Account
              </button>}
              <button type='button' className="account-button-green-outline" onClick={() => {
                resetForm();
                setIsEdit(!isEdit);
              }}>
                {isEdit ? 'Cancel Account' : 'Edit Account'}
              </button>
              {!isEdit && <button type='button' className="account-button-green" onClick={handleDeleteAccount}>
                Delete Account
              </button>}
            </div>
          </Form>}
      </Formik>
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
    </ProfileBox>
  );
};