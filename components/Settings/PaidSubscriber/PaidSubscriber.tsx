import React, {useCallback, useContext, useEffect, useState} from "react";

// libs
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {get} from "lodash";

// components
import {getLimitsApi, updateLimitsApi} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {AdminTypes} from "../../../reducers";
import {Subscriber} from "./Subscriber/Subscriber";

const subscriberSchema = Yup.object().shape({
  freeMaxLocations: Yup.string().matches(/^[0-9]$/, 'Invalid number').min(1).max(99).required("Field is required"),
  freeMaxServices: Yup.string().matches(/^[0-9]$/, 'Invalid number').min(1).max(99).required("Field is required"),
  paidMaxLocations: Yup.string().matches(/^[0-9]$/, 'Invalid number').min(1).max(99).required("Field is required"),
  paidMaxServices: Yup.string().matches(/^[0-9]$/, 'Invalid number').min(1).max(99).required("Field is required"),
});
export const PaidSubscriber: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);
  const [plan, setPlan] = useState("")
  const [settings, setSettings] = useState<any>({premium: {}, free: {}});

  const {access_token_admin, subscriberSettings} = state.adminState;

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token_admin');
    if (token) {
      const config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
      getLimitsApi(config)
        .then(({data}) => dispatch({type: AdminTypes.GET_SUBSCRIBER_SETTINGS, payload: data}))
        .catch((error) => console.error(error, 'error'));
    }
  }, [access_token_admin]);

  useEffect(() => {
    const free = subscriberSettings.filter((item) => item.subscription_type === 'FREE');
    const premium = subscriberSettings.filter((item) => item.subscription_type === 'PREMIUM');
    setSettings({premium: premium[0], free: free[0]})
  }, [subscriberSettings]);

  return (
    <Formik
      validationSchema={subscriberSchema}
      enableReinitialize
      initialValues={{
        freeMaxLocations: get(settings, 'free.maxLocations', ''),
        freeMaxServices: get(settings, 'free.maxService', ''),
        freeHasPhoneNumber: get(settings, 'free.phoneAllowed', ''),
        freeHasWebsite: get(settings, 'free.websiteAllowed', ''),
        freeIsVerified: get(settings, 'free.appearVerifiedAllowed', ''),
        paidMaxLocations: get(settings, 'premium.maxLocations', ''),
        paidMaxServices: get(settings, 'premium.maxService', ''),
        paidHasPhoneNumber: get(settings, 'premium.phoneAllowed', ''),
        paidHasWebsite: get(settings, 'premium.websiteAllowed', ''),
        paidIsVerified: get(settings, 'premium.appearVerifiedAllowed', ''),
      }}
      onSubmit={async (values) => {
        let body;
        if (plan === 'free') {
          body = {
            appearVerifiedAllowed: values.freeIsVerified,
            maxLocations: values.freeMaxLocations,
            maxService: values.freeMaxServices,
            phoneAllowed: values.freeHasPhoneNumber,
            subscription_type: "FREE",
            websiteAllowed: values.freeHasWebsite
          };
        }
        if (plan === 'paid') {
          body = {
            appearVerifiedAllowed: values.paidIsVerified,
            maxLocations: values.paidMaxLocations,
            maxService: values.paidMaxServices,
            phoneAllowed: values.paidHasPhoneNumber,
            subscription_type: "PREMIUM",
            websiteAllowed: values.paidHasWebsite
          };
        }
        try {
          const token = localStorage.getItem('access_token_admin');
          const config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
          const {data} = await updateLimitsApi(body, config);
          dispatch({type: AdminTypes.SET_SUBSCRIBER_SETTINGS, payload: data});
          setNotification({type: "success", message: "Successfully changed settings"});
        } catch (error: any) {
          setNotification({
            type: "error",
            message: Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message
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
              touched={touched}
              setPlan={setPlan} />
            <Subscriber
              type='paid'
              title='Paid Subscriber'
              subTitle='Set Limits'
              values={values}
              errors={errors}
              touched={touched}
              setPlan={setPlan} />
          </div>
        </Form>}
    </Formik>
  );
};
