import React, {useCallback, useContext} from "react";

// libs
import axios from "axios";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";

// components
import {API} from "../../../../api/AWS-gateway";
import {ILocationsAddResponse} from "../Locations";
import {UserLocation} from "../../../../reducers/types";
import {UserTypes} from "../../../../reducers";
import notify, {ISetNotofication} from "../../../Toast";
import {AppContext} from "../../../../context/app.context";
import cn from "classnames";

const LocationSchema = Yup.object().shape({
  town: Yup.string().required("Town is required"),
  address: Yup.string().required("Address is required"),
  post_code: Yup.number().required("Post Code is required"),
});
export const LocationForm = ({title, primary, locations}: any) => {
  const {state, dispatch} = useContext(AppContext);
  const {email, accountType} = state.userState;

  const setNotification = useCallback<ISetNotofication>(
    ({...notifyProps}) => {
      notify({...notifyProps});
    }, []);

  const handleAddLocation = (location: UserLocation) => dispatch({type: UserTypes.ADD_LOCATION, payload: {location}});

  const handleRemoveLocation = async (key: string) => {
    try {
      await axios.delete(`${API.SET_DENTIST_LOCATION}?key=${key}`);
      dispatch({type: UserTypes.REMOVE_LOCATION, payload: {id: key}});
      setNotification({
        type: "success",
        message: "successfully deleted location",
        autoClose: 2,
        position: "top-right",
      });
    } catch (exp) {
      setNotification({
        type: "error",
        message: "Please try again!",
        autoClose: 2,
        position: "top-right",
      });
    }
  };

  return <Formik
    validationSchema={LocationSchema}
    initialValues={{
      town: locations?.town || '',
      address: locations?.address || '',
      post_code: locations?.post_code || ''
    }}
    onSubmit={async (values) => {
      const locationsList = locations?.map((item) => item.location);
      const location = `${values.town}: ${values.address}, ${values.post_code}`;
      const body = {email, location};

      //check to unique
      if (locationsList?.includes(location)) {
        setNotification({type: "warning", message: "Location already exist!"});
        return;
      }
      try {
        const response = await axios.post<ILocationsAddResponse>(API.SET_DENTIST_LOCATION, body);
        const {data: {lat, lng, location, key}} = response;
        handleAddLocation({email: email || "", lat, lng, location, key});
        setNotification({
          type: "success",
          message: "successfully added location",
          autoClose: 2,
          position: "top-right",
        });
      } catch (exp) {
        setNotification({
          type: "error",
          message: "Please try again!",
          autoClose: 2,
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
          <Field className="form-profile-input" name="town" placeholder="Town/City" />
          {errors.town && touched.town ? (<div className='error-text'>{errors.town}</div>) : null}
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
          {!primary && locations?.town && <button
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
