import React from "react";

// libs
import type {NextPage} from "next";

// components
import {AdminSettings} from "../../components/Settings/Settings";
import {LayoutDentist} from "../../components/Layout/LayoutDentist/LayoutDentist";

const SettingsPage: NextPage = (): JSX.Element => {
  return (
    <LayoutDentist adminMenu>
      <AdminSettings />
    </LayoutDentist>
  );
};

export default SettingsPage;
