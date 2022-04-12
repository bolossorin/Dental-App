import React, {useEffect} from "react";

// libs
import type {NextPage} from "next";
import Router from "next/router";

// components
import {loginAdminApi} from "../../api/AWS-gateway";
import {LoginForm} from "../../components";
import {routes} from "../../utils/routes";


const LoginAdminPage: NextPage = (): JSX.Element => {
  const resetPasswordUrl = routes.resetPasswordAdmin;

  useEffect(() => {
    if (localStorage.getItem('access_token_admin')) Router.push(routes.settings)
  }, []);

  return <LoginForm title='Current FYD admins' loginApi={loginAdminApi} resetPasswordUrl={resetPasswordUrl} />;
};

export default LoginAdminPage;
