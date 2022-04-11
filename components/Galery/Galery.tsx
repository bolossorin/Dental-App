import React, {useCallback, useContext, useState} from "react";

// libs
import Skeleton from "react-loading-skeleton";
import {Form, Formik} from "formik";
import * as Yup from "yup";

// components
import {useLocalData} from "../../hooks/useLocalData";
import {GalleryPhotos} from "./Main/Photos/Photos";
import {Upload} from "./Uploads/After/After";
import SetServices from "./Uploads/SetServices/SetServices";
import {ISetNotofication} from "../Toast";
import notify from "../Toast";
import {AppContext} from "../../context/app.context";
import {IUserGallery} from "../../reducers/types";
import {setDentistGallery} from "../../api/AWS-gateway";
import {DentistTypes} from "../../reducers";

const gallerySchema = Yup.object().shape({
  beforeTitle: Yup.string().required('Field is required'),
  afterTitle: Yup.string().required('Field is required'),
  beforeTag: Yup.string().required('Field is required'),
  afterTag: Yup.string().required('Field is required'),
});
export const Gallery: React.FC = () => {
  const {loading} = useLocalData();

  const {state, dispatch} = useContext(AppContext);
  const {access_token} = state.dentistState;

  const [step, setStep] = useState<"gallery" | "uploads" | "edit">("gallery");
  const [confirm, setConfirm] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState("");
  const [afterUploadImg, setAfterUploadImg] = useState<File | string>("");
  const [beforeUploadImg, setBeforeUploadImg] = useState<File | string>("");
  const [afterImg, setAfterImg] = useState<File | string>("");
  const [beforeImg, setBeforeImg] = useState<File | string>("");
  const [initialValues, setInitialValues] = useState({beforeTitle: '', afterTitle: '', beforeTag: '', afterTag: ''});

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const resetForm = () => {
    setAfterImg("");
    setBeforeImg("");
    setAfterUploadImg("");
    setBeforeUploadImg("");
    setSelectedService("");
    setConfirm(false);
  };

  const onCancel = () => {
    resetForm();
    setStep("gallery");
  };

  const onEdit = async (target: IUserGallery) => {
    resetForm();
    setInitialValues({
      afterTitle: target.after.title,
      beforeTitle: target.before.title,
      afterTag: target.after.tag,
      beforeTag: target.before.tag,
    })
    setAfterUploadImg(target.after.url as string);
    setBeforeUploadImg(target.after.url as string);
    setSelectedService(target.id);
    setStep("edit");
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  const onSubmitEdit = async () => {
    if (!selectedService) {
      setNotification({type: "warning", message: "Please choose service!"});
      return;
    }
    if (!confirm) {
      setNotification({type: "warning", message: "Please confirm!"});
      return;
    }
    try {
      // const res = await axios.put<IUserGallery>(`${API.SET_DENTIST_GALLERY}?key=${key}`, body);
      // dispatch({type: DentistTypes.UPDATE_ITEM_GALLERY, payload: {item: {...res.data, key}}});
      setNotification({type: "success", message: "Successfully added new image to Gallery!"});
      // onCancel();
    } catch (error: any) {
      setNotification({type: "error", message: error.response.data.message});
    }
  };

  return (
    <>
      {step === "uploads" && (
        <Formik
          validationSchema={gallerySchema}
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={async (values) => {
            if (!confirm) {
              setNotification({type: "warning", message: "Please check confirmation"});
              return;
            }
            if (!afterImg || !beforeImg) {
              setNotification({type: "warning", message: "Please save After and Before images"});
              return;
            }
            if (!selectedService) {
              setNotification({type: "warning", message: "Please select service"});
              return;
            }
            try {
              let formData = new FormData();
              formData.append('after', afterImg);
              formData.append('afterTitle', values.afterTitle);
              formData.append('afterTag', values.afterTag);
              formData.append('before', beforeImg);
              formData.append('beforeTitle', values.beforeTitle);
              formData.append('beforeTag', values.beforeTag);

              const config = {headers: {Authorization: `Bearer ${access_token}`}};
              const {data} = await setDentistGallery(selectedService, formData, config);
              console.log(data, 'setDentistGallery')
              dispatch({type: DentistTypes.ADD_TO_GALLERY, payload: {item: data}});
              setNotification({type: "success", message: "Successfully added new image to Gallery!"});
              onCancel();
            } catch (error: any) {
              setNotification({type: "error", message: error.response.data.message});
            }
          }}>
          {({errors, isSubmitting, touched}) =>
            <Form className='gallery-edit'>
              <div className="row-gallery row-gallery-upload">
                <Upload
                  type='Before'
                  imgUpload={beforeUploadImg}
                  setImgUpload={setBeforeUploadImg}
                  setImg={setBeforeImg}
                  errors={errors}
                  touched={touched} />
                <Upload
                  type='After'
                  imgUpload={afterUploadImg}
                  setImgUpload={setAfterUploadImg}
                  setImg={setAfterImg}
                  errors={errors}
                  touched={touched} />
              </div>
              <div className="row-gallery">
                <SetServices
                  onCancel={onCancel}
                  confirm={confirm} setConfirm={setConfirm}
                  setSelectedService={setSelectedService}
                  isSubmitting={isSubmitting} />
              </div>
            </Form>}
        </Formik>)}
      {step === "edit" && (<Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={gallerySchema}
        onSubmit={onSubmitEdit}>
        {({errors, isSubmitting, touched}) =>
          <Form className='gallery-edit'>
            <div className="row-gallery">
              <Upload
                type='Before'
                setImg={setBeforeImg}
                imgUpload={beforeUploadImg}
                setImgUpload={setBeforeUploadImg}
                errors={errors}
                touched={touched} />
              <Upload
                type='After'
                setImg={setAfterImg}
                imgUpload={afterUploadImg}
                setImgUpload={setAfterUploadImg}
                errors={errors}
                touched={touched} />
            </div>
            <div className="row-gallery">
              <SetServices
                onCancel={onCancel}
                confirm={confirm}
                setConfirm={setConfirm}
                isSubmitting={isSubmitting}
                setSelectedService={setSelectedService} />
            </div>
          </Form>}
      </Formik>)}
      {step === "gallery" && loading ? <Skeleton width={"80vw"} height={"98vh"} />
        : <GalleryPhotos onUpload={() => setStep("uploads")} onEdit={onEdit} />}
    </>
  );
};
