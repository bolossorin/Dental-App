import React, {useCallback, useContext} from "react";

// libs
import {Field, Form, Formik} from "formik";
import {get} from "lodash";
import * as Yup from "yup";
import cn from "classnames";

// components
import {deleteDentistLocationApi, setDentistLocationApi, updateDentistLocationApi} from "../../../../api/AWS-gateway";
import {DentistTypes} from "../../../../reducers";
import notify, {ISetNotofication} from "../../../Toast";
import {AppContext} from "../../../../context/app.context";
import {Spinner} from "../../../Spinner/Spinner";

const LocationSchema = Yup.object().shape({
  location_name: Yup.string().required("Town is required"),
  address: Yup.string().required("Address is required"),
  post_code: Yup.string().required("Post Code is required"),
});
export const LocationForm = ({title, index}) => {
  const {state, dispatch} = useContext(AppContext);
  const {locations, access_token} = state.dentistState;

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const handleRemoveLocation = async () => {
    try {
      const config = {headers: {Authorization: `Bearer ${access_token}`}};
      const {data} = await deleteDentistLocationApi(index - 1, config);
      dispatch({type: DentistTypes.SET_LOCATIONS, payload: data.Attributes.locations});
      setNotification({type: "success", message: "Successfully deleted location"});
    } catch (exp) {
      setNotification({type: "error", message: "Please try again!"});
    }
  };

  return <Formik
    validationSchema={LocationSchema}
    enableReinitialize
    initialValues={{
      location_name: get(locations, `[${index - 1}]location_name`, ''),
      address: get(locations, `[${index - 1}]address`, ''),
      post_code: get(locations, `[${index - 1}]post_code`, ''),
    }}
    onSubmit={async (values) => {
      try {
        const config = {headers: {Authorization: `Bearer ${access_token}`}};
        if (locations) {
          if (locations[index - 1] && locations[index - 1].location_name) {
            const {data} = await updateDentistLocationApi(index - 1, values, config);
            dispatch({type: DentistTypes.SET_LOCATIONS, payload: data.Attributes.locations});
          } else {
            const {data} = await setDentistLocationApi(values, config);
            dispatch({type: DentistTypes.SET_LOCATIONS, payload: data.locations});
          }
        }
        setNotification({type: "success", message: "Successfully"});
      } catch (error: any) {
        setNotification({
          type: "error",
          message: Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message
        });
      }
    }}>
    {({isSubmitting, errors, touched}) =>
      <Form
        className={cn("profile-block-box", "profile-block-box-noWrap")}>
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
        <div className="form-profile-buttons">
          {locations && locations[index - 1] && <button
            className="button-green-confirm"
            type="button"
            disabled={isSubmitting}
            onClick={handleRemoveLocation}>
            {isSubmitting ? <Spinner /> : "Remove"}
          </button>}
          <button className="button-green-confirm" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : "Confirm"}
          </button>
        </div>
      </Form>}
  </Formik>
}
