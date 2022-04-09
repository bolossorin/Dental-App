import React, {useState} from "react";

// components
import {Layout} from "../../Layout/Layout";
import {StripeCheckout} from "../../stripe/StripeCheckout/StripeCheckout";
import {Pricing} from "../../Pricing/Pricing";
import {Register} from "../Register/Register";

export interface IRegisterFormChildren {
  dentist_name: string;
  email: string;
  gdc: number | "";
  password: string;
}

export const Content: React.FC = () => {
  const [nextStep, setNextStep] = useState<"cardCheck" | "pricingCheck" | "register">("register");
  const [registerValues, setRegisterValues] = useState({email: '', dentist_name: '', secret_key: ''});
  return (
    <Layout>
      {nextStep === "register" && (<Register setNextStep={setNextStep} registerValues={registerValues} setRegisterValues={setRegisterValues}/>)}
      {nextStep === "pricingCheck" && <Pricing setNextStep={setNextStep} />}
      {nextStep === "cardCheck" && <StripeCheckout backButton setNextStep={setNextStep} />}
    </Layout>
  );
};
