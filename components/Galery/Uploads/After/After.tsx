import React, {useCallback} from "react";

// libs
import {Field} from "formik";

// components
import notify, {ISetNotofication} from "../../../Toast";
import {Crop} from "../Crop/Crop";
import {getSrcImage, handleImgChange} from "../../../../utils/handleImgChange";

interface UploadProps {
  imgUpload: File | string | null;
  setImg: (src: File | null) => void;
  setImgUpload: (src: File | null) => void;
  type: string;
  errors: any;
  touched: any;
}

export const Upload: React.FC<UploadProps> = ({imgUpload, setImgUpload, type, errors, touched, setImg}) => {
  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  return (
    <div className="profile-box-form cut-block">
      <div className="form-info-block-full one-block">
        <p className="form-login-title green px20">Upload {type} Image</p>
        <p className="form-login-subtitle gray px12 mb-6px">Add and edit your images</p>
      </div>
      <div className="profile-block-box">
        {imgUpload
          ? <Crop
            aspect={1}
            isSubmitting={false}
            onSubmitButton={false}
            setImg={setImg} getSrcImage={getSrcImage(imgUpload)}
            setImgUpload={setImgUpload} />
          : <div className="gallery-block-image">
            <p className="gallery-upload">
              <label className="button-green-file" htmlFor={`cover_image_${type.toLowerCase()}`}>Upload</label>
              <Field
                id={`cover_image_${type.toLowerCase()}`}
                type="file"
                className="input-file2"
                name='cover_image'
                onChange={(e) => handleImgChange(e, setNotification, setImgUpload)} />
              <span className="upload-subtitle">Max Size 2MB</span>
            </p>
          </div>}
        <p className="form-profile-label">Title</p>
        {type === 'Before' ? <div className="form-input">
            <Field className="form-profile-input" name='beforeTitle' placeholder="Image Title" />
            {errors.beforeTitle && touched.beforeTitle ?
              <p className='error-text'>{errors.beforeTitle}</p> : null}
          </div>
          : <div className="form-input">
            <Field className="form-profile-input" name='afterTitle' placeholder="Image Title" />
            {errors.afterTitle && touched.afterTitle ?
              <p className='error-text'>{errors.afterTitle}</p> : null}
          </div>}
        <p className="form-profile-label">Alt Tags</p>
        {type === 'Before' ? <div className="form-input">
            <Field className="form-profile-input" name='beforeTag' placeholder="Alt Tag" />
            {errors.beforeTag && touched.beforeTag ?
              <p className='error-text'>{errors.beforeTag}</p> : null}
          </div>
          : <div className="form-input">
            <Field className="form-profile-input" name='afterTag' placeholder="Alt Tag" />
            {errors.afterTag && touched.afterTag ?
              <p className='error-text'>{errors.afterTag}</p> : null}
          </div>}
      </div>
    </div>
  );
};
