import React from "react";

// libs
import type {NextPage} from "next";

// components
import {API} from "../../api/AWS-gateway";
import {LoginForm} from "../../components";
import {routes} from "../../utils/routes";


const LoginAdminPage: NextPage = (): JSX.Element => {
  const api = API.LOGIN_ADMIN;
  const resetPasswordUrl = routes.resetPasswordAdmin;

  return <LoginForm title='Current FYD admins' api={api}  resetPasswordUrl={resetPasswordUrl}/>;
};

export default LoginAdminPage;
