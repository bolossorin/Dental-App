import React from "react";

// libs
import {NextPage} from "next";

// components
import {ChangePassword} from "../components";
import {routes} from "../utils/routes";
import {newPasswordByCodeApi} from "../api/AWS-gateway";

const ChangePasswordPage: NextPage = (): JSX.Element => {

  return (
    <ChangePassword
      title='Current FYD users'
      loginUrl={routes.login}
      newPasswordByCodeApi={newPasswordByCodeApi} />
  );
};

export default ChangePasswordPage;
