import React, {useEffect, useCallback} from "react";


// libs
import axios from "axios";
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";

// components
import {Layout, Spinner} from "../../../components";
import {ISetNotofication} from "../../Toast";
import notify from "../../../components/Toast";
import Router from "next/router";

export interface ISendEmailFormResponse {
  message: string;
  statusCode: number;
}

const resetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});
export const ResetPassword = ({title, loginUrl, changePasswordUrl, api}) => {
  const setNotification = useCallback<ISetNotofication>(
    ({type, message, position, autoClose}) => {
      notify({type, message, position, autoClose});
    }, []);

  useEffect(() => {
    const message = "Enter your email address, we will send a verification code";
    setNotification({
      type: "info",
      message,
      position: "bottom-right",
      autoClose: 8,
    });
  }, []);

  return (
    <Layout>
      <Formik
        validationSchema={resetPasswordSchema}
        initialValues={{email: ''}}
        onSubmit={async (values) => {
          try {
            const {data} = await axios.post<ISendEmailFormResponse>(api, {email: values.email});
            if (data) {
              localStorage.setItem("resetPasswordEmail", values.email);
              setNotification({
                type: "success",
                message: data.message,
                position: "bottom-center",
                autoClose: 10,
              });
              Router.push(changePasswordUrl)
            } else {
              setNotification({type: "error", message: "Server Internal Error"});
            }
          } catch (e: any) {
            setNotification({type: "error", message: 'Incorrect email'});
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
