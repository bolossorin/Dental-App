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
import notify, {ISetNotofication} from "../Toast";
import {AppContext} from "../../context/app.context";
import {IUserGallery} from "../../reducers/types";
import {setDentistGalleryApi, updateDentistGalleryApi} from "../../api/AWS-gateway";
import {DentistTypes} from "../../reducers";

const gallerySchema = Yup.object().shape({
  beforeTitle: Yup.string().required('Field is required'),
  afterTitle: Yup.string().required('Field is required'),
  beforeTag: Yup.string().required('Field is required'),
  afterTag: Yup.string().required('Field is required'),
});

const initial = {beforeTitle: '', afterTitle: '', beforeTag: '', afterTag: ''};
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
  const [idGallery, setIdGallery] = useState<File | string>("");
  const [initialValues, setInitialValues] = useState(initial);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const resetForm = () => {
    setAfterImg("");
    setBeforeImg("");
    setAfterUploadImg("");
    setBeforeUploadImg("");
    setSelectedService("");
    setIdGallery("");
    setConfirm(false);
  };

  const onCancel = () => {
    setInitialValues(initial)
    resetForm();
    setStep("gallery");
  };

  const onEdit = async (target: IUserGallery) => {
    resetForm();
    setInitialValues({
      beforeTitle: target.before.title,
      beforeTag: target.before.tag,
      afterTitle: target.after.title,
      afterTag: target.after.tag,
    })
    setAfterUploadImg(target.after.url as string);
    setBeforeUploadImg(target.before.url as string);
    setSelectedService(target.dentist_service_id);
    setIdGallery(target.id);
    setStep("edit");
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  const formDataValues = (values, id) => {
    let formData = new FormData();
    formData.append('after', afterImg);
    formData.append('afterTitle', values.afterTitle);
    formData.append('afterTag', values.afterTag);
    formData.append('before', beforeImg);
    formData.append('beforeTitle', values.beforeTitle);
    formData.append('beforeTag', values.beforeTag);
    if (id) formData.append('id', idGallery);
    return formData;
  }
  const validationFields = () => {
    if (!confirm) {
      setNotification({type: "warning", message: "Please check confirmation"});
      return false;
    } else if (!afterImg || !beforeImg) {
      setNotification({type: "warning", message: "Please save After and Before images"});
      return false;
    } else if (!selectedService) {
      setNotification({type: "warning", message: "Please select service"});
      return false;
    } else {
      return true;
    }
  }
  return (
    <>
      {step === "uploads" && (
        <Formik
          validationSchema={gallerySchema}
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={async (values) => {
            if (!validationFields()) return;
            try {
              const config = {headers: {Authorization: `Bearer ${access_token}`}};
              const {data} = await setDentistGalleryApi(selectedService, formDataValues(values, false), config);
              dispatch({type: DentistTypes.ADD_TO_GALLERY, payload: {gallery: data}});
              setNotification({type: "success", message: "Successfully  updated Gallery!"});
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
                  selectedService={selectedService}
                  isSubmitting={isSubmitting} />
              </div>
            </Form>}
        </Formik>)}
      {step === "edit" && (<Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={gallerySchema}
        onSubmit={async (values) => {
          if (!validationFields()) return;
          try {
            const config = {headers: {Authorization: `Bearer ${access_token}`}};
            const {data} = await updateDentistGalleryApi(formDataValues(values, true), config);
            dispatch({type: DentistTypes.UPDATE_ITEM_GALLERY, payload: {gallery: data}});
            setNotification({type: "success", message: "Successfully  updated Gallery!"});
            onCancel();
          } catch (error: any) {
            setNotification({type: "error", message: error.response.data.message});
          }
        }}>
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
                selectedService={selectedService}
                setSelectedService={setSelectedService} />
            </div>
          </Form>}
      </Formik>)}
      {step === "gallery" && loading ? <Skeleton width={"80vw"} height={"98vh"} />
        : <GalleryPhotos onUpload={() => setStep("uploads")} onEdit={onEdit} />}
    </>
  );
};
