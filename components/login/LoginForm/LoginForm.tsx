import React, {DetailedHTMLProps, FC, HTMLAttributes, useCallback, useContext, useState} from "react";

// libs
import Router from "next/router";
import axios from "axios";
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";

// components
import {Spinner} from "../../index";
import {API} from "../../../api/AWS-gateway";
import notify, {ISetNotofication} from "../../Toast";
import {AppContext} from "../../../context/app.context";
import {UserTypes} from "../../../reducers";
import {IDentistBio, IDentistLocations, IDentistServices, Null_Or_,} from "../../../reducers/types";
import {Layout} from "../../Layout/Layout";
import {ShowPassword} from "../../common/ShowPassword/ShowPassword";

export interface ILoginForm
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  api: string,
  resetPasswordUrl: string,
}

export interface ILoginResponse {
  token: string;
  userId: string;
  email: string;
  uid: string;
}

export interface IDentistFullDataResponse
  extends IDentistLocations,
    IDentistServices {
  bio: IDentistBio;
  avatar_url: Null_Or_<string>;
  cover_url: Null_Or_<string>;
  accountType: string;
}

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must Contain 8 Characters, 1 Number and 1 Symbol").required("Password is required"),
});

export const LoginForm: FC<ILoginForm> = ({title, api, resetPasswordUrl}) => {
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
            const {data} = await axios.post<ILoginResponse>(api, values);

            if (data.token) {
              localStorage.setItem("user", JSON.stringify(data));
              const fullData = await axios.get<IDentistFullDataResponse>(`${API.GET_DENTIST_FULL_DATA}?email=${values.email}`);

              dispatch({type: UserTypes.LOGIN, payload: fullData.data});

              setTimeout(() => {
                Router.push("/");
              }, 800);

              setNotification({
                type: "success",
                message: "Success! Please wait...",
                position: "top-right",
              });

            } else {
              setNotification({type: "error", message: "Server Internal Error"});
            }
          } catch (e: any) {
            setNotification({type: "error", message: 'Incorrect email or password'});
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
