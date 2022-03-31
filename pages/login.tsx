import React from "react";

// libs
import type {NextPage} from "next";

// components
import {loginDentistApi} from "../api/AWS-gateway";
import {LoginForm} from "../components";
import {routes} from "../utils/routes";

const LoginPage: NextPage = (): JSX.Element => {
  const resetPasswordUrl = routes.resetPassword;

  return <LoginForm title='Current FYD users' loginApi={loginDentistApi} resetPasswordUrl={resetPasswordUrl} />;
};

export default LoginPage;
