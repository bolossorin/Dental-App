import React from "react";

// components
import {Layout} from "../components";
import {StripeCheckout} from "../components/stripe/StripeCheckout/StripeCheckout";

const Payment = (): JSX.Element => {
  return (
    <Layout footer>
      <StripeCheckout />
    </Layout>
  );
};

export default Payment;
