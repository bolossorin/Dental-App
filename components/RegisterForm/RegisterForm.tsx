import React, {useState, useCallback} from "react";

// libs
import {useForm} from "react-hook-form";

// components
import {Input} from "../Input/Input";
import {ValidateEmail} from "./ValidateEmailForm";
import notify, {ISetNotofication} from "../../components/Toast";
import {ShowPassword} from "../common/ShowPassword/ShowPassword";
import {Layout} from "../Layout/Layout";
import {StripeCheckout} from "../stripe/StripeCheckout/StripeCheckout";

export interface IRegisterFormChilds {
  name: string;
  email: string;
  gdc: number | "";
  password: string;
}

export const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    clearErrors,
    setValue,
    setError,
  } = useForm<IRegisterFormChilds>();
  const [nextStep, setNextStep] = useState<"cardCheck" | "emailCheck" | "register">("cardCheck");
  const [userData, setRegistratedValues] = useState<IRegisterFormChilds>();
  const [isPassHidden, setIsPassHidden] = useState<boolean>(true);

  const setNotification = useCallback<ISetNotofication>(
    ({...notifyProps}) => {
      notify({...notifyProps});
    },
    []
  );

  const switchToCardCheck = async (formData: IRegisterFormChilds) => {
    setRegistratedValues(formData);
    setNextStep("cardCheck");
  };

  return (
    <Layout>
      {nextStep === "register" && (<form
        onSubmit={handleSubmit(switchToCardCheck)}
        className="form-login">
        <p className="form-login-title green">Sign Up</p>
        <p className="form-login-subtitle gray">
          Create An Account with FYD
        </p>
        <div className="form-login-input">
          <Input
            {...register("name", {
              required: {value: true, message: "name is required"},
            })}
            error={errors.name}
            aria-invalid={!!errors.name}
            type="text"
            onInvalid={() => {
              setError("name", {message: "invalid name"});
            }}
            autoComplete="new-password"
            name="name"
            id="name"
            pattern="[A-Za-z]{1,28}"
            placeholder="name"
          />
          <img
            className="form-login-input-close"
            src={"../images/close.svg"}
            onClick={() => setValue("name", "")}
            alt='' />
        </div>
        <div className="form-login-input">
          <Input
            {...register("email", {
              required: {value: true, message: "email is required"},
            })}
            placeholder="email"
            error={errors.email}
            aria-invalid={!!errors.email}
            onInvalid={() => {
              setError("email", {message: "invalid email"});
            }}
            type="email"
            autoComplete="new-password"
            name="email"
            id="email"
          />
          <img
            className="form-login-input-close"
            src={"../images/close.svg"}
            onClick={() => setValue("email", "")}
            alt='' />
        </div>
        <div className="form-login-input">
          <Input
            {...register("gdc", {
              required: {value: true, message: "gdc is required"},
            })}
            placeholder="GDC number (this cannot be updated later) "
            error={errors.gdc}
            aria-invalid={!!errors.gdc}
            onInvalid={() => {
              setError("gdc", {message: "invalid gdc number"});
            }}
            type="text"
            autoComplete="new-password"
            name="gdc"
            id="gdc"
            pattern="[0-9]{5}"
            maxLength={5}
          />
          <img
            className="form-login-input-close"
            src={"../images/close.svg"}
            onClick={() => setValue("gdc", "")}
            alt='' />
        </div>
        <div className="form-login-input">
          <Input
            {...register("password", {
              required: {value: true, message: "password is required"},
            })}
            placeholder="password"
            error={errors.password}
            aria-invalid={!!errors.password}
            onInvalid={() => {
              setError("password", {
                message: "invalid password, min 8 symbols",
              });
            }}
            type={isPassHidden ? "password" : "text"}
            autoComplete="new-password"
            name="password"
            id="password"
            minLength={8}
          />
          <ShowPassword isPassHidden={isPassHidden} setIsPassHidden={setIsPassHidden} />
        </div>
        <div className="form-login-buttons">
          <button className="button-nextStep" onClick={() => clearErrors()}>
            Next Step
          </button>
        </div>
      </form>)}
      {nextStep === "cardCheck" && <StripeCheckout backButton setNextStep={setNextStep} />}
      {nextStep === "emailCheck" &&
      <ValidateEmail userData={userData as IRegisterFormChilds} setNotification={setNotification} />}
    </Layout>
  );
};
