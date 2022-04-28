import React, {DetailedHTMLProps, FC, HTMLAttributes, useCallback, useContext, useState} from "react";

// libs
import Router from "next/router";
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";

// components
import {Spinner} from "../../index";
import notify, {ISetNotofication} from "../../Toast";
import {AppContext} from "../../../context/app.context";
import {AdminTypes, DentistTypes} from "../../../reducers";
import {IDentistBio, IDentistLocations, IServices, Null_Or_,} from "../../../reducers/types";
import {Layout} from "../../Layout/Layout";
import {ShowPassword} from "../../common/ShowPassword/ShowPassword";
import {routes} from "../../../utils/routes";
import {emailSchema} from "../../../utils/schemas";

export interface ILoginForm
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  loginApi: any,
  resetPasswordUrl: string,
}

export interface IDentistFullDataResponse
  extends IDentistLocations,
    IServices, IDentistBio {
  avatarUrl: Null_Or_<string>;
  subscription_plan: string;
}

const loginSchema = Yup.object().shape({
  email: emailSchema,
  password: Yup.string()
  // .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must Contain 8 Characters, 1 Number and 1 Symbol").required("Password is required"),
});

export const LoginForm: FC<ILoginForm> = ({title, loginApi, resetPasswordUrl}) => {
  const {dispatch} = useContext(AppContext);

  const [isPassHidden, setIsPassHidden] = useState<boolean>(true);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  return (
    <Layout>
      <Formik
        validationSchema={loginSchema}
        initialValues={{email: '', password: ''}}
        onSubmit={async (values) => {
          try {
            const {data} = await loginApi(values);
            if (title === 'Current FYD admins') {
              localStorage.setItem("admin", JSON.stringify(values));
              localStorage.setItem("access_token_admin", JSON.stringify(data.access_token));
              localStorage.removeItem("dentist");
              localStorage.removeItem("access_token");

              dispatch({type: AdminTypes.ADMIN_LOGIN, payload: data});
              setTimeout(() => {
                Router.push(routes.dashboard);
              }, 800);
            } else {
              localStorage.setItem("dentist", JSON.stringify(values));
              localStorage.setItem("access_token", JSON.stringify(data.access_token));
              localStorage.removeItem("admin");
              localStorage.removeItem("access_token_admin");

              dispatch({type: DentistTypes.LOGIN, payload: {email: values.email}});
              setTimeout(() => {
                Router.push(routes.profile);
              }, 800);
            }
            setNotification({
              type: "success",
              message: "Success! Please wait...",
              position: "top-right",
            });
          } catch (error: any) {
            setNotification({type: "error", message: error.response.data.message});
          }
        }}>
        {({resetForm, values, isSubmitting, errors, touched}) =>
          (<Form className="form-login">
            <p className="form-login-title green">Login</p>
            <p className="form-login-subtitle gray">{title}</p>
            <div className="form-login-input">
              <Field type='email' name='email' placeholder='Email' />
              {!isSubmitting &&
              <img
                className="form-login-input-close"
                src={"../images/close.svg"}
                onClick={() => resetForm({values: {email: '', password: values.password}})}
                alt='' />}
              {errors.email && touched.email ? (<div className='errorMessage'>{errors.email}</div>) : null}
            </div>
            <div className="form-login-input">
              <Field type={isPassHidden ? "password" : "text"} name="password" placeholder="Password" />
              <ShowPassword isPassHidden={isPassHidden} setIsPassHidden={setIsPassHidden} />
              {errors.password && touched.password ? (<div className='errorMessage'>{errors.password}</div>) : null}
            </div>
            <div className="form-login-buttons">
              <button type='submit' className="button-green-loginBtn" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : "Login"}
              </button>
              <button
                type='button'
                className="button-green-ResetPassword"
                onClick={() => Router.push(resetPasswordUrl)}
                disabled={isSubmitting}>
                Reset password
              </button>
            </div>
          </Form>)}
      </Formik>
    </Layout>
  );
};
