import React, {useCallback, useContext, useState} from "react";

// libs
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";

// components
import {deleteAccountApi, passwordResetDentistApi} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {AccountResetPassword} from "../../common/AccountResetPassword/AccountResetPassword";
import {useLogout} from "../../../hooks/useLogout";
import {emailSchema, gdcSchema} from "../../../utils/schemas";

const accountInfoSchema = Yup.object().shape({
  email: emailSchema,
  gdc: gdcSchema,
});
export const AccountInfoBlock: React.FC = () => {
  const [logOut] = useLogout();

  const {state} = useContext(AppContext);
  const {email, gdc, access_token}: any = state.dentistState;

  const [canDelete, setCanDelete] = useState(false);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  return (
    <ProfileBox title='Account Information' subTitle='Login Details'>
      <Formik
        enableReinitialize
        validationSchema={accountInfoSchema}
        initialValues={{email: email, gdc: gdc}}
        onSubmit={async () => {
          if (canDelete) {
            try {
              const config = {headers: {Authorization: `Bearer ${access_token}`}};
              await deleteAccountApi(config);
              await logOut();
            } catch (error: any) {
              setNotification({type: "error", message: error.response.data.message});
            }
          } else {
            setNotification({type: "warning", message: "Please check your consent and try deleting again!"});
          }
        }}>
        {({errors, touched}) =>
          <Form className="account-profile-block-box">
            <div className="account-form-profile-label">
              <label className="account-form-profile-label">Account Email</label>
              <Field className="account-form-profile-input" name='email' placeholder='Email' disabled />
              {errors.email && touched.email ? <p className='account-error-text'>{errors.email}</p> : null}
            </div>
            <div className="account-form-profile-label">
              <label className="account-form-profile-label">GDC Number</label>
              <Field className="account-form-profile-input" name='gdc' placeholder='GDC Number' disabled />
              {errors.gdc && touched.gdc ? <p className='account-error-text'>{errors.gdc}</p> : null}
            </div>
            <div className="account-form-profile-label ">
              <label className="account-form-profile-label" htmlFor="delete">Delete Account</label>
            </div>
            <div className="account-checkbox">
              <input id='checkbox' type="checkbox" checked={canDelete} onChange={() => setCanDelete(!canDelete)} />
              <label className="account-checkbox-text" htmlFor="checkbox">
                I acknowledge that by deleting my account, my profile and information will be permanently deleted.
              </label>
            </div>
            <div className="account-form-login-buttons">
              <button type='submit' className="account-button-green">
                Delete Account
              </button>
            </div>
          </Form>}
      </Formik>
      <AccountResetPassword type='dentist' passwordResetApi={passwordResetDentistApi} />
    </ProfileBox>
  );
};
