import React from "react";

// libs
import {NextPage} from "next";

// components
import {ResetPassword} from "../../components";
import {routes} from "../../utils/routes";
import {API} from "../../api/AWS-gateway";

const ResetPasswordAdminPage: NextPage = (): JSX.Element => {
  const loginUrl = routes.loginAdmin;
  const changePasswordUrl = routes.changePasswordAdmin;
  const api = API.PASSWORD_RESET_ADMIN;

  return (
    <ResetPassword
      title='Current FYD admins'
      loginUrl={loginUrl}
      changePasswordUrl={changePasswordUrl}
      api={api} />
  );
};

export default ResetPasswordAdminPage;
