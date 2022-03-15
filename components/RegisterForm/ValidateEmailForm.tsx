import {Input} from "../Input/Input";
import {IRegisterFormChilds, Spinner} from "../index";
import {useForm} from "react-hook-form";
import {useState} from "react";
import axios from "axios";
import Router from "next/router";
import {API} from "../../api/AWS-gateway";
import {ISetNotofication} from "../Toast";

export interface IValidateEmailForm {
  setNotification: ISetNotofication;
  userData: IRegisterFormChilds;
}

export interface IValidateEmailFormChilds {
  code: string;
}

export const ValidateEmail: React.FC<IValidateEmailForm> = ({setNotification, userData,}) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    clearErrors,
    setValue
  } = useForm<IValidateEmailFormChilds>();

  const [loading, setLoading] = useState<boolean>(false);

  const onVerify = async (formData: IValidateEmailFormChilds) => {
    const lambdaUrl = API.VERIFY_REGISTER;
    const bodyParams = {
      verify_code: formData.code,
      email: userData.email,
      username: userData.name,
      gdc_number: userData.gdc,
    };
    try {
      setLoading(true);
      const response = await axios.post(lambdaUrl, bodyParams);

      if (response.data) {
        setLoading(false);
        setNotification({
          type: "info",
          message: "Redirecting to login...",
          autoClose: 5,
        });
        setNotification({
          type: "success",
          message: "Confirmation code accepted!",
          autoClose: 3,
        });
        reset();
        setTimeout(() => {
          Router.push("/login");
        }, 5000);
      }
    } catch (exp: any) {
      setNotification({type: "error", message: "Incorrect code"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onVerify)} className="form-login">
        <p className="form-login-title green">Verify email</p>
        <p className="form-login-subtitle gray">Current FYD users</p>
        <div className="form-login-input">
          <Input
            {...register("code", {required: {value: true, message: "code is required"}})}
            error={errors.code}
            aria-invalid={!!errors.code}
            type="text"
            autoComplete=""
            name="code"
            id="code"
            placeholder="code"
            maxLength={18}
            readOnly={loading} />
          {!loading && (<img
            className="form-login-input-close"
            src={"../images/close.svg"}
            onClick={() => setValue("code", "")}
            alt='' />)}
        </div>
        <div className="form-login-buttons">
          <button
            className="button-green-loginBtn"
            onClick={() => clearErrors()}
            disabled={loading}>
            {loading ? <Spinner /> : "Verify"}
          </button>
        </div>
      </form>
    </>
  );
};
