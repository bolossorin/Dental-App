import React, {useContext, useEffect, useState} from "react";

// libs
import Router, {useRouter} from "next/router";

// components
import {DentistTypes} from "../reducers";
import {AppContext} from "../context/app.context";

import {routes} from "../utils/routes";
import {getDentistInfoAPI, getDentistServices} from "../api/AWS-gateway";

export const useLocalData = () => {
  const router = useRouter();

  const {dispatch} = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const access_token = JSON.parse(localStorage.getItem("access_token") as any);

    setLoading(true);
    if (access_token) {

      if (router.pathname.includes("admin")) Router.push(routes.home);
      const config = {headers: {Authorization: `Bearer ${access_token}`}};

      getDentistInfoAPI(config).then(({data}) => {
        getDentistServices(data.email).then((services: any) => {
          localStorage.removeItem("admin");
          const payload = {
            access_token: access_token,
            dentist_name: data.dentist_name,
            email: data.email,
            gdc: data.gdc,
            avatarUrl: data.avatarUrl,
            locations: data.locations,
            subscription_plan: data.subscription_plan,
            subscription_end_date: data.subscription_end_date,
            gallery: null,
            title: data.title,
            qualifications: data.qualifications,
            bio: data.bio,
            cover_url: "",
            phone: data.phone,
            services: services.data,
            website: data.website,
          };

          dispatch({type: DentistTypes.SET_FULL_DATA, payload: payload});
          localStorage.setItem("dentist", JSON.stringify(payload));
        })
      }).catch((error) => {
        console.error(error, 'error');
        Router.push(routes.login);
      });
    } else {
      if (router.pathname.includes("dentist")) Router.push(routes.login);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // const localStateAmin = JSON.parse(localStorage.getItem("admin") as any);
    // if (localStateAmin) {
    //   if (router.pathname.includes("dentist")) Router.push(routes.home);
    //   try {
    //     if (localStateAmin) {
    //       // const fullData = await axios.get<IAdminFullDataResponse>(`${API.SETTINGS_FULL_INFO}?email=${email}`);
    //       dispatch({type: AdminTypes.ADMIN_LOGIN, payload: {...localStateAmin, isLoggedAdmin: true}});
    //       localStorage.setItem("admin", JSON.stringify(localStateAmin));
    //       localStorage.removeItem("dentist");
    //     }
    //   } catch (exp) {
    //     Router.push(routes.login);
    //   }
    // } else {
    //   if (router.pathname !== routes.home) Router.push(routes.home);
    // }
  }, []);

  return {loading};
};
