import {useContext} from "react";

// libs
import Router from "next/router";

// components
import {AppContext} from "../context/app.context";
import {AdminTypes, DentistTypes} from "../reducers";
import {routes} from "../utils/routes";

export const useLogout = () => {
  const {dispatch} = useContext(AppContext);
  const logOut = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("dentist");

    localStorage.removeItem("access_token_admin");
    localStorage.removeItem("admin");

    dispatch({type: DentistTypes.LOGOUT});
    dispatch({type: AdminTypes.ADMIN_LOGOUT});

    Router.push(routes.home);
  };

  return [logOut];
};
