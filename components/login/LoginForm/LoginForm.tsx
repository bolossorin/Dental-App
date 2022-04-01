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

export interface ILoginForm
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  loginApi: any,
  resetPasswordUrl: string,
}

export interface IDentistFullDataResponse
  extends IDentistLocations,
    IServices {
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
              localStorage.removeItem("dentist");
            } else {
              localStorage.setItem("dentist", JSON.stringify(values));
              localStorage.removeItem("admin");
              // const fullData = await axios.get<IDentistFullDataResponse>(`${API.GET_DENTIST_FULL_DATA}?email=${values.email}`);
              dispatch({type: DentistTypes.LOGIN, payload: {email: values.email}});
            }

            let fullDataAdmin;
            let fullData = {
              access_token: data.access_token,
              bio: {
                title: '',
                username: data.dentist_name,
                email: data.email,
                gdcNumber: 12345,
                qualifications: '',
                profileBio: '',
                website: '',
                phone: '',
              },
              avatar_url: '',
              locations: [
                {
                  key: '',
                  location: '',
                  email: '',
                  lat: 51.2042666,
                  lng: 0.1149085
                },
              ],
              services: [
                {
                  key: '1',
                  service_name: '',
                  service_id: '',
                },
              ],
              cover_url: '',
              accountType: "free"
            }

            if (title === 'Current FYD admins') {
              fullDataAdmin = {
                adminDetails: {username: 'John Doe', email: values.email, avatar_url: '../images/doctor1.png'},
                services: [
                  {
                    key: '1',
                    service_name: 'Teeth Whitening',
                    service_id: 'Teeth Whitening',
                  },
                  {
                    key: '2',
                    service_name: 'Veneers',
                    service_id: 'Veneers',
                  },
                ],
                premiumInformation: {
                  features: ['Verification Checkmark'],
                  price: 0,
                  setting_code: "",
                  terms: ""
                },
                subscriberSettings: {
                  freeHasPhoneNumber: false,
                  freeHasWebsite: false,
                  freeIsVerified: false,
                  freeMaxLocations: 1,
                  freeMaxServices: 1,
                  paidHasPhoneNumber: false,
                  paidHasWebsite: false,
                  paidIsVerified: false,
                  paidMaxLocations: 1,
                  paidMaxServices: 1,
                  setting_code: "",
                },
                monthlyStats: {
                  amountOfNewAccounts: 0,
                  amountOfSubscriptions: 0,
                  amountOfClosedAccounts: 0,
                  amountOfClosedSubscriptions: 0,
                  amountOfImages: 0,
                },
                yearStats: {
                  amountOfNewAccounts: 0,
                  amountOfSubscriptions: 0,
                  amountOfClosedAccounts: 0,
                  amountOfClosedSubscriptions: 0,
                  amountOfImages: 0,
                  graphicOfFreeAccounts: [],
                  graphicOfSubscriptions: [],
                },
              };
              const {
                adminDetails,
                services,
                premiumInformation,
                subscriberSettings,
                monthlyStats,
                yearStats
              } = fullDataAdmin;
              localStorage.setItem("admin", JSON.stringify(fullDataAdmin));
              dispatch({
                type: AdminTypes.ADMIN_LOGIN,
                payload: {
                  adminDetails,
                  services,
                  premiumInformation,
                  subscriberSettings,
                  monthlyStats,
                  yearStats,
                  isOpenLeftMenu: true,
                  isLoggedAdmin: true,
                },
              });

              setTimeout(() => {
                Router.push(routes.dashboard);
              }, 800);
            } else {
              const {bio, avatar_url, locations, services, cover_url, accountType} = fullData;
              localStorage.setItem("dentist", JSON.stringify(fullData));
              dispatch({
                type: DentistTypes.SET_FULL_DATA,
                payload: {
                  ...bio,
                  avatar_url,
                  cover_url,
                  locations,
                  services,
                  accountType,
                  isLogged: true,
                  allowedServices: null,
                  gallery: null,
                },
              });

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
