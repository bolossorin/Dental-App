import axios from "axios";
import { useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { API } from "../../../api/AWS-gateway";
import { AppContext } from "../../../context/app.context";
import { UserTypes } from "../../../reducers";
import { ISetNotofication } from "../../Toast";
import notify from "../../Toast";
import Link from "next/link";
interface BioFormChilds {
  title: string;
  name: string;
  email: string;
  qualifications: string;
  profileBio: string;
  website: string;
  phone: string;
  accountType:string;
}
interface IBioResponse {
  title: string;
  username: string;
  qualifications: string;
  profileBio: string;
  email?: string;
  website?: string | null;
  phone?: string | null;
}

export const Bio: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const {
    email,
    username,
    title,
    accountType,
    profileBio,
    qualifications,
    website,
    phone,
  } = state.userState;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BioFormChilds>();

  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const handleConfirn = async (formData: BioFormChilds) => {
    const { phone, website } = formData;

    const body: IBioResponse = {
      title: formData.title || "Dr",
      email: formData.email,
      username: formData.name,
      profileBio: formData.profileBio,
      qualifications: formData.qualifications,
      phone,
      website,
    };
    try {
      const { data } = await axios.post<IBioResponse>(
        API.SET_DENTIST_INFORMATION,
        body
      );
      dispatch({
        type: UserTypes.SET_INFO,
        payload: {
          email: formData.email,
          profileBio: data.profileBio,
          qualifications: data.qualifications,
          title: data.title,
          username: data.username,
          phone: data.phone || undefined,
          website: data.website || undefined,
        },
      });
      setNotification({
        type: "success",
        message: "Successfully updated dentist Bio!",
        autoClose: 2,
        position: "top-right",
      });
    } catch (exp) {
      setNotification({
        type: "error",
        message: "Please try again!",
        autoClose: 2,
        position: "top-right",
      });
    }
  };
  return (
    <>
      <div className="profile-box-form">
        <div className="form-info-block">
          <div>
            <p className="form-bio-title green px20">
              Bio and Contact Information
            </p>
            <p className="form-bio-subtitle gray px12 mb-6px">
              Information For Patients
            </p>
          </div>
          {accountType === "free" && (
            <div className="upgrade-button-bio">
              <Link href={"/purchase"}>
                <button className="button-green-outline">Upgrade</button>
              </Link>
            </div>
          )}
        </div>
        <div className="box-2-box">
          <div className="profile-block-box">
            <div className="double-blocks">
              <div>
                <span className="form-profile-label">
                  <label className="form-profile-label" htmlFor="title">
                    Title
                  </label>
                </span>
                <span>
                  <input
                    {...register("title", {
                      required: {
                        value: true,
                        message: "title is required, e.g. Dr",
                      },
                      value: title || "",
                      pattern: /(^[A-Za-z]{2,10})/,
                    })}
                    className="form-profile-input"
                    type="text"
                    name="title"
                    id="title"
                    maxLength={10}
                    placeholder="Dr."
                    onChange={() => {}}
                  />
                  {(errors.title?.message || errors.title?.type) && (
                    <p className="error-text">
                      {" "}
                      {errors.title?.message || "Invalid title, e.g. Dr"}
                    </p>
                  )}
                </span>
              </div>
              <div>
                <span className="form-profile-label">
                  <label className="form-profile-label" htmlFor="name">
                    Name
                  </label>
                </span>
                <span>
                  <input
                    {...register("name", {
                      required: {
                        value: true,
                        message: "name is required, e.g. John Doe",
                      },
                      value: username || "",
                      pattern:
                        /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/,
                    })}
                    className="form-profile-input"
                    type="text"
                    name="name"
                    id="name"
                    onChange={() => {}}
                    placeholder={"name"}
                  />
                  {(errors.name?.message || errors.name?.type) && (
                    <p className="error-text">
                      {" "}
                      {errors.name?.message || "Invalid name, e.g. John Doe"}
                    </p>
                  )}
                </span>
              </div>
            </div>
            <div>
              <span className="form-profile-label">
                <label className="form-profile-label" htmlFor="email">
                  Contact Email
                </label>
              </span>
              <span>
                <input
                  {...register("email", {
                    value: email || "",
                    pattern:
                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  })}
                  className="form-profile-input"
                  type="email"
                  readOnly={true}
                  onChange={() => {}}
                  name="email"
                  id="email"
                  placeholder="John.smith@dental.co.uk"
                />
                {(errors.email?.message || errors.email?.type) && (
                  <p className="error-text">Invalid email</p>
                )}
              </span>
            </div>

            <div>
              <span className="form-profile-label">
                <label className="form-profile-label" htmlFor="Qualifications">
                  Qualifications
                </label>
              </span>
              <span>
                <input
                  {...register("qualifications", {
                    value: qualifications || "",
                  })}
                  className="form-profile-input"
                  onChange={() => {}}
                  type="text"
                  name="qualifications"
                  id="qualifications"
                  maxLength={80}
                  placeholder="Notes Here"
                />
              </span>
            </div>
            <div>
              <span className="form-profile-label">
                <label className="form-profile-label" htmlFor="profile_bio">
                  Profile Bio
                </label>
              </span>
              <span>
                <textarea
                  {...register("profileBio", {
                    value: profileBio || "",
                  })}
                  className="form-profile-input"
                  name="profileBio"
                  id="profileBio"
                  onChange={() => {}}
                  cols={30}
                  maxLength={80}
                  rows={3}
                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
                ></textarea>
              </span>
              <span className="form-login-buttons-confirm">
                <button
                  className="button-green-confirm"
                  onClick={handleSubmit(handleConfirn)}
                >
                  Confirm
                </button>
              </span>
            </div>
          </div>
          <div
            className={`profile-block-box ${
              accountType === "free" && "disabled"
            }`}
          >
            <div>
              <span className="form-profile-label ">
                <label className="form-profile-label  " htmlFor="website">
                  Website Address - Premium
                </label>
              </span>
              <span>
                <input
                  {...register("website", {
                    required: {
                      value: true,
                      message: "website is required, e.g. dental.com",
                    },
                    value: website || "",
                    pattern:
                      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
                    disabled: accountType !== "premium",
                  })}
                  className="form-profile-input"
                  type="text"
                  name="website"
                  onChange={() => {}}
                  id="website"
                  placeholder="dental.co.uk"
                  disabled={accountType !== "premium"}
                />
                {(errors.website?.message || errors.website?.type) && (
                  <p className="error-text">
                    {errors.website?.message || "Invalid Website"}
                  </p>
                )}
              </span>
            </div>
            <div>
              <span className="form-profile-label">
                <label className="form-profile-label " htmlFor="phone">
                  Phone - Premium
                </label>
              </span>
              <span>
                <input
                  {...register("phone", {
                    required: {
                      value: true,
                      message: "phone is required, e.g. 7777 777 7777",
                    },
                    pattern: /^(0|[1-9]\d*)$/,
                    value: phone || "",
                    disabled: accountType !== "premium",
                  })}
                  className="form-profile-input"
                  type="text"
                  onChange={() => {}}
                  maxLength={11}
                  name="phone"
                  id="phone"
                  placeholder="0203 123 4567"
                  disabled={accountType !== "premium"}
                />
                {(errors.phone?.message || errors.phone?.type) && (
                  <p className="error-text">
                    {errors.phone?.message || "Invalid phone"}
                  </p>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
