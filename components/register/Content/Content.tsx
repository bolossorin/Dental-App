import React, {useState, useCallback} from "react";

// components
import {ValidateEmail} from "../ValidateEmail/ValidateEmail";
import notify, {ISetNotofication} from "../../Toast";
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
  const [nextStep, setNextStep] = useState<"cardCheck" | "pricingCheck" | "emailCheck" | "register">("register");
  const [registerValues, setRegisterValues] = useState<IRegisterFormChildren>();

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  return (
    <Layout>
      {nextStep === "register" && (<Register setRegisterValues={setRegisterValues} setNextStep={setNextStep} />)}
      {nextStep === "pricingCheck" && <Pricing setNextStep={setNextStep} />}
      {nextStep === "cardCheck" && <StripeCheckout backButton setNextStep={setNextStep} />}
      {nextStep === "emailCheck" && <ValidateEmail registerValues={registerValues} setNotification={setNotification} />}
    </Layout>
  );
};
