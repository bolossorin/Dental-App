import React from "react";

// libs
import axios from "axios";
import Router from "next/router";
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";

// components
import {Spinner} from "../../";
import {API} from "../../../api/AWS-gateway";
import {ISetNotofication} from "../../Toast";
import {routes} from "../../../utils/routes";

export interface IValidateEmailForm {
  setNotification: ISetNotofication;
  registerValues: any;
}

export interface IValidateEmailFormChildren {
  code: string;
}

const validateEmailSchema = Yup.object().shape({
  code: Yup.string().max(18).required('Code is required')
});
export const ValidateEmail: React.FC<IValidateEmailForm> = ({setNotification, registerValues}) => {

  return (
    <Formik
      validationSchema={validateEmailSchema}
      initialValues={{code: ''}}
      onSubmit={async (values: IValidateEmailFormChildren, {resetForm}) => {
        const lambdaUrl = API.VERIFY_REGISTER;
        const bodyParams = {
          verify_code: values.code,
          email: registerValues.email,
          username: registerValues.name,
          gdc_number: registerValues.gdc,
        };
        try {
          const response = await axios.post(lambdaUrl, bodyParams);
          if (response.data) {
            setNotification({type: "info", message: "Redirecting to login...", autoClose: 5});
            setNotification({type: "success", message: "Confirmation code accepted!", autoClose: 3});
            resetForm();
            setTimeout(() => {
              Router.push(routes.login);
            }, 5000);
          }
        } catch (exp: any) {
          // setNotification({type: "error", message: "Incorrect code"});
        }
        Router.push(routes.login)
      }}>
      {({resetForm, errors, touched, isSubmitting}) =>
        <Form className="form-login">
          <p className="form-login-title green">Verify email</p>
          <p className="form-login-subtitle gray">Current FYD users</p>
          <div className="form-login-input">
            <Field name='code' placeholder='Code' readOnly={isSubmitting} />
            {errors.code && touched.code ? <p className='errorMessage'>{errors.code}</p> : null}
            {!isSubmitting && (<img
              className="form-login-input-close"
              src={"../images/close.svg"}
              onClick={() => resetForm({values: {code: ""}})}
              alt='' />)}
          </div>
          <div className="form-login-buttons">
            <button
              className="button-green-loginBtn"
              disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Verify"}
            </button>
          </div>
        </Form>}
    </Formik>
  );
};
