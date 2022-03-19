import React from "react";

// libs
import {Field} from "formik";

// components
import {Switch} from "../../../common/Switch/Switch";

export const Subscriber = ({type, title, subTitle, values, errors, touched}: any) => {

  return <div>
    <p className="form-login-title green px20">{title}</p>
    <p className="form-login-subtitle gray px12 mb-6px">{subTitle}</p>
    <div className="profile-block-box">
      <div className="double-blocks-3">
        <div>
          <p className="form-profile-label">
            <label className="form-profile-label">Max Locations</label>
          </p>
          <p className="form-profile-input-wrapper">
            <Field name={`${type}MaxLocations`} className="form-profile-input" />
            {errors[`${type}MaxLocations`] && touched[`${type}MaxLocations`] ?
              <p className='error-text'>{errors[`${type}MaxLocations`]}</p> : null}
          </p>
        </div>
        <div>
          <p className="form-profile-label">
            <label className="form-profile-label">Max Services</label>
          </p>
          <p className="form-profile-input-wrapper">
            <Field name={`${type}MaxServices`} className="form-profile-input" />
            {errors[`${type}MaxServices`] && touched[`${type}MaxServices`] ?
              <p className='error-text'>{errors[`${type}MaxServices`]}</p> : null}
          </p>
        </div>
      </div>
      <div className="double-blocks-3">
        <p className="form-profile-label">
          <label className="form-profile-label"> Website Address</label>
          <Switch
            name={`${type}HasWebsite`}
            onColor={'#095C5C'}
            values={values} />
        </p>
        <p className="form-profile-label">
          <label className="form-profile-label">Phone Number</label>
          <Switch
            name={`${type}HasPhoneNumber`}
            onColor={'#095C5C'}
            values={values} />
        </p>
        <p className="form-profile-label">
          <label className="form-profile-label">Appear Verified</label>
          <Switch
            name={`${type}IsVerified`}
            onColor={'#095C5C'}
            values={values} />
        </p>
      </div>
    </div>
  </div>
}
