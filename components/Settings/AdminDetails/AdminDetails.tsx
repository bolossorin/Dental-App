import React from "react";

// libs
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";

// components
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {AccountResetPassword} from "../../common/AccountResetPassword/AccountResetPassword";
import {passwordResetAdminApi} from "../../../api/AWS-gateway";
import {emailSchema} from "../../../utils/schemas";

const accountInfoSchema = Yup.object().shape({
  email: emailSchema,
  name: Yup.string().required("Name is required"),
});
export const AdminDetails: React.FC = () => {

  return (
    <ProfileBox title='Admin Details' subTitle='Login Details'>
      <Formik
        validationSchema={accountInfoSchema}
        enableReinitialize
        initialValues={{email: 'admin@gmail.com', name: 'Admin'}}
        onSubmit={async (values) => console.log(values, values)}>
        {({errors, touched}) =>
          <Form className="account-profile-block-box">
            <div className="account-form-profile-label">
              <label className="account-form-profile-label">Name</label>
              <Field disabled className="account-form-profile-input" name='name' placeholder='Name' />
              {errors.name && touched.name ? <p className='account-error-text'>{errors.name}</p> : null}
            </div>
            <div className="account-form-profile-label">
              <label className="account-form-profile-label">Email</label>
              <Field disabled className="account-form-profile-input" name='email' placeholder='Email' />
              {errors.email && touched.email ? <p className='account-error-text'>{errors.email}</p> : null}
            </div>
          </Form>}
      </Formik>
      <AccountResetPassword type='admin' passwordResetApi={passwordResetAdminApi} />
    </ProfileBox>
  );
};
