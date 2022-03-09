import { useCallback, useContext, useState } from "react";
import { ISetNotofication } from "../../../Toast";
import notify from "../../../Toast";

interface UploadWatermarkProps {
  setWatermarkFile: (file: File) => void;
  onFire: Function | undefined;
  disableUpload: boolean;
}

export const UploadWatermark: React.FC<UploadWatermarkProps> = ({
  setWatermarkFile,
  onFire,
  disableUpload,
}) => {
  const [watermarkSrc, setWatermarkSrc] = useState("");
  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const handleAfterImgChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const _URL = window.URL || window.webkitURL;
      const file = e.target.files && e.target.files[0];
      const binaryData: any = [];
      binaryData.push(file);
      const objectUrl = _URL.createObjectURL(
        new Blob(binaryData, { type: "application/zip" })
      );
      const fileSize = file!.size / (1024 * 1024);
      if (fileSize <= 2) {
        setWatermarkFile(file as File);
        setWatermarkSrc(objectUrl);
      } else {
        setNotification({
          type: "warning",
          message: "Please  upload file size no bigger than 2 mb",
        });
      }
    } catch (exp) {
      setNotification({
        type: "error",
        message: "Please  upload file size no bigger than 2 mb",
      });
    }
  };

  return (
    <div className="profile-box-form cut-block">
      <div className="form-info-block one-block">
        <div>
          <p className="form-login-title green px20">Upload Watermark</p>
          <p className="form-login-subtitle gray px12 mb-6px">
            Add and edit your images
          </p>
        </div>
      </div>

      <div className="profile-block-box">
        {watermarkSrc && (
          <>
            <div className="form-login-buttons">
              <img src={watermarkSrc} />
              <div className="d-flex">
                {onFire && (
                  <button
                    className="gallery-button-green"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onFire();
                    }}
                  >
                    Apply
                  </button>
                )}
                <button
                  className="gallery-button-green"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setWatermarkSrc("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
        {!watermarkSrc && (
          <div className="gallery-block-image">
            <p className="gallery-upload">
              <label
                className="button-green-file"
                form="cover_image"
                style={{
                  color: !disableUpload ? "" : "rgba(20, 3, 3, 0.5)",
                  background: !disableUpload ? "" : "rgba(112, 112, 112, 0.5)",
                }}
              >
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
                disabled={disableUpload}
              />
              <span className="upload-subtitle">Max Size 2MB</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
