import React, {useCallback, useEffect, useContext, useState} from "react";

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
import {getAllGallery, setGallery} from "../../api/AWS-gateway";

const gallerySchema = Yup.object().shape({
  before_title: Yup.string().required(),
  after_title: Yup.string().required(),
  before_altTags: Yup.string(),
  after_altTags: Yup.string(),
});
export const Gallery: React.FC = () => {
  const {loading} = useLocalData();

  const {state} = useContext(AppContext);
  const {email, access_token} = state.dentistState;

  const [step, setStep] = useState<"gallery" | "uploads" | "edit">("gallery");
  const [confirm, setConfirm] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState("");
  const [afterImg, setAfterImg] = useState<File | string>("");
  const [beforeImg, setBeforeImg] = useState<File | string>("");
  const [initialValues, setInitialValues] = useState({
    before_title: '',
    after_title: '',
    before_altTags: '',
    after_altTags: '',
    after_img: '',
    before_img: '',
  });

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const resetForm = () => {
    setAfterImg("");
    setBeforeImg("");
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
      after_title: target.titleAfter,
      before_title: target.titleBefore,
      after_altTags: target.altTagsAfter,
      before_altTags: target.altTagsBefore,
      after_img: target.imageAfterUrl,
      before_img: target.imageBeforeUrl,
    })
    setAfterImg(target.imageAfterUrl as string);
    setBeforeImg(target.imageBeforeUrl as string);
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
      // resetForm();
      // setStep("gallery");
    } catch (error: any) {
      setNotification({type: "error", message: error.response.data.message});
    }
  };

  useEffect(() => {
    if (email) {
      getAllGallery(email)
        .then(() => {
          console.log(11111)
        })
        .catch((error) => console.error(error, 'error'));
    }
  }, [email]);

  return (
    <>
      {step === "uploads" && (
        <Formik initialValues={initialValues} enableReinitialize={true} onSubmit={async (values) => {
          if (!confirm) {
            setNotification({type: "warning", message: "Please check confirmation"});
            return;
          }
          if (!selectedService) {
            setNotification({type: "warning", message: "Please select service"});
            return;
          }
          try {
            console.log(values, 'values');
            const config = {headers: {Authorization: `Bearer ${access_token}`}};
            await setGallery(selectedService, values, config);
            // dispatch({type: DentistTypes.ADD_TO_GALLERY, payload: {item: res.data}});
            setNotification({type: "success", message: "Successfully added new image to Gallery!"});
            // resetForm();
            // setStep("gallery");
          } catch (error: any) {
            setNotification({type: "error", message: error.response.data.message});
          }
        }}>
          {({errors, touched}) =>
            <Form className='gallery-edit'>
              <div className="row-gallery row-gallery-upload">
                <Upload type='After' img={afterImg} setImg={setAfterImg} errors={errors} touched={touched} />
                <Upload type='Before' img={beforeImg} setImg={setBeforeImg} errors={errors} touched={touched} />
              </div>
              <div className="row-gallery">
                <SetServices
                  onCancel={onCancel}
                  confirm={confirm} setConfirm={setConfirm}
                  setSelectedService={setSelectedService} />
              </div>
            </Form>}
        </Formik>)}
      {step === "edit" && (<Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={gallerySchema}
        onSubmit={onSubmitEdit}>
        {({errors, touched}) =>
          <Form className='gallery-edit'>
            <div className="row-gallery">
              <Upload type='Before' img={beforeImg} setImg={setBeforeImg} errors={errors} touched={touched} />
              <Upload type='After' img={afterImg} setImg={setAfterImg} errors={errors} touched={touched} />
            </div>
            <div className="row-gallery">
              <SetServices
                onCancel={onCancel}
                confirm={confirm}
                setConfirm={setConfirm}
                setSelectedService={setSelectedService} />
            </div>
          </Form>}
      </Formik>)}
      {step === "gallery" && loading ? <Skeleton width={"80vw"} height={"98vh"} />
        : <GalleryPhotos onUpload={() => setStep("uploads")} onEdit={onEdit} />}
    </>
  );
};
