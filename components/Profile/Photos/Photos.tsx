import React, {useCallback, useContext, useState} from "react";

// components
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {uploadDentistAvatarApi} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {DentistTypes} from "../../../reducers";
import {resizeFile} from "../../../utils/resizer";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";
import {Spinner} from "../../Spinner/Spinner";

export const Photos: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);
  const {avatarUrl, subscription_plan, access_token} = state.dentistState;
  const [avatarSrc, setAvatarSrc] = useState<any>("");
  const [isSubmitting, setIsSubmitting] = useState<any>(false);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const freeAccountLimit = subscription_plan === "FREE";

  const onProfileImageChange = async (e: any, what: "avatar" | "cover") => {
    setIsSubmitting(true);
    const file = e.target.files && e.target.files[0];
    const fileSize = file!.size / (1024 * 1024);
    try {
      if (fileSize > 2) {
        setNotification({type: "error", message: "Please change size of image"});
        return;
      } else {
        const image: any = await resizeFile(file, 300, 300, 90, 'blob');
        let formData = new FormData();
        formData.append('file', image);
        const config = {headers: {Authorization: `Bearer ${access_token}`}};
        if (what === "avatar") {
          const {data} = await uploadDentistAvatarApi(formData, config);
          const avatarUrl = data['avatarUrl'];
          setAvatarSrc(avatarUrl);
          dispatch({type: DentistTypes.SET_AVATAR_URL, payload: avatarUrl});
          setNotification({type: "success", message: "Successfully changed avatar image", position: "top-right"});
        }
      }
    } catch (error: any) {
      setNotification({type: "error", message: error.response.data.message})
    }
    setIsSubmitting(false);
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
              <img src={avatarSrc || avatarUrl || "../../../images/empty_avatar.png"} alt="profile image" />
            </p>
          </div>
          <p className="row-content">
            <label htmlFor='profile_picture' className="button-green-file">
              {isSubmitting ? <Spinner /> : "Upload"}
            </label>
            <input
              onChange={(e) => onProfileImageChange(e, "avatar")}
              type="file"
              className="input-file"
              accept="image/*"
              name="profile_picture"
              id="profile_picture" />
          </p>
        </div>
        <div className={`profile-block-box ${subscription_plan === "FREE" && "disabled"}`}>
          <p className="form-profile-label">
            <label className="form-profile-label ">Watermark {subscription_plan === 'FREE' && '- Premium'}</label>
          </p>
          <p className="profile-photo-box">
            <img
              className="image"
              src={"../images/empty-image.jpg"}
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
