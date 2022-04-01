import React, {useCallback, useState} from "react";

// libs
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";

// components
import {ShowPassword} from "../../common/ShowPassword/ShowPassword";
import {IRegisterFormChildren} from "../Content/Content";
import {registerDentistApi} from "../../../api/AWS-gateway";
import notify, {ISetNotofication} from "../../Toast";

const registrationSchema = Yup.object().shape({
  dentist_name: Yup.string().matches(/[A-Za-z]{1,28}/, "Invalid Name").required('Name is required'),
  email: Yup.string().email("Invalid Email").required('Email is required'),
  gdc: Yup.string().matches(/[0-9]{5}/, "Invalid GDC").required('GDC Number is required'),
  password: Yup.string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must Contain 8 Characters, 1 Number and 1 Symbol").required("Password is required"),
});
export const Register = ({setNextStep}) => {
  const [isPassHidden, setIsPassHidden] = useState<boolean>(true);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);
  return (
    <Formik
      validationSchema={registrationSchema}
      initialValues={{dentist_name: '', email: '', gdc: '', password: ''}}
      onSubmit={async (values: IRegisterFormChildren) => {
        try {
          await registerDentistApi(values)
          setNextStep("pricingCheck");
        } catch (error: any) {
          setNotification({
            type: "error",
            message: Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message
          });
        }

      }}>
      {({resetForm, errors, touched, values, isSubmitting}) =>
        <Form className="form-login">
          <p className="form-login-title green">Sign Up</p>
          <p className="form-login-subtitle gray">Create An Account with FYD</p>
          <div className="form-login-input">
            <Field name='dentist_name' placeholder='Name' />
            {!isSubmitting && <img
              className="form-login-input-close"
              src={"../images/close.svg"}
              onClick={() => resetForm({
                values: {
                  dentist_name: '',
                  email: values.email,
                  gdc: values.gdc,
                  password: values.password
                }
              })}
              alt='' />}
            {errors.dentist_name && touched.dentist_name ? <p className='errorMessage'>{errors.dentist_name}</p> : null}
          </div>
          <div className="form-login-input">
            <Field type='email' name='email' placeholder='Email' />
            {!isSubmitting && <img
              className="form-login-input-close"
              src={"../images/close.svg"}
              onClick={() => resetForm({
                values: {
                  dentist_name: values.dentist_name,
                  email: '',
                  gdc: values.gdc,
                  password: values.password
                }
              })}
              alt='' />}
            {errors.email && touched.email ? <p className='errorMessage'>{errors.email}</p> : null}
          </div>
          <div className="form-login-input">
            <Field name='gdc' placeholder='GDC number (this cannot be updated later)' />
            {!isSubmitting && <img
              className="form-login-input-close"
              src={"../images/close.svg"}
              onClick={() => resetForm({
                values: {
                  dentist_name: values.dentist_name,
                  email: values.email,
                  gdc: '',
                  password: values.password
                }
              })}
              alt='' />}
            {errors.gdc && touched.gdc ? <p className='errorMessage'>{errors.gdc}</p> : null}
          </div>
          <div className="form-login-input">
            <Field type={isPassHidden ? "password" : "text"} name='password' placeholder='Password' />
            <ShowPassword isPassHidden={isPassHidden} setIsPassHidden={setIsPassHidden} />
            {errors.password && touched.password ? <p className='errorMessage'>{errors.password}</p> : null}
          </div>
          <div className="form-login-buttons">
            <button type='submit' className="button-nextStep">
              Next Step
            </button>
          </div>
        </Form>}
    </Formik>
  )
}
