import React, {useCallback, useContext, useState} from "react";

// libs
import {Field, Form, Formik} from "formik";
import Skeleton from "react-loading-skeleton";

// components
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {uploadDentistAvatarApi, uploadDentistWatermarkApi} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {DentistTypes} from "../../../reducers";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";
import {Spinner} from "../../Spinner/Spinner";
import {Upload} from "../../Galery/Uploads/After/After";
import {Crop} from "../../Galery/Uploads/Crop/Crop";
import {getSrcImage, handleImgChange} from "../../../utils/handleImgChange";

export const Photos: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);
  const {avatarUrl, watermarkUrl, subscription_plan, access_token} = state.dentistState;
  const [img, setImg] = useState<File | null>(null);
  const [avatarUpload, setAvatarUpload] = useState<File | null>(null);
  const [coverUpload, setCoverUpload] = useState<File | null>(null);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  return (
    <ProfileLayout title='Display Photos' subTitle='Information For Patients'>
      {subscription_plan ? <div className="box-2-box">
        <Formik initialValues={{profile_picture: ''}} onSubmit={async () => {
          const fileSize = img!.size / (1024 * 1024);
          try {
            if (fileSize > 2) {
              setNotification({type: "error", message: "Please change size of image"});
              return;
            } else {
              let formData = new FormData();
              formData.append('file', img!);
              const config = {headers: {Authorization: `Bearer ${access_token}`}};
              const {data} = await uploadDentistAvatarApi(formData, config);
              const avatarUrl = data['avatarUrl'];
              dispatch({type: DentistTypes.SET_AVATAR_URL, payload: avatarUrl});
              setNotification({type: "success", message: "Successfully changed avatar image", position: "top-right"});
            }
          } catch (error: any) {
            setNotification({type: "error", message: error.response.data.message})
          } finally {
            setAvatarUpload(null);
            setCoverUpload(null);
          }
        }}>
          {({isSubmitting}) =>
            <Form className="profile-block-box avatar">
              <div>
                <div className="form-profile-label">
                  <label className="form-profile-label">Profile Picture</label>
                </div>
                {avatarUpload ? <Crop
                    aspect={1}
                    onSubmitButton
                    isSubmitting={isSubmitting}
                    setImg={setImg}
                    getSrcImage={getSrcImage(avatarUpload)}
                    setImgUpload={setAvatarUpload} />
                  : <div className="load-avatar__block">
                    <img src={avatarUrl || "../../../images/empty_avatar.png"} alt="profile image" />
                  </div>}
              </div>
              <div className="row-content">
                {!avatarUpload && <label htmlFor='profile_picture' className="button-green-file">
                  {isSubmitting ? <Spinner /> : "Upload"}
                </label>}
                <Field
                  type="file"
                  className="input-file"
                  accept="image/*"
                  name="profile_picture"
                  id="profile_picture"
                  onChange={(e) => handleImgChange(e, setNotification, setAvatarUpload)} />
              </div>
            </Form>}
        </Formik>
        <Formik initialValues={{cover_image: ''}} onSubmit={async (values) => {
          console.log(values, 'values');
          console.log(values, 'values');
          const fileSize = img!.size / (1024 * 1024);
          try {
            if (fileSize > 2) {
              setNotification({type: "error", message: "Please change size of image"});
              return;
            } else {
              let formData = new FormData();
              formData.append('file', img!);
              const config = {headers: {Authorization: `Bearer ${access_token}`}};
              const {data} = await uploadDentistWatermarkApi(formData, config);
              const watermarkUrl = data['watemark_public_url'];
              dispatch({type: DentistTypes.SET_WATERMARK_URL, payload: watermarkUrl});
              setNotification({type: "success", message: "Successfully changed watermark", position: "top-right"});
            }
          } catch (error: any) {
            setNotification({type: "error", message: error.response.data.message})
          } finally {
            setAvatarUpload(null);
            setCoverUpload(null);
          }
        }}>
          {({isSubmitting}) =>
            <Form className={`profile-block-box ${subscription_plan === "FREE" && "disabled"}`}>
              <div className="form-profile-label">
                <label className="form-profile-label ">Watermark {subscription_plan === 'FREE' && '- Premium'}</label>
              </div>
              <div className="profile-photo-box">
                {coverUpload ? <Crop
                    aspect={2}
                    onSubmitButton
                    isSubmitting={isSubmitting}
                    setImg={setImg}
                    getSrcImage={getSrcImage(coverUpload)}
                    setImgUpload={setCoverUpload} />
                  : <img className="image" src={watermarkUrl || "../images/empty-image.jpg"} alt="cover image" />}
              </div>
              <div className={`row-content ${(subscription_plan === "FREE") && "disabled"}`}>
                {!coverUpload && <label className="button-green-file" htmlFor="cover_image">
                  {isSubmitting ? <Spinner /> : "Upload"}
                </label>}
                <Field
                  type="file"
                  className="input-file"
                  accept="image/*"
                  name="cover_image"
                  id="cover_image"
                  disabled={subscription_plan === "FREE"}
                  onChange={(e) => handleImgChange(e, setNotification, setCoverUpload)} />
              </div>
            </Form>}
        </Formik>
      </div> : <Skeleton count={5} height="5vh" />}
    </ProfileLayout>
  );
};
