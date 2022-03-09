import { useContext } from "react";
import Router from "next/router";
import { AppContext } from "../context/app.context";
import { UserTypes } from "../reducers";

export const useLogout = (callback?: Function, path?: string) => {
  const { dispatch } = useContext(AppContext);

  const logOut = async () => {
    sessionStorage.removeItem("userInfo");
    localStorage.removeItem("previousState");
    dispatch({
      type: UserTypes.LOGOUT,
    });
    if (callback) callback();
    Router.push(path || "/");
  };

  return [logOut];
};
