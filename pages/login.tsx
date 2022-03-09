import React, { useState } from "react";
import type { NextPage } from "next";
import {
  Header,
  LoginForm,
  SandEmailForm,
  SandCodeForm,
} from "../components";
export type ISetStep = "login" | "sandEmail" | "sandCode";

const LoginPage: NextPage = (): JSX.Element => {
  const [step, setStep] = useState<ISetStep>("login");
  return (
    <>
      <section className="container-vh">
        <Header />
        {step === "login" && <LoginForm setStep={setStep} />}
        {step === "sandEmail" && <SandEmailForm setStep={setStep} />}
        {step === "sandCode" && <SandCodeForm setStep={setStep} />}
      </section>
    </>
  );
};

export default LoginPage;
