import React, {useCallback, useContext, useState} from "react";

// libs
import axios from "axios";

// components
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {API} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {DentistTypes} from "../../../reducers";
import {resizeFile} from "../../../utils/resizer";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";

export const Photos: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);
  const {email, avatar_url, cover_url, accountType} = state.dentistState;
  const [avatarSrc, setAvatarSrc] = useState<any>("");
  const [coverSrc, setCoverSrc] = useState<any>("");

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const freeAccountLimit = accountType === "free";

  const onProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>, what: "avatar" | "cover") => {
    const file = e.target.files && e.target.files[0];
    const fileSize = file!.size / (1024 * 1024);
    const fileFormat = file!.type.split("/")[1];
    try {
      if (file) {
        if (fileSize > 2) {
          setNotification({type: "error", message: "Please change size of image"});
          return;
        } else {
          const image = await resizeFile(file, 300, 300, 90);
          const stringFormat = image as string;
          const body = {
            email,
            file: {
              extension: fileFormat,
              value: stringFormat.split(",")[1],
            },
          };
          const url = {avatar: API.UPLOAD_DENTIST_AVATAR, cover: API.UPLOAD_DENTIST_COVER};
          await axios.post(url[what], body);
          if (what === "avatar") {
            setAvatarSrc(stringFormat);
            dispatch({type: DentistTypes.SET_AVATAR_URL, payload: {avatar_ul: stringFormat as string}});
            setNotification({
              type: "success",
              message: "Successfully changed avatar image",
              autoClose: 3,
              position: "top-right",
            });
            return;
          }
          if (what === "cover") {
            setCoverSrc(stringFormat);
            dispatch({type: DentistTypes.SET_COVER_URL, payload: {cover_ul: stringFormat as string}});
            setNotification({
              type: "success",
              message: "Successfully cover image",
              autoClose: 3,
              position: "top-right",
            });
            return;
          }
        }
      }
    } catch (exp) {
      setNotification({
        type: "error",
        message: "Error to upload image",
        autoClose: 5,
      });
    }
  };
  return (
    <ProfileLayout title='Display Photos' subTitle='Information For Patients'>
      <div className="box-2-box">
        <div className="profile-block-box">
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Profile Picture</label>
            </p>
            <p className="load-avatar__block">
              <img src={avatarSrc || avatar_url || "../../../images/empty_avatar.png"} alt="profile image" />
            </p>
          </div>
          <p className="row-content">
            <label className="button-green-file">Upload</label>
            <input
              onChange={(e) => onProfileImageChange(e, "avatar")}
              type="file"
              className="input-file"
              accept="image/*"
              name="profile_picture"
              id="profile_picture" />
          </p>
        </div>
        <div className={`profile-block-box ${accountType === "free" && "disabled"}`}>
          <p className="form-profile-label">
            <label className="form-profile-label ">Watermark {accountType === 'free' && '- Premium'}</label>
          </p>
          <p className="profile-photo-box">
            <img
              className="image"
              src={freeAccountLimit ? "../images/empty-image.jpg" : coverSrc || cover_url || "../images/empty-image.jpg"}
              alt="cover image" />
          </p>
          <p className={`row-content ${freeAccountLimit && "disabled"}`}>
            <label className="button-green-file" htmlFor="cover_image">
              Upload
            </label>
            <input
              onChange={(e) => onProfileImageChange(e, "cover")}
              type="file"
              accept="image/*"
              className="input-file"
              name="cover_image"
              id="cover_image"
              disabled={freeAccountLimit} />
          </p>
        </div>
      </div>
    </ProfileLayout>
  );
};
