import React from "react";

// libs
import {NextPage} from "next";

// components
import {ResetPassword} from "../components";
import {routes} from "../utils/routes";

const ResetPasswordPage: NextPage = (): JSX.Element => {
  const loginUrl = routes.login;
  const changePasswordUrl = routes.changePassword;

  return (
    <ResetPassword title='Current FYD users' loginUrl={loginUrl} changePasswordUrl={changePasswordUrl} />
  );
};

export default ResetPasswordPage;
