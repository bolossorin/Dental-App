import axios from "axios";
import { useCallback, useContext, useState } from "react";
import { API } from "../../../api/AWS-gateway";
import { AppContext } from "../../../context/app.context";
import { ISetNotofication } from "../../Toast";
import notify from "../../Toast";
import { useForm } from "react-hook-form";

interface AccountInfoBlockProps {}

interface AccountFormChild {
  oldPassword: string;
  newPassword: string;
}

export const AccountInfoBlock: React.FC<AccountInfoBlockProps> = () => {
  const { state } = useContext(AppContext);
  const { email, gdcNumber } = state.userState;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormChild>();

  const [canDelete, setCanDelete] = useState(false);

  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const handleDeleteAccount = async () => {
    if (canDelete) {
      try {
        await axios.delete(`${API.DELETE_ACCOUNT}?email=${email}`);
      } catch (exp) {
        setNotification({
          type: "error",
          message: "Error to delete account, please try again!",
        });
      }
    }
    if (!canDelete) {
      setNotification({
        type: "warning",
        message: "Please check your consent and try deleting again!",
      });
    }
  };

  const handleResetPasword = async (data: AccountFormChild) => {
    const { oldPassword, newPassword } = data;
    const body = {
      email,
      oldPassword,
      newPassword,
    };
    try {
      await axios.post(API.ACCOUNT_RESET_PASSWORD, body);
      setNotification({
        type: "success",
        message: "Successfully changed password!",
        position: "top-right",
        autoClose: 2,
      });
    } catch (exp) {
      setNotification({
        type: "warning",
        message: "Error to reset password account, please try again!",
      });
    }
  };

  return (
    <>
      <div className="account-profile-box-form">
        <div className="account-form-info-block">
          <div>
            <p className="account-form-login-title">Account Information</p>
            <p className="account-form-login-subtitle">Login Details</p>
          </div>
        </div>
        <div className="account-box-2-box">
          <div className="account-profile-block-box">
            <div>
              <div className="account-form-profile-label">
                <label className="account-form-profile-label" htmlFor="email">
                  Account Email
                </label>
              </div>
              <div>
                <input
                  className="account-form-profile-input"
                  type="email"
                  name="email"
                  id="email"
                  disabled
                  onChange={() => {}}
                  value={email as string}
                  placeholder="John.smith@dental.co.uk"
                />
              </div>
            </div>

            <div>
              <div className="account-form-profile-label">
                <label
                  className="account-form-profile-label"
                  htmlFor="gdc_number"
                >
                  GDC Number
                </label>
              </div>
              <div>
                <input
                  className="account-form-profile-input"
                  type="text"
                  name="gdc_number"
                  id="gdc_number"
                  value={gdcNumber as number}
                  placeholder="12345678"
                  onChange={() => {}}
                  disabled
                />
              </div>
            </div>

            <div>
              <div className="account-form-profile-label ">
                <label className="account-form-profile-label" htmlFor="delete">
                  Delete Account
                </label>
              </div>
              <div className="account-checkbox">
                <input
                  type="checkbox"
                  name="delete"
                  id="delete"
                  value={""}
                  checked={!!canDelete}
                  onChange={() => {
                    setCanDelete(!canDelete);
                  }}
                />
                <span className="account-checkbox-text">
                  I acknowledge that by deleting my account, my profile and
                  information will be permanently deleted.
                </span>
              </div>
            </div>
            <div className="account-form-login-buttons">
              <button
                className="account-button-green"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
          <form
            className="account-profile-block-box"
            onSubmit={handleSubmit(handleResetPasword)}
          >
            <div>
              <div className="account-form-profile-label">
                <label className="account-form-profile-label">
                  Reset Password
                </label>
              </div>
              <div className="account-row-content">
                <span className="account-input-span">Current</span>{" "}
                <input
                  className="account-form-profile-input"
                  {...register("oldPassword", {
                    required: {
                      value: true,
                      message: "password is required",
                    },
                  })}
                  type="text"
                  name="oldPassword"
                  id="oldPassword"
                  placeholder="old password"
                />
              </div>{" "}
              {(errors.oldPassword?.message || errors.oldPassword?.type) && (
                <p className="account-error-text">
                  {" "}
                  {errors.oldPassword?.message || "Invalid password"}
                </p>
              )}
              <div className="account-row-content">
                <span className="input-span">New</span>{" "}
                <input
                  className="account-form-profile-input"
                  {...register("newPassword", {
                    required: {
                      value: true,
                      message: "new password is required",
                    },
                  })}
                  type="text"
                  name="newPassword"
                  id="newPassword"
                  placeholder="new password"
                />
              </div>
              {(errors.newPassword?.message || errors.newPassword?.type) && (
                <p className="account-error-text">
                  {" "}
                  {errors.newPassword?.message || "Invalid new password"}
                </p>
              )}
            </div>
            <div className="account-row-content">
              <span className="account-input-span"></span>
              <button className="account-button-green" type="submit">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
