import React, {useContext, useEffect, useState} from "react";

// libs
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {get} from "lodash";

// components
import {AppContext} from "../../../context/app.context";
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {getCurrency} from "../../../utils/cardOptions";
import {getPriceApi} from "../../../api/AWS-gateway";

const premiumSchema = Yup.object().shape({
  pricePremiumInfo: Yup.string().matches(/^\d+$/, 'Only numbers').required("Price is required"),
  terms: Yup.string().required("Terms is required"),
});

const terms = 'https://fyd-dashboard.vercel.app';
export const PremiumInfo: React.FC = () => {
  const {state} = useContext(AppContext);
  const {subscriberSettings} = state.adminState;

  const [settings, setSettings] = useState<any>({premium: {}});
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    const premium = subscriberSettings.filter((item) => item.subscription_type === 'PREMIUM');
    setSettings({premium: premium[0]})
  }, [subscriberSettings]);

  useEffect(() => {
    getPriceApi(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID)
      .then(({data}) => setPrice(data))
      .catch((error) => console.log(error, 'error'));
  }, []);

  return (
    <ProfileBox title='Premium Information' subTitle='Information for Free Users'>
      <div className="box-2-box">
        <div className="profile-block-box">
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Premium Features</label>
            </p>
            <div className='form-profile-features'>
              <p>Verified Badge</p>
              <p>Watermark</p>
              <p>Max Locations: {get(settings, 'premium.maxLocations', '')}</p>
              <p>Max Services: {get(settings, 'premium.maxService', '')}</p>
              {get(settings, 'premium.websiteAllowed', '') && <p>Website Address</p>}
              {get(settings, 'premium.phoneAllowed', '') && <p>Phone Number</p>}
              {get(settings, 'premium.appearVerifiedAllowed', '') && <p>Appear Verified</p>}
            </div>
          </div>
        </div>
        <Formik
          enableReinitialize
          validationSchema={premiumSchema}
          initialValues={{pricePremiumInfo: price, terms: terms}}
          onSubmit={async (values) => console.log(values, 'values')}>
          {({errors, touched}) =>
            <Form className="account-profile-block-box">
              <div>
                <p className="form-profile-label">
                  <label className="form-profile-label">Price ({getCurrency(price, 0)})</label>
                </p>
                <div className="account-row-content">
                  <Field disabled className="form-profile-input" name='pricePremiumInfo' />
                  {errors.pricePremiumInfo && touched.pricePremiumInfo ?
                    <p className='error-text'>{errors.pricePremiumInfo}</p> : null}
                </div>
              </div>
              <div>
                <p className="form-profile-label">
                  <label className="form-profile-label">Terms and Conditions</label>
                </p>
                <div className="account-row-content">
                  <Field disabled className="form-profile-input" name="terms" placeholder="Web Link" />
                  {errors.terms && touched.terms ?
                    <p className='error-text'>{errors.terms}</p> : null}
                </div>
              </div>
              <div className='account-form-login-buttons'>
                <button type='submit' className="account-button-green">Save</button>
              </div>
            </Form>}
        </Formik>
      </div>
    </ProfileBox>
  );
};
