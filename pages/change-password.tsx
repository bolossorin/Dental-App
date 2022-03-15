import React from "react";

// libs
import {NextPage} from "next";

// components
import {ChangePassword} from "../components";
import {routes} from "../utils/routes";
import {API} from "../api/AWS-gateway";

const ChangePasswordPage: NextPage = (): JSX.Element => {
  const loginUrl = routes.login;
  const api = API.PASSWORD_RESET_VERIFY;

  return <ChangePassword title='Current FYD users' loginUrl={loginUrl} api={api} />;
};

export default ChangePasswordPage;
