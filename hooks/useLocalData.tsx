import React, {useContext, useEffect, useState} from "react";

// libs
import Router, {useRouter} from "next/router";
import axios from "axios";

// components
// import {IDentistFullDataResponse} from "../components";
import {API} from "../api/AWS-gateway";
import {
  AdminTypes,
  // TAdminReducerState,
  DentistTypes
} from "../reducers";
import {AppContext} from "../context/app.context";
import {
  IUserGallery,
  IService,
  // IAdminMonthStats,
  // IAdminYearStats
} from "../reducers/types";
import {filterAllServices} from "../utils/filterServices";
import {routes} from "../utils/routes";

// export interface IAdminFullDataResponse extends TAdminReducerState {
// }

export const useLocalData = () => {
  const {state, dispatch} = useContext(AppContext);
  const {isLogged, services, email: userEmail} = state.dentistState;
  const {isLoggedAdmin} = state.adminState;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const localState = JSON.parse(localStorage.getItem("dentist") as any);
    const localStateAmin = JSON.parse(localStorage.getItem("admin") as any);

    let email = null;
    if (localState) {
      email = localState && localState.bio.email;
      if (router.pathname.includes("admin")) Router.push(routes.home);
    }

    if (localStateAmin) {
      if (router.pathname.includes("dentist")) Router.push(routes.home);
      email = localStateAmin && localStateAmin.adminDetails.email;
    }

    if (!email && !isLogged && !isLoggedAdmin) {
      if (router.pathname !== routes.home) Router.push(routes.home);
    }

    if (email && !isLogged && !isLoggedAdmin) {
      setLoading(true);

      if (localState) {
        // axios.get<IDentistFullDataResponse>(`${API.GET_DENTIST_FULL_DATA}?email=${email}`)
        // .then((res) => {
        //   const {bio, avatar_url, locations, services, cover_url, accountType} = res.data;
        const {bio, avatar_url, locations, services, cover_url, accountType} = localState;
        // localStorage.setItem("dentist", JSON.stringify(res.data));
        localStorage.setItem("dentist", JSON.stringify(localState));
        localStorage.removeItem("admin");
        dispatch({
          type: DentistTypes.SET_FULL_DATA,
          payload: {
            ...bio,
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
      }
      if (localStateAmin) {
        // const fullData = await axios.get<IAdminFullDataResponse>(`${API.SETTINGS_FULL_INFO}?email=${email}`);
        dispatch({type: AdminTypes.ADMIN_LOGIN, payload: {...localStateAmin, isLoggedAdmin: true}});
        localStorage.setItem("admin", JSON.stringify(localStateAmin));
        localStorage.removeItem("dentist");
      }

      // try {
      // const { data } = await axios.get<IAdminMonthStats>(API.STAT_CUR_MONTHS);
      // dispatch({ type: AdminTypes.GET_MONTHLY_STATS, payload: { ...data } });
      // } catch (exp) {
      // setNotification({
      //   type: "error",
      //   message: "Failed to load monthly stats!",
      //   autoClose: 3,
      // });
      // }


      // try {
      //   const { data } = await axios.post<IAdminYearStats>(API.STAT_CUR_MONTHS, {
      //     year: "2021",
      //   });
      //   dispatch({ type: AdminTypes.GET_YEAR_STATS, payload: { ...data } });
      // } catch (exp) {
      //   setNotification({
      //     type: "error",
      //     message: "Failed to load yearly stats!",
      //     autoClose: 3,
      //   });

      setLoading(false);
      // })
      // .catch((exp) => {
      //   console.error(exp, 'error')
      //   Router.push(routes.login);
      // });
    }
  }, []);

  useEffect(() => {
    axios
      .get<IService[]>(`${API.DENTIST_SERVICES}`)
      .then(({data}) => {
        const allServices = filterAllServices(data, services);
        dispatch({
          type: DentistTypes.SET_ALL_SERVICES,
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
            type: DentistTypes.SET_GALLERY,
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
