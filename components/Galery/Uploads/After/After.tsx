import React, {useCallback} from "react";

// libs
import {Field} from "formik";

// components
import {ISetNotofication} from "../../../Toast";
import notify from "../../../Toast";
import {Crop} from "../Crop/Crop";
import {resizeFile} from "../../../../utils/resizer";

interface UploadProps {
  onSaveCrop: (src: string) => void;
  img: File | string;
  setImg: (src: File | string) => void;
  disableEdit: boolean;
  type: string;
  errors: any;
  touched: any;
}

export const Upload: React.FC<UploadProps> = ({onSaveCrop, img, setImg, disableEdit, type, errors, touched}) => {

  const setNotification = useCallback<ISetNotofication>(
    ({...notifyProps}) => {
      notify({...notifyProps});
    }, []);

  const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    const fileSize = file!.size / (1024 * 1024);
    if (fileSize <= 2) {
      const image = await resizeFile(file);
      setImg(image as any);
    } else {
      setNotification({
        type: "warning",
        message: "Please  upload file size no bigger than 2 mb",
      });
    }
  };

  return (
    <div className="profile-box-form cut-block">
      <div className="form-info-block-full one-block">
        <p className="form-login-title green px20">Upload {type} Image</p>
        <p className="form-login-subtitle gray px12 mb-6px">Add and edit your images</p>
      </div>
      <div className="profile-block-box">
        {img ? <Crop src={img as string} onSave={onSaveCrop} disableEdit={disableEdit} setImg={setImg} />
          : <div className="gallery-block-image">
            <p className="gallery-upload">
              <label className="button-green-file" form="cover_image">Upload</label>
              <Field type="file" className="input-file2" name='cover_image' onChange={(e) => handleImgChange(e)} />
              <span className="upload-subtitle">Max Size 2MB</span>
            </p>
          </div>}
        <p className="form-profile-label">Title</p>
        {type === 'Before' ? <div>
            <Field className="form-profile-input" name='before_title' placeholder="Image Title" />
            {errors.before_title && touched.before_title ?
              <p className='account-error-text'>{errors.before_title}</p> : null}
          </div>
          : <div>
            <Field className="form-profile-input" name='after_title' placeholder="Image Title" />
            {errors.after_title && touched.after_title ?
              <p className='account-error-text'>{errors.after_title}</p> : null}
          </div>}
        <p className="form-profile-label">Alt Tags</p>
        {type === 'Before' ? <div>
            <Field className="form-profile-input" name='before_altTags' placeholder="Alt Tag" />
            {errors.before_altTags && touched.before_altTags ?
              <p className='account-error-text'>{errors.before_altTags}</p> : null}
          </div>
          : <div>
            <Field className="form-profile-input" name='after_altTags' placeholder="Alt Tag" />
            {errors.after_altTags && touched.after_altTags ?
              <p className='account-error-text'>{errors.after_altTags}</p> : null}
          </div>}
      </div>
    </div>
  );
};
