import React, {useEffect, useCallback} from "react";


// libs
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";

// components
import {Layout, Spinner} from "../../../components";
import {ISetNotofication} from "../../Toast";
import notify from "../../../components/Toast";
import Router from "next/router";
import {passwordResetByEmailApi} from "../../../api/AWS-gateway";
import {emailSchema} from "../../../utils/schemas";

const resetPasswordSchema = Yup.object().shape({
  email: emailSchema,
});
export const ResetPassword = ({title, loginUrl, changePasswordUrl}) => {
  const setNotification = useCallback<ISetNotofication>(
    ({type, message, position, autoClose}) => {
      notify({type, message, position, autoClose});
    }, []);

  useEffect(() => {
    const message = "Enter your email address, we will send a verification code";
    setNotification({type: "info", message});
  }, []);

  return (
    <Layout>
      <Formik
        validationSchema={resetPasswordSchema}
        initialValues={{email: ''}}
        onSubmit={async (values) => {
          try {
            await passwordResetByEmailApi({email: values.email});
            Router.push(changePasswordUrl)
            setNotification({type: "success", message: 'Please enter your code'});
          } catch (error: any) {
            setNotification({type: "error", message: error.response.data.message});
          }
        }}>
        {({resetForm, isSubmitting, errors, touched}) =>
          (<Form className="form-login">
            <p className="form-login-title green">Reset password</p>
            <p className="form-login-subtitle gray">{title}</p>
            <div className="form-login-input">
              <Field type='email' name='email' placeholder='Email' />
              {!isSubmitting &&
              <img
                className="form-login-input-close"
                src={"../images/close.svg"}
                onClick={() => resetForm({values: {email: ''}})}
                alt='' />}
              {errors.email && touched.email ? (<div className='errorMessage'>{errors.email}</div>) : null}
            </div>
            <div className="form-login-buttons">
              <button type='submit' disabled={isSubmitting} className="button-green-loginBtn">
                {isSubmitting ? <Spinner /> : "get code"}
              </button>
              <button
                type='button'
                className="button-green-ResetPassword"
                onClick={() => Router.push(loginUrl)}
                disabled={isSubmitting}>
                Cancel
              </button>
            </div>
          </Form>)}
      </Formik>
    </Layout>
  )
}
