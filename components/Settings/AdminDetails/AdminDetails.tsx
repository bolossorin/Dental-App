import React, {useContext} from "react";

// libs
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";

// components
import {AppContext} from "../../../context/app.context";
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {AccountResetPassword} from "../../common/AccountResetPassword/AccountResetPassword";

const accountInfoSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  name: Yup.string().required("GDC number is required"),
});
export const AdminDetails: React.FC = () => {
  const {state} = useContext(AppContext);
  const {email, username} = state.adminState.adminDetails;

  return (
    <ProfileBox title='Admin Details' subTitle='Login Details'>
      <Formik
        validationSchema={accountInfoSchema}
        initialValues={{email: email, name: username}}
        onSubmit={async (values) => {
          console.log(values, values)
        }}>
        {({errors, touched}) =>
          <Form className="account-profile-block-box">
            <div className="account-form-profile-label">
              <label className="account-form-profile-label">Name</label>
              <Field className="account-form-profile-input" name='name' placeholder='Name' />
              {errors.name && touched.name ? <p className='account-error-text'>{errors.name}</p> : null}
            </div>
            <div className="account-form-profile-label">
              <label className="account-form-profile-label">Email</label>
              <Field className="account-form-profile-input" name='email' placeholder='Email' />
              {errors.email && touched.email ? <p className='account-error-text'>{errors.email}</p> : null}
            </div>
          </Form>}
      </Formik>
      <AccountResetPassword />
    </ProfileBox>
  );
};
