import React from "react";

// libs
import {NextPage} from "next";

// components
import {ResetPassword} from "../components";
import {routes} from "../utils/routes";
import {API} from "../api/AWS-gateway";

const ResetPasswordPage: NextPage = (): JSX.Element => {
  const loginUrl = routes.login;
  const changePasswordUrl = routes.changePassword;
  const api = API.PASSWORD_RESET;

  return (
    <ResetPassword
      title='Current FYD users'
      loginUrl={loginUrl}
      changePasswordUrl={changePasswordUrl}
      api={api} />
  );
};

export default ResetPasswordPage;
