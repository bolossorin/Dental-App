import { Input } from "../../Input/Input";
import { Spinner } from "../../index";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { DetailedHTMLProps, HTMLAttributes, FC } from "react";
import axios from "axios";
import { API } from "../../../api/AWS-gateway";
import { ISetNotofication } from "../../Toast";
import notify from "../../Toast";
import { ISetStep } from "../../../pages/login";
import { expHandler } from "../../../utils/exeptionHandler";

export interface ISandCodeForm
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setStep: (step: ISetStep) => void;
}

export interface ISandCodeFormChilds {
  code: string;
  password: string;
  confirmPassword: string;
}

export interface ISandCodeFormResponse {
  token: string;
  userId: string;
}

export const SandCodeForm: FC<ISandCodeForm> = ({ setStep }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
    setError,
  } = useForm<ISandCodeFormChilds>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPassHidden, hidePassword] = useState<boolean>(true);

  const setNotification = useCallback<ISetNotofication>(
    ({ type, message, position, autoClose }) => {
      notify({ type, message, position, autoClose });
    },
    []
  );

  const onSubmit = async (formData: ISandCodeFormChilds) => {
    const { code, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      setError("confirmPassword", {
        message: "password not equal to confirmPassword",
      });
      return;
    }
    setLoading(true);
    try {
      const email = localStorage.getItem("resetPasswordEmail");
      const body = {
        email,
        verify_code: code,
        newPassword: password,
      };
      const { data } = await axios.post<ISandCodeFormResponse>(
        API.PASSWORD_RESET_VERIFY,
        { ...body }
      );
      if (data) {
        setStep("login");
        reset();
      } else {
        setNotification({ type: "error", message: "Server Internal Error" });
      }
    } catch (e: any) {
      const message = expHandler(e);
      setNotification({ type: "error", message: "Incorrect code!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="main bg-login main-height-full">
        <form onSubmit={handleSubmit(onSubmit)} className="form-login">
          <p className="form-login-title green">New password</p>
          <p className="form-login-subtitle gray">Current FYD users</p>
          <div className="form-login-input">
            <Input
              {...register("code", {
                required: { value: true, message: "Email is required" },
              })}
              error={errors.code}
              aria-invalid={errors.code ? true : false}
              type="text"
              name="code"
              id="code"
              placeholder="Code"
              readOnly={loading}
            />
            {!loading && (
              <img
                className="form-login-input-close"
                src="../images/close.svg"
                onClick={() => setValue("code", "")}
              />
            )}
          </div>
          <div className="form-login-input">
            <Input
              {...register("password", {
                required: { value: true, message: "password is required" },
              })}
              placeholder="new password"
              error={errors.password}
              aria-invalid={errors.password ? true : false}
              type={isPassHidden ? "password" : "text"}
              autoComplete="current-password"
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
          <div className="form-login-input">
            <Input
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "confirmPassword is required",
                },
              })}
              placeholder="confirm new password"
              error={errors.confirmPassword}
              aria-invalid={errors.confirmPassword ? true : false}
              type={isPassHidden ? "password" : "text"}
              autoComplete="current-password"
              name="confirmPassword"
              id="confirmPassword"
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
            <button
              className="button-green-loginBtn"
              onClick={() => clearErrors()}
            >
              {loading ? <Spinner /> : "reset"}
            </button>
            <button
              className="button-green-ResetPassword"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                setStep("login");
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
