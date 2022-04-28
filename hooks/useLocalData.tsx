import React, {useContext, useEffect, useState} from "react";

// libs
import Router, {useRouter} from "next/router";

// components
import {DentistTypes} from "../reducers";
import {AppContext} from "../context/app.context";

import {routes} from "../utils/routes";
import {getDentistGalleryApi, getDentistInfoApi, getDentistServicesApi, getSettingsApi} from "../api/AWS-gateway";

export const useLocalData = () => {
  const router = useRouter();

  const {dispatch} = useContext(AppContext);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const access_token = JSON.parse(localStorage.getItem("access_token") as any);
    const access_token_admin = JSON.parse(localStorage.getItem("access_token_admin") as any);

    setLoading(true);
    if (access_token) {
      if (router.pathname.includes("admin")) Router.push(routes.home);
      const config = {headers: {Authorization: `Bearer ${access_token}`}};
      getDentistInfoApi(config).then(({data}) => {
        getDentistServicesApi(data.gdc).then((services: any) => {
          getDentistGalleryApi(data.gdc)
            .then((gallery) => {
              getSettingsApi(config)
                .then((settings) => {
                  localStorage.removeItem("admin");
                  const payload = {
                    access_token: access_token,
                    dentist_name: data.dentist_name,
                    email: data.email,
                    gdc: data.gdc,
                    avatarUrl: data.avatarUrl,
                    watermarkUrl: data.watemark_public_url,
                    locations: data.locations,
                    subscription_plan: data.subscription_plan,
                    subscription_end_date: data.subscription_end_date,
                    gallery: gallery.data,
                    title: data.title,
                    qualifications: data.qualifications,
                    bio: data.bio,
                    phone: data.phone,
                    services: services.data,
                    website: data.website,
                    settings_account: settings.data
                  };
                  dispatch({type: DentistTypes.SET_FULL_DATA, payload: payload});
                  localStorage.setItem("dentist", JSON.stringify(payload));
                })
            });
        })
      }).catch((error) => {
        console.error(error, 'error');
        Router.push(routes.home);
      });
    } else if (access_token_admin) {
      if (router.pathname.includes("dentist")) Router.push(routes.home);
    } else {
      if (router.pathname.includes("dentist")) {
        Router.push(routes.login);
      } else if (router.pathname.includes("admin")) {
        Router.push(routes.loginAdmin);
      }
    }
    setLoading(false);
  }, []);

  return {loading};
};
