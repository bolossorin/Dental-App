import { Input } from "../Input/Input";
import ValidateCard from "./CheckCardForm";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { API } from "../../api/AWS-gateway";
import axios from "axios";
import { ValidateEmail } from "./ValidateEmailForm";
import notify, { ISetNotofication } from "../../components/Toast";
import { expHandler } from "../../utils/exeptionHandler";

export interface IRegisterFormChilds {
  name: string;
  email: string;
  gdc: number | "";
  password: string;
}

export interface IRegisterResponse {
  username: string;
  userConfirmed: boolean;
}

export const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
    setError,
  } = useForm<IRegisterFormChilds>();
  const [nextStep, setNextStep] = useState<
    "cardCheck" | "emailCheck" | "register"
  >("register");
  const [userData, setRegistratedValues] = useState<IRegisterFormChilds>();
  const [isPassHidden, hidePassword] = useState<boolean>(true);

  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const onInvalid = (message: string) => {
    setNotification({ type: "error", message });
  };

  const switchToCardCheck = async (formData: IRegisterFormChilds) => {
    setRegistratedValues(formData);
    setNextStep("cardCheck");
  };

  const onSubmit = async () => {
    try {
      const { data } = await axios.post<IRegisterResponse>(API.REGISTER, {
        username: userData?.name,
        email: userData?.email,
        gdcNumber: userData?.gdc,
        password: userData?.password,
      });
      if (data) {
        setNextStep("emailCheck");
        reset();
      }
    } catch (e: any) {
      const message = expHandler(e);
      setNotification({ type: "error", message });
    }
  };

  return (
    <>
      <div className="main bg-login main-height-full">
        {nextStep === "register" && (
          <form
            onSubmit={handleSubmit(switchToCardCheck)}
            className="form-login"
          >
            <p className="form-login-title green">Sign Up</p>
            <p className="form-login-subtitle gray">
              Create An Account with FYD
            </p>
            <div className="form-login-input">
              <Input
                {...register("name", {
                  required: { value: true, message: "name is required" },
                })}
                error={errors.name}
                aria-invalid={errors.name ? true : false}
                type="text"
                onInvalid={() => {
                  setError("name", { message: "invalid name" });
                }}
                autoComplete="new-password"
                name="name"
                id="name"
                pattern="[A-Za-z ]{1,28}"
                placeholder="name"
              />
              <img
                className="form-login-input-close"
                src="../images/close.svg"
                onClick={() => setValue("name", "")}
              />
            </div>
            <div className="form-login-input">
              <Input
                {...register("email", {
                  required: { value: true, message: "email is required" },
                })}
                placeholder="email"
                error={errors.email}
                aria-invalid={errors.email ? true : false}
                onInvalid={() => {
                  setError("email", { message: "invalid email" });
                }}
                type="email"
                autoComplete="new-password"
                name="email"
                id="email"
              />
              <img
                className="form-login-input-close"
                src="../images/close.svg"
                onClick={() => setValue("email", "")}
              />
            </div>
            <div className="form-login-input">
              <Input
                {...register("gdc", {
                  required: { value: true, message: "gdc is required" },
                })}
                placeholder="GDC number (this cannot be updated later) "
                error={errors.gdc}
                aria-invalid={errors.gdc ? true : false}
                onInvalid={() => {
                  setError("gdc", { message: "invalid gdc number" });
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
                src="../images/close.svg"
                onClick={() => setValue("gdc", "")}
              />
            </div>
            <div className="form-login-input">
              <Input
                {...register("password", {
                  required: { value: true, message: "password is required" },
                })}
                placeholder="password"
                error={errors.password}
                aria-invalid={errors.password ? true : false}
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
              {!isPassHidden && (
                <img
                  className="form-login-input-eye"
                  src="../images/eye-blocked.svg"
                  onClick={() => hidePassword(true)}
                />
              )}
              {isPassHidden && (
                <img
                  className="form-login-input-eye"
                  src="../images/eye.svg"
                  onClick={() => hidePassword(false)}
                />
              )}
            </div>
            <div className="form-login-buttons">
              <button className="button-nextStep" onClick={() => clearErrors()}>
                Next Step
              </button>
            </div>
          </form>
        )}
        {nextStep === "cardCheck" && (
          <ValidateCard
            username={userData?.name || "John"}
            onSubmit={onSubmit}
            onCancel={() => {
              setNextStep("register");
            }}
            setNotification={setNotification}
          />
        )}
        {nextStep === "emailCheck" && (
          <ValidateEmail
            userData={userData as IRegisterFormChilds}
            setNotification={setNotification}
          />
        )}
      </div>
    </>
  );
};
