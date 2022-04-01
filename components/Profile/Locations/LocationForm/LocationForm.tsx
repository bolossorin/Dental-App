import React, {useCallback, useContext} from "react";

// libs
import axios from "axios";
import {Field, Form, Formik} from "formik";
import {get} from "lodash";
import * as Yup from "yup";

// components
import {API, getDentistLocations, setDentistLocation, updateDentistLocation} from "../../../../api/AWS-gateway";
// import {UserLocation} from "../../../../reducers/types";
import {DentistTypes} from "../../../../reducers";
import notify, {ISetNotofication} from "../../../Toast";
import {AppContext} from "../../../../context/app.context";
import cn from "classnames";

const LocationSchema = Yup.object().shape({
  location_name: Yup.string().required("Town is required"),
  address: Yup.string().required("Address is required"),
  post_code: Yup.number().typeError('Only numbers').required("Post Code is required"),
});
export const LocationForm = ({title, primary, locations, location}: any) => {
  const {state, dispatch} = useContext(AppContext);
  const {
    // email,
    accountType, access_token} = state.dentistState;

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const handleRemoveLocation = async (key: string) => {
    try {
      await axios.delete(`${API.SET_DENTIST_LOCATION}?key=${key}`);
      dispatch({type: DentistTypes.REMOVE_LOCATION, payload: {id: key}});
      setNotification({type: "success", message: "successfully deleted location", position: "top-right"});
    } catch (exp) {
      setNotification({type: "error", message: "Please try again!", position: "top-right"});
    }
  };

  return <Formik
    validationSchema={LocationSchema}
    enableReinitialize
    initialValues={{
      location_name: get(location, 'location_name', ''),
      address: get(location, 'address', ''),
      post_code: get(location, 'post_code', ''),
    }}
    onSubmit={async (values) => {
      try {
        const config = {headers: {Authorization: `Bearer ${access_token}`}};
        if (locations.length > 0) {
          //check to unique
          if (location.location_name === values.location_name &&
            location.address === values.address &&
            location.post_code === values.post_code) {
            setNotification({type: "warning", message: "Location already exist!"});
            return;
          }
          await updateDentistLocation(location.id, values, config);
        } else {
          await setDentistLocation(values, config);
        }
        setNotification({type: "success", message: "Successfully", position: "top-right"});
        getDentistLocations(config)
          .then(({data}) => dispatch({type: DentistTypes.SET_LOCATIONS, payload: {locations: data}}))
          .catch(error => setNotification({type: "error", message: error.response.data.message}));
      } catch (error: any) {
        setNotification({
          type: "error",
          message: Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message,
          position: "top-right",
        });
      }
    }}>
    {({values, errors, touched}) =>
      <Form
        className={cn("profile-block-box", "profile-block-box-noWrap", {"disabled": (!primary && accountType === 'free')})}>
        <div className="form-profile-label">
          <label className="form-profile-label">{title}</label>
        </div>
        <div className="row-content">
          <span className="input-span">Town/City</span>
          <Field className="form-profile-input" name="location_name" placeholder="Town/City" />
          {errors.location_name && touched.location_name ? (
            <div className='error-text'>{errors.location_name}</div>) : null}
        </div>
        <div className="row-content">
          <span className="input-span">Address</span>
          <Field className="form-profile-input" name="address" placeholder="Address" />
          {errors.address && touched.address ? (<div className='error-text'>{errors.address}</div>) : null}
        </div>
        <div className="row-content">
          <span className="input-span">Post Code</span>
          <Field className="form-profile-input" name="post_code" placeholder="Post Code" />
          {errors.post_code && touched.post_code ? (
            <div className='error-text'>{errors.post_code}</div>) : null}
        </div>
        <div className="account-form-login-buttons">
          {!primary && location?.location_name && <button
            className="button-green-confirm button-green-confirm-mod"
            type="button"
            onClick={() => handleRemoveLocation(values.post_code)}>
            Remove
          </button>}
          <button className="button-green-confirm button-green-confirm-mod" type="submit">
            Confirm
          </button>
        </div>
      </Form>}
  </Formik>
}
