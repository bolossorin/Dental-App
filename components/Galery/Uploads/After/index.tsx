import { useCallback, useContext, useEffect, useState } from "react";
import { ISetNotofication } from "../../../Toast";
import notify from "../../../Toast";
import { Crop } from "../Crop/crop";
import { resizeFile } from "../../../../utils/resizer";

interface UploadAfterProps {
  onAfterSaveCrop: (src: string) => void;
  afterImg: File | string;
  setAfterImg: (src: File | string) => void;
  formParams: any;
  disableEdit: boolean;
  noCrop?: boolean;
}

export const UploadAfter: React.FC<UploadAfterProps> = ({
  onAfterSaveCrop,
  formParams,
  afterImg,
  setAfterImg,
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
      setAfterImg(image as any);
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
          <p className="form-login-title green px20">Upload After Image</p>
          <p className="form-login-subtitle gray px12 mb-6px">
            Add and edit your images
          </p>
        </div>
      </div>

      <div className="profile-block-box">
        {noCrop && afterImg && <img src={afterImg as string} />}
        {!noCrop && afterImg && (
          <Crop
            src={afterImg as string}
            onSave={onAfterSaveCrop}
            disableEdit={disableEdit}
            onCancel={() => {
              setAfterImg("");
            }}
          />
        )}
        {!afterImg && (
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
              {...register("before_title", {
                required: { value: true, message: "tittle is required!" },
              })}
              className="form-profile-input"
              type="text"
              name="before_title"
              id="before_title"
              placeholder="Image Title"
            />
            {(errors.before_title?.message || errors.before_title?.type) && (
              <p className="error-text">
                {errors.before_title?.message || "Invalid tag"}
              </p>
            )}
          </p>
        </div>

        <div>
          <p className="form-profile-label">Alt Tags</p>
          <div>
            <input
              {...register("before_altTags")}
              className="form-profile-input"
              type="text"
              name="before_altTags"
              id="before_altTags"
              placeholder="Alt Tag"
            />
            {(errors.before_altTags?.message ||
              errors.before_altTags?.type) && (
              <p className="error-text">
                {errors.before_altTags?.message || "Invalid tag"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
