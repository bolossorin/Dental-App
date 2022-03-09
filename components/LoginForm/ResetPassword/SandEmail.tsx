import { Input } from "../../Input/Input";
import { Spinner } from "../../index";
import { useForm } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import { DetailedHTMLProps, HTMLAttributes, FC } from "react";
import axios from "axios";
import { API } from "../../../api/AWS-gateway";
import { ISetNotofication } from "../../Toast";
import notify from "../../Toast";
import { ISetStep } from "../../../pages/login";
import { isValidEmail } from "../../../utils/validateEmail";
import { expHandler } from "../../../utils/exeptionHandler";

export interface ISandEmailForm
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setStep: (step: ISetStep) => void;
}

export interface ISandEmailFormChilds {
  login: string;
  password: string;
}

export interface ISandEmailFormResponse {
  message: string;
  statusCode: number;
}

export const SandEmailForm: FC<ISandEmailForm> = ({ setStep }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm<ISandEmailFormChilds>();
  const [loading, setLoading] = useState<boolean>(false);

  const setNotification = useCallback<ISetNotofication>(
    ({ type, message, position, autoClose }) => {
      notify({ type, message, position, autoClose });
    },
    []
  );

  useEffect(() => {
    const message =
      "Enter your email address, we will send a verification code";
    setNotification({
      type: "info",
      message,
      position: "bottom-right",
      autoClose: 8,
    });
  }, []);

  const handleEmailValidation = (email) => {
    const isValid = isValidEmail(email);
    const validityChanged =
      (errors.login && isValid) || (!errors.login && !isValid);
    if (validityChanged) {
    }
    return isValid;
  };

  const onSubmit = async (formData: ISandEmailFormChilds) => {
    setLoading(true);
    try {
      const { data } = await axios.post<ISandEmailFormResponse>(
        API.PASSWORD_RESET,
        { email: formData.login }
      );
      if (data) {
        localStorage.setItem("resetPasswordEmail", formData.login);
        setNotification({
          type: "success",
          message: data.message,
          position: "bottom-center",
          autoClose: 10,
        });
        setStep("sandCode");
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
          <p className="form-login-title green">Reset password</p>
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
            />
            {!loading && (
              <img
                className="form-login-input-close"
                src="../images/close.svg"
                onClick={() => setValue("login", "")}
              />
            )}
          </div>
          <div className="form-login-buttons">
            <button
              className="button-green-loginBtn"
              onClick={() => clearErrors()}
            >
              {loading ? <Spinner /> : "get code"}
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
