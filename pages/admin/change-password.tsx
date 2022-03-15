import React from "react";

// libs
import {NextPage} from "next";

// components
import {ChangePassword} from "../../components";
import {routes} from "../../utils/routes";
import {API} from "../../api/AWS-gateway";

const ChangePasswordAdminPage: NextPage = (): JSX.Element => {
  const loginUrl = routes.loginAdmin;
  const api = API.PASSWORD_RESET_VERIFY_ADMIN;

  return <ChangePassword title='Current FYD admins' loginUrl={loginUrl} api={api} />;
};

export default ChangePasswordAdminPage;
