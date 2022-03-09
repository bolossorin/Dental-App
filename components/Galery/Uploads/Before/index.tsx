import { useCallback, useContext, useEffect, useState } from "react";
import { ISetNotofication } from "../../../Toast";
import notify from "../../../Toast";
import { Crop } from "../Crop/crop";
import { resizeFile } from "../../../../utils/resizer";

interface UploadBeforeProps {
  onBeforeSaveCrop: (src: string) => void;
  beforeImg: File | string;
  setBeforeImg: (src: File | string) => void;
  formParams: any;
  disableEdit: boolean;
  noCrop?: boolean;
}

export const UploadBefore: React.FC<UploadBeforeProps> = ({
  onBeforeSaveCrop,
  beforeImg,
  setBeforeImg,
  formParams,
  disableEdit,
  noCrop,
}) => {
  const {
    register,
    formState: { errors },
  } = formParams;

  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const handleAfterImgChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files && e.target.files[0];
    const fileSize = file!.size / (1024 * 1024);
    if (fileSize <= 2) {
      const image = await resizeFile(file);
      setBeforeImg(image as any);
    } else {
      setNotification({
        type: "warning",
        message: "Please  upload file size no bigger than 2 mb",
      });
    }
  };

  return (
    <div className="profile-box-form cut-block">
      <div className="form-info-block one-block">
        <div>
          <p className="form-login-title green px20">Upload Before Image</p>
          <p className="form-login-subtitle gray px12 mb-6px">
            Add and edit your images
          </p>
        </div>
      </div>

      <div className="profile-block-box">
        {noCrop && beforeImg && <img src={beforeImg as string} />}
        {!noCrop && beforeImg && (
          <Crop
            src={beforeImg as string}
            onSave={onBeforeSaveCrop}
            disableEdit={disableEdit}
            onCancel={() => {
              setBeforeImg("");
            }}
          />
        )}
        {!beforeImg && (
          <div className="gallery-block-image">
            <p className="gallery-upload">
              <label className="button-green-file" form="cover_image">
                Upload
              </label>
              <input
                type="file"
                className="input-file2"
                name="cover_image"
                id="cover_image"
                onChange={(e) => {
                  handleAfterImgChange(e);
                }}
              />
              <span className="upload-subtitle">Max Size 2MB</span>
            </p>
          </div>
        )}
        <div>
          <p className="form-profile-label">Title</p>
          <p>
            <input
              {...register("after_title", {
                required: { value: true, message: "tittle is required!" },
              })}
              className="form-profile-input"
              type="text"
              name="after_title"
              id="after_title"
              placeholder="Image Title"
            />
            {(errors.after_title?.message || errors.after_title?.type) && (
              <p className="error-text">
                {errors.after_title?.message || "Invalid tag"}
              </p>
            )}
          </p>
        </div>

        <div>
          <p className="form-profile-label">Alt Tags</p>
          <div>
            <input
              {...register("after_altTags")}
              className="form-profile-input"
              type="text"
              name="after_altTags"
              id="after_altTags"
              placeholder="Alt Tag"
            />
            {(errors.after_altTags?.message || errors.after_altTags?.type) && (
              <p className="error-text">
                {errors.after_altTags?.message || "Invalid tag"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
