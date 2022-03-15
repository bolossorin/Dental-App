import React, {useState, useCallback} from "react";

// libs
import Router from "next/router";
import axios from "axios";
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";

// components
import {Layout, Spinner} from "../../../components";
import {ISetNotofication} from "../../Toast";
import notify from "../../../components/Toast";
import {ShowPassword} from "../../common/ShowPassword/ShowPassword";

export interface ISendCodeFormResponse {
  token: string;
  userId: string;
}

const changePasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must Contain 8 Characters, 1 Number and 1 Symbol").required("Password is required"),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Both password needs to be the same').required("Confirm Password is required"),
});

export const ChangePassword = ({title, loginUrl, api}) => {
  const [isPassHidden, setIsPassHidden] = useState<boolean>(true);

  const setNotification = useCallback<ISetNotofication>(
    ({type, message, position, autoClose}) => {
      notify({type, message, position, autoClose});
    },
    []
  );

  return (
    <Layout>
      <Formik
        validationSchema={changePasswordSchema}
        initialValues={{code: '', password: '', confirmPassword: ''}}
        onSubmit={async (values) => {
          try {
            const email = localStorage.getItem("resetPasswordEmail");
            const body = {email, verify_code: values.code, newPassword: values.password,};
            const {data} = await axios.post<ISendCodeFormResponse>(api, {...body});
            if (data) {
              Router.push(loginUrl)
            } else {
              setNotification({type: "error", message: "Server Internal Error"});
            }
          } catch (e: any) {
            setNotification({type: "error", message: "Incorrect code!"});
          }
        }}>
        {({resetForm, values, isSubmitting, errors, touched}) =>
          (<Form className="form-login">
            <p className="form-login-title green">New password</p>
            <p className="form-login-subtitle gray">{title}</p>
            <div className="form-login-input">
              <Field type='text' name='code' placeholder='Code' />
              {!isSubmitting &&
              <img
                className="form-login-input-close"
                src={"../images/close.svg"}
                onClick={() => resetForm({
                  values: {
                    code: '',
                    password: values.password,
                    confirmPassword: values.confirmPassword
                  }
                })}
                alt='' />}
              {errors.code && touched.code ? (<div className='errorMessage'>{errors.code}</div>) : null}
            </div>
            <div className="form-login-input">
              <Field type={isPassHidden ? "password" : "text"} name="password" placeholder="New Password" />
              <ShowPassword isPassHidden={isPassHidden} setIsPassHidden={setIsPassHidden} />
              {errors.password && touched.password ? (<div className='errorMessage'>{errors.password}</div>) : null}
            </div>
            <div className="form-login-input">
              <Field type={isPassHidden ? "password" : "text"} name="confirmPassword"
                     placeholder="Confirm New Password" />
              <ShowPassword isPassHidden={isPassHidden} setIsPassHidden={setIsPassHidden} />
              {errors.confirmPassword && touched.confirmPassword ? (
                <div className='errorMessage'>{errors.confirmPassword}</div>) : null}
            </div>
            <div className="form-login-buttons">
              <button type='submit' className="button-green-loginBtn" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : "reset"}
              </button>
              <button
                type='button'
                className="button-green-ResetPassword"
                onClick={() => Router.push(loginUrl)} disabled={isSubmitting}>
                Cancel
              </button>
            </div>
          </Form>)}
      </Formik>
    </Layout>
  )
}
