import React, {useContext, useEffect, useState} from "react";

// libs
import Router, {useRouter} from "next/router";

// components
import {DentistTypes} from "../reducers";
import {AppContext} from "../context/app.context";

import {routes} from "../utils/routes";
import {getDentistInfoAPI} from "../api/AWS-gateway";

export const useLocalData = () => {
  const router = useRouter();

  const {dispatch} = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const localDentistState = JSON.parse(localStorage.getItem("dentist") as any);
    localStorage.setItem("dentist", JSON.stringify(localDentistState));

    setLoading(true);
    if (localDentistState && localDentistState.access_token) {

      if (router.pathname.includes("admin")) Router.push(routes.home);
      const config = {headers: {Authorization: `Bearer ${localDentistState.access_token}`}};

      getDentistInfoAPI(config).then(({data}) => {
        const {avatarUrl, dentist_name, email, gdc} = data;
        localStorage.removeItem("admin");
        dispatch({
          type: DentistTypes.SET_FULL_DATA,
          payload: {
            ...localDentistState,
            username: dentist_name,
            email: email,
            gdcNumber: gdc,
            avatar_url: avatarUrl,
            isLogged: true,
            allowedServices: null,
            gallery: null,
          },
        });
      }).catch((error) => {
        console.error(error, 'error');
        Router.push(routes.login);
      });

      setLoading(false);
    } else {
      Router.push(routes.login);
    }
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
