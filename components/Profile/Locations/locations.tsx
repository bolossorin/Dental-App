import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { API } from "../../../api/AWS-gateway";
import { AppContext } from "../../../context/app.context";
import { UserTypes } from "../../../reducers";
import { ISetNotofication } from "../../Toast";
import notify from "../../Toast";
import { UserLocation } from "../../../reducers/types";
import Link from "next/link";

interface LocationsProps {}

export interface ILocationsAddResponse {
  email: string;
  lat: number;
  lng: number;
  location: string;
  key: string;
}

interface LocationChilds {
  town: string;
  adress: string;
  postcode: string;
}

const Locations: React.FC<LocationsProps> = () => {
  const { state, dispatch } = useContext(AppContext);
  const { email, accountType, locations } = state.userState;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationChilds>();

  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const freeAccountLimit =
    accountType === "free" && locations?.length && locations.length >= 2;

  const handleRemoveLocation = async (key: string) => {
    try {
      await axios.delete(`${API.SET_DENTIST_LOCATION}?key=${key}`);
      dispatch({
        type: UserTypes.REMOVE_LOCATION,
        payload: { id: key },
      });
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

  const handleAddLocation = (location: UserLocation) => {
    dispatch({
      type: UserTypes.ADD_LOCATION,
      payload: {
        location,
      },
    });
  };

  const onSubmit = async (data: LocationChilds) => {
    const locationsList = locations?.map((item) => item.location);
    const location = `${data.town}: ${data.adress}, ${data.postcode}`;
    const body = {
      email,
      location,
    };

    //check to unique
    if (locationsList?.includes(location)) {
      setNotification({
        type: "warning",
        message: "Location already exist!",
      });
      return;
    }

    try {
      const response = await axios.post<ILocationsAddResponse>(
        API.SET_DENTIST_LOCATION,
        body
      );
      const {
        data: { lat, lng, location, key },
      } = response;
      handleAddLocation({
        email: email || "",
        lat,
        lng,
        location,
        key,
      });
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
  };

  return (
    <>
      <div className="profile-box-form">
        <div className="form-info-block">
          <div>
            <p className="form-login-title green px20">Locations</p>
            <p className="form-login-subtitle gray px12 mb-6px">
              Information For Patients
            </p>
          </div>
          {accountType === "free" && (
            <div className="upgrade-button-bio">
              <Link href={"/purchase"}>
                <button className="button-green-outline">Upgrade</button>
              </Link>
            </div>
          )}
        </div>

        <div className="box-2-box">
          <form className="profile-block-box" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="form-profile-label">
                <label className="form-profile-label">Add Location</label>
              </div>
              <div className="row-content">
                <span className="input-span">Town/City</span>
                <input
                  {...register("town", {
                    required: {
                      value: true,
                      message: "*",
                    },
                  })}
                  className="form-profile-input"
                  type="text"
                  name="town"
                  id="town"
                  required
                  placeholder="Cambridge"
                />
                {(errors.town?.message || errors.town?.type) && (
                  <p className="error-text-location">
                    {errors.town?.message || "invalid town"}
                  </p>
                )}
              </div>
              <div className="row-content">
                <span className="input-span">Address</span>{" "}
                <input
                  {...register("adress", {
                    required: {
                      value: true,
                      message: "*",
                    },
                  })}
                  className="form-profile-input"
                  required
                  type="text"
                  name="adress"
                  id="adress"
                  placeholder="1 Dental Row"
                />
                {(errors.adress?.message || errors.adress?.type) && (
                  <p className="error-text-location">
                    {errors.adress?.message || "invalid town"}
                  </p>
                )}
              </div>
              <div className="row-content">
                <span className="input-span">Post Code</span>{" "}
                <input
                  {...register("postcode", {
                    required: {
                      value: true,
                      message: "*",
                    },
                  })}
                  className="form-profile-input"
                  required
                  type="text"
                  name="postcode"
                  id="postcode"
                  placeholder="CB1 2AB"
                />
                {(errors.postcode?.message || errors.postcode?.type) && (
                  <p className="error-text-location">
                    {errors.postcode?.message || "invalid town"}
                  </p>
                )}
              </div>
            </div>

            <div className="row-content">
              <span className="input-span"></span>
              <button
                className="button-green-confirm"
                type="submit"
                disabled={!!freeAccountLimit}
              >
                Confirm
              </button>
            </div>
          </form>
          <div
            className={`profile-block-box ${
              accountType === "free" && "disabled"
            }`}
          >
            <div>
              <div className="form-profile-label">
                <label className="form-profile-label">Locations</label>
              </div>
              {locations?.length ? (
                locations.map((item, idx) => {
                  return (
                    <div className="form-login-input" key={item.key}>
                      <input
                        type="text"
                        name="adress1"
                        value=""
                        id="adress1"
                        placeholder={item.location}
                        onChange={() => {}}
                      />
                      <img
                        className="form-login-input-close"
                        src="../images/close.svg"
                        onClick={() => {
                          handleRemoveLocation(item.key);
                        }}
                      />
                    </div>
                  );
                })
              ) : (
                <div></div>
              )}
              {/* <div className='form-profile-empty-input'>
                <input
                  type='text'
                  name='empty'
                  value=''
                  readOnly
                  id='empty'
                  placeholder=''
                  onChange={() => {}}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Locations;
