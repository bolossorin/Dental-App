import React, {useEffect} from "react";

// libs
import type {NextPage} from "next";
import Router from "next/router";

// components
import {loginDentistApi} from "../api/AWS-gateway";
import {LoginForm} from "../components";
import {routes} from "../utils/routes";

const LoginPage: NextPage = (): JSX.Element => {
  const resetPasswordUrl = routes.resetPassword;

  useEffect(() => {
    if (localStorage.getItem('access_token')) Router.push(routes.account)
  }, []);

  return <LoginForm title='Current FYD users' loginApi={loginDentistApi} resetPasswordUrl={resetPasswordUrl} />;
};

export default LoginPage;
