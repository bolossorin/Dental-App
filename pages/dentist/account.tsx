import React, {useContext, useEffect, useState} from "react";

// libs
import type {NextPage} from "next";

// components
import {LayoutDentist} from "../../components/Layout/LayoutDentist/LayoutDentist";
import {AccountInfoBlock} from "../../components/Account/Info/Info";
import {Subscription} from "../../components/Account/Subscription/Subscription";
import {Upgrade} from "../../components/Account/Upgrade/Upgrade";
import {AppContext} from "../../context/app.context";
import {getSettingsPI} from "../../api/AWS-gateway";

const AccountPage: NextPage = (): JSX.Element => {
  const {state} = useContext(AppContext);
  const {subscription_plan, access_token}: any = state.dentistState;

  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("");

  useEffect(() => {
    if (access_token) {
      const config = {headers: {Authorization: `Bearer ${access_token}`}};
      getSettingsPI(config)
        .then(({data}) => {
          console.log(data, 'getSettingsPI')
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [access_token]);

  useEffect(() => {
    setSubscriptionPlan(subscription_plan)
  }, [subscription_plan])

  return (
    <LayoutDentist>
      <AccountInfoBlock />
      {subscriptionPlan === 'FREE'
        ? <Upgrade setSubscriptionPlan={setSubscriptionPlan} />
        : <Subscription subscriptionPlan={subscriptionPlan} setSubscriptionPlan={setSubscriptionPlan} />}
    </LayoutDentist>
  );
};

export default AccountPage;
