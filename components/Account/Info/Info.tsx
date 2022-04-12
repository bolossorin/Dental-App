import React, {useCallback, useContext, useState} from "react";

// libs
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";

// components
import {deleteAccountApi, updateProfileApi} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {AccountResetPassword} from "../../common/AccountResetPassword/AccountResetPassword";
import {useLogout} from "../../../hooks/useLogout";

const accountInfoSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  gdc: Yup.string().matches(/[0-9]{5}/, 'Invalid gdc number').required("GDC number is required"),
});
export const AccountInfoBlock: React.FC = () => {
  const [logOut] = useLogout();

  const {state} = useContext(AppContext);
  const {email, gdc, access_token, title, dentist_name, qualifications, bio, phone, website}: any = state.dentistState;

  const [canDelete, setCanDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const handleDeleteAccount = async () => {
    if (canDelete) {
      try {
        const config = {headers: {Authorization: `Bearer ${access_token}`}};
        await deleteAccountApi(config);
        await logOut();
      } catch (error: any) {
        setNotification({type: "error", message: error.response.data.message});
      }
    }
    if (!canDelete) {
      setNotification({type: "warning", message: "Please check your consent and try deleting again!"});
    }
  };

  return (
    <ProfileBox title='Account Information' subTitle='Login Details'>
      <Formik
        enableReinitialize
        validationSchema={accountInfoSchema}
        initialValues={{email: email, gdc: gdc}}
        onSubmit={async (values) => {
          try {
            const config = {headers: {Authorization: `Bearer ${access_token}`}};
            const body = {
              title: title,
              dentist_name: dentist_name,
              email: values.email,
              qualifications: qualifications,
              bio: bio,
              phone: phone,
              website: website,
              gdc: values.gdc
            }
            await updateProfileApi(body, config);
            setNotification({type: "success", message: "Successfully updated account information!"});
          } catch (error: any) {
            setNotification({type: "error", message: error.response.data.message});
          }
        }}>
        {({resetForm, errors, touched}) =>
          <Form className="account-profile-block-box">
            <div className="account-form-profile-label">
              <label className="account-form-profile-label">Account Email</label>
              <Field className="account-form-profile-input" name='email' placeholder='Email' disabled />
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
