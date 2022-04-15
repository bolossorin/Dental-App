import React, {useContext, useEffect} from "react";

//libs
import Router from "next/router";

// components
import {Layout} from "../components";
import {StripeCheckout} from "../components/stripe/StripeCheckout/StripeCheckout";
import {AppContext} from "../context/app.context";
import {routes} from "../utils/routes";

const Payment = (): JSX.Element => {
  const {state} = useContext(AppContext);
  const {subscription_plan} = state.dentistState;

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    if (subscription_plan === 'PREMIUM' || !accessToken) Router.push(routes.profile)
  }, [subscription_plan])
  return (
    <Layout footer>
      <StripeCheckout setSubscriptionPlan={false} />
    </Layout>
  );
};

export default Payment;
