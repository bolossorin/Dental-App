import React, {useContext} from "react";

// libs
import type {NextPage} from "next";

// components
import {LayoutDentist} from "../../components/Layout/LayoutDentist/LayoutDentist";
import {AccountInfoBlock} from "../../components/Account/Info/Info";
import {Subscription} from "../../components/Account/Subscription/Subscription";
import {Upgrade} from "../../components/Account/Upgrade/Upgrade";
import {AppContext} from "../../context/app.context";

const AccountPage: NextPage = (): JSX.Element => {
  const {state} = useContext(AppContext);
  const {subscription_plan}: any = state.dentistState;


  return (
    <LayoutDentist>
      <AccountInfoBlock />
      {subscription_plan === 'FREE' ? <Upgrade /> : <Subscription />}
    </LayoutDentist>
  );
};

export default AccountPage;
