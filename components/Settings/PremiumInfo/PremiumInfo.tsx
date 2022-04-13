import React, {useContext} from "react";

// libs
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";

// components
import {AppContext} from "../../../context/app.context";
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";

const getCurrency = (price: number) => {
  return new Intl.NumberFormat("en-IN", {style: "currency", currency: "GBP",}).format(price);
};

const premiumSchema = Yup.object().shape({
  pricePremiumInfo: Yup.string().matches(/^\d+$/, 'Only numbers').required("Price is required"),
  terms: Yup.string().required("Terms is required"),
});

const price = 3000;
const terms = 'https://fyd-dashboard.vercel.app';
export const PremiumInfo: React.FC = () => {
  const {state} = useContext(AppContext);
  const {subscriberSettings} = state.adminState;

  return (
    <ProfileBox title='Premium Information' subTitle='Information for Free Users'>
      <div className="box-2-box">
        <div className="profile-block-box">
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Premium Features</label>
            </p>
            {subscriberSettings[1] &&
            <div className='form-profile-features'>
              <p>Watermark</p>
              <p>Max Locations: {subscriberSettings[1].maxLocations}</p>
              <p>Max Services: {subscriberSettings[1].maxService}</p>
              {subscriberSettings[1].websiteAllowed && <p>Website Address</p>}
              {subscriberSettings[1].phoneAllowed && <p>Phone Number</p>}
              {subscriberSettings[1].appearVerifiedAllowed && <p>Appear Verified</p>}
            </div>}
          </div>
        </div>
        <Formik
          validationSchema={premiumSchema}
          initialValues={{pricePremiumInfo: price / 100, terms: terms}}
          onSubmit={async (values) => console.log(values, 'values')}>
          {({errors, touched}) =>
            <Form className="account-profile-block-box">
              <div>
                <p className="form-profile-label">
                  <label className="form-profile-label">Price ({getCurrency(0)})</label>
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
