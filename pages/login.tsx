import React from "react";

// libs
import type {NextPage} from "next";

// components
import {API} from "../api/AWS-gateway";
import {LoginForm} from "../components";
import {routes} from "../utils/routes";

const LoginPage: NextPage = (): JSX.Element => {
  const api = API.LOGIN;
  const resetPasswordUrl = routes.resetPassword;

  return <LoginForm title='Current FYD users' api={api} resetPasswordUrl={resetPasswordUrl} />;
};

export default LoginPage;
