import { Input } from "../Input/Input";
import { Spinner } from "../index";
import { useForm } from "react-hook-form";
import { useState, useCallback, useContext } from "react";
import { DetailedHTMLProps, HTMLAttributes, FC } from "react";
import axios from "axios";
import Router from "next/router";
import { API } from "../../api/AWS-gateway";
import { ISetNotofication } from "../Toast";
import notify from "../Toast";
import { ISetStep } from "../../pages/login";
import { isValidEmail } from "../../utils/validateEmail";
import { expHandler } from "../../utils/exeptionHandler";
import { AppContext } from "../../context/app.context";
import { UserTypes } from "../../reducers/userReducer";
import {
  IDentistBio,
  IDentistLocations,
  IDentistServices,
  Null_Or_,
} from "../../reducers/types";

export interface ILoginForm
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setStep: (step: ISetStep) => void;
}

export interface ILoginFormChilds {
  login: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  userId: string;
  email: string;
  uid: string;
}

export interface IDentistFullDataResponse
  extends IDentistLocations,
    IDentistServices {
  bio: IDentistBio;
  avatar_url: Null_Or_<string>;
  cover_url: Null_Or_<string>;
  accountType: "free" | "premium";
}

export const LoginForm: FC<ILoginForm> = ({ setStep }) => {
  const { dispatch } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm<ILoginFormChilds>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPassHidden, hidePassword] = useState<boolean>(true);

  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const handleEmailValidation = (email: string) => {
    const isValid = isValidEmail(email);
    const validityChanged =
      (errors.login && isValid) || (!errors.login && !isValid);
    if (validityChanged) {
    }
    return isValid;
  };

  const onSubmit = async (formData: ILoginFormChilds) => {
    setLoading(true);
    try {
      const { data } = await axios.post<ILoginResponse>(API.LOGIN, {
        email: formData.login,
        password: formData.password,
      });
      if (data.token) {
        localStorage.setItem("currentUserTokens", JSON.stringify(data));
        dispatch({
          type: UserTypes.LOGIN,
          payload: {
            email: data.email,
          },
        });
        const fullData = await axios.get<IDentistFullDataResponse>(
          `${API.GET_DENTIST_FULL_DATA}?email=${formData.login}`
        );
        const { bio, avatar_url, locations, services, cover_url, accountType } =
          fullData.data;
        localStorage.setItem("previousState", JSON.stringify(fullData.data));
        dispatch({
          type: UserTypes.SET_FULL_DATA,
          payload: {
            ...bio,
            avatar_url,
            cover_url,
            locations,
            services,
            accountType,
            isLogged: true,
            allowedServices: null,
            gallery: null,
          },
        });
        Router.push("/");
        reset();
      } else {
        setNotification({ type: "error", message: "Server Internal Error" });
      }
    } catch (e: any) {
      const message = expHandler(e);
      setNotification({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="main bg-login main-height-full">
        <form onSubmit={handleSubmit(onSubmit)} className="form-login">
          <p className="form-login-title green">Login</p>
          <p className="form-login-subtitle gray">Current FYD users</p>
          <div className="form-login-input">
            <Input
              {...register("login", {
                required: { value: true, message: "Email is required" },
                validate: handleEmailValidation,
              })}
              error={errors.login}
              aria-invalid={errors.login ? true : false}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              type="email"
              name="login"
              id="email"
              placeholder="Email"
              readOnly={loading}
              autoComplete="new-password"
            />
            {!loading && (
              <img
                className="form-login-input-close"
                src="../images/close.svg"
                onClick={() => setValue("login", "")}
              />
            )}
          </div>
          <div className="form-login-input">
            <Input
              {...register("password", {
                required: { value: true, message: "Password is required" },
              })}
              placeholder="password"
              error={errors.password}
              aria-invalid={errors.password ? true : false}
              type={isPassHidden ? "password" : "text"}
              name="password"
              id="password"
              minLength={8}
              autoComplete="new-password"
              readOnly={loading}
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
            <button
              className="button-green-loginBtn"
              onClick={() => clearErrors()}
            >
              {loading ? <Spinner /> : "Login"}
            </button>
            <button
              className="button-green-ResetPassword"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                //resetPassword
                setStep("sandEmail");
                event.preventDefault();
              }}
              disabled={loading}
            >
              Reset password
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
