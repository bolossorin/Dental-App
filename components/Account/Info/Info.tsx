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
import {AccountResetPassword} from "../../common/AccountResetPassword/AccountResetPassword";

const accountInfoSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  gdc: Yup.string().matches(/[0-9]{5}/, 'Invalid gdc number').required("GDC number is required"),
});
export const AccountInfoBlock: React.FC = () => {
  const {state} = useContext(AppContext);
  const {email, gdc}: any = state.dentistState;

  const [canDelete, setCanDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

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
        enableReinitialize
        validationSchema={accountInfoSchema}
        initialValues={{email: email, gdc: gdc}}
        onSubmit={async (values) => {
          const body = {email: values.email, gdc: values.gdc};
          try {
            await axios.post(API.UPDATE_ACCOUNT, body);
            setNotification({type: "success", message: "Successfully updated account information!"});
          } catch (error) {
            console.log(error, 'error')
            setNotification({type: "error", message: "Error, please try again!"});
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
              <Field className="account-form-profile-input" name='gdc' placeholder='GDC Number'
                     disabled={!isEdit} />
              {errors.gdc && touched.gdc ? <p className='account-error-text'>{errors.gdc}</p> : null}
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
      <AccountResetPassword />
    </ProfileBox>
  );
};
