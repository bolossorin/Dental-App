import React from "react";

// libs
import type {NextPage} from "next";

// components
import {LayoutDentist} from "../../components/Layout/LayoutDentist/LayoutDentist";
import {AccountInfoBlock} from "../../components/Account/Info/Info";
import {AccountUpgradeBlock} from "../../components/Account/Upgrate/Upgrate";

const AccountPage: NextPage = (): JSX.Element => {
  return (
    <LayoutDentist>
      <AccountInfoBlock />
      <AccountUpgradeBlock />
    </LayoutDentist>
  );
};

export default AccountPage;
