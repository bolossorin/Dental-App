import React from "react";

// components
import {Pricing} from "../components/Pricing/Pricing";
import {Layout} from "../components";

const PricingPage = () => {
  return (
    <Layout>
      <Pricing setNextStep={false} />
    </Layout>
  )
}

export default PricingPage;
