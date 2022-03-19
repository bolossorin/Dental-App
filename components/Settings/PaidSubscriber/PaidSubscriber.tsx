import React, {useCallback, useContext} from "react";

// libs
import axios from "axios";
import {Formik, Form} from "formik";

// components
import {API} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {UserTypes} from "../../../reducers";
import {ISubSettings} from "../../../reducers/types";
import {Subscriber} from "./Subscriber/Subscriber";
import * as Yup from "yup";

const subscriberSchema = Yup.object().shape({
  freeMaxLocations: Yup.string().matches(/^[0-9]$/, 'Invalid number').min(1).max(99).required("Field is required"),
  freeMaxServices: Yup.string().matches(/^[0-9]$/, 'Invalid number').min(1).max(99).required("Field is required"),
  paidMaxLocations: Yup.string().matches(/^[0-9]$/, 'Invalid number').min(1).max(99).required("Field is required"),
  paidMaxServices: Yup.string().matches(/^[0-9]$/, 'Invalid number').min(1).max(99).required("Field is required"),
});
export const PaidSubscriber: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);

  const {
    freeMaxLocations,
    freeMaxServices,
    freeHasPhoneNumber,
    freeHasWebsite,
    freeIsVerified,
    paidMaxLocations,
    paidMaxServices,
    paidHasPhoneNumber,
    paidHasWebsite,
    paidIsVerified,
  } = state.userState.subscriberSettings;

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  return (
    <Formik
      validationSchema={subscriberSchema}
      initialValues={{
        freeMaxLocations: freeMaxLocations,
        freeMaxServices: freeMaxServices,
        freeHasWebsite: freeHasWebsite,
        freeHasPhoneNumber: freeHasPhoneNumber,
        freeIsVerified: freeIsVerified,
        paidMaxLocations: paidMaxLocations,
        paidMaxServices: paidMaxServices,
        paidHasWebsite: paidHasWebsite,
        paidHasPhoneNumber: paidHasPhoneNumber,
        paidIsVerified: paidIsVerified,
      }}
      onSubmit={async (values) => {
        const body = {
          setting_code: "sys_settings",
          free: {
            maxLocations: values.freeMaxLocations,
            maxServices: values.freeMaxServices,
            hasWebsite: values.freeHasWebsite,
            hasPhoneNumber: values.freeHasPhoneNumber,
            isVerified: values.freeIsVerified,
          },
          paid: {
            maxLocations: values.paidMaxLocations,
            maxServices: values.paidMaxServices,
            hasWebsite: values.paidHasWebsite,
            hasPhoneNumber: values.paidHasPhoneNumber,
            isVerified: values.paidIsVerified,
          },
        };
        try {
          const {data} = await axios.post<ISubSettings>(API.SETTINGS_CHANGE, body);
          dispatch({type: UserTypes.GET_SUBSCRIBER_SETTINGS, payload: {...data}});
          setNotification({
            type: "success",
            message: "Successfully changed settings",
            autoClose: 3,
            position: "top-right",
          });
        } catch (error) {
          console.log(error, 'error');
          setNotification({
            type: "error",
            message: "Failed to change settings",
            autoClose: 3,
          });
        }
      }}>
      {({values, errors, touched}) =>
        <Form className="profile-box-form">
          <div className="form-info-block-paid">
            <Subscriber
              type='free'
              title='Free Subscriber'
              subTitle='Set Limits'
              values={values}
              errors={errors}
              touched={touched} />
            <Subscriber
              type='paid'
              title='Paid Subscriber'
              subTitle='Set Limits'
              values={values}
              errors={errors}
              touched={touched} />
          </div>
          <div className='account-form-login-buttons'>
            <button className="account-button-green" type="submit">
              Apply
            </button>
          </div>
        </Form>}
    </Formik>
  );
};
