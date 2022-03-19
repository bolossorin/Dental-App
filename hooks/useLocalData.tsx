import React, {useContext, useEffect, useState} from "react";

// libs
import Router from "next/router";
import axios from "axios";

// components
import {IDentistFullDataResponse} from "../components";
import {API} from "../api/AWS-gateway";
import {UserTypes} from "../reducers";
import {AppContext} from "../context/app.context";
import {IUserGallery, UserServices} from "../reducers/types";
import {filterAllServices} from "../utils/filterServices";

export const useLocalData = () => {
  const {state, dispatch} = useContext(AppContext);
  const {isLogged, services, email: userEmail, subscriberSettings, adminDetails, premiumInformation} = state.userState;
  const [loading, setLoading] = useState(false);
  // const router = useRouter();

  useEffect(() => {
    const localState = JSON.parse(localStorage.getItem("previousState") as any);
    const email = localState && localState.bio.email;

    // TODO: need uncomment when connect to backend
    // if (!email && !isLogged) if (router.pathname !== "/") Router.push("/");

    if (email && !isLogged) {
      setLoading(true);
      axios.get<IDentistFullDataResponse>(`${API.GET_DENTIST_FULL_DATA}?email=${email}`)
        .then((res) => {
          const {bio, avatar_url, locations, services, cover_url, accountType} = res.data;

          localStorage.setItem("previousState", JSON.stringify(res.data));
          dispatch({
            type: UserTypes.SET_FULL_DATA,
            payload: {
              ...bio,
              premiumInformation,
              adminDetails,
              subscriberSettings,
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
          setLoading(false);
        })
        .catch((exp) => {
          console.error(exp, 'error')
          Router.push("/login");
        });
    }
  }, []);

  useEffect(() => {
    axios
      .get<UserServices[]>(`${API.DENTIST_SERVICES}`)
      .then(({data}) => {
        const allServices = filterAllServices(data, services);
        dispatch({
          type: UserTypes.SET_ALL_SERVICES,
          payload: {
            allowedServices: allServices,
          },
        });
      })
      .catch((error) => {
        console.error(error, 'error');
      });
  }, [services]);

  useEffect(() => {
    if (isLogged) {
      axios
        .get<IUserGallery[]>(`${API.SET_DENTIST_GALLERY}?email=${userEmail}`)
        .then(({data}) => {
          dispatch({
            type: UserTypes.SET_GALLERY,
            payload: {
              gallery: data,
            },
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [isLogged]);

  return {loading};
};
