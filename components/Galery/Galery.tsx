import React, {useCallback, useContext, useState} from "react";

// libs
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import {Form, Formik} from "formik";
import * as Yup from "yup";

// components
import {useLocalData} from "../../hooks/useLocalData";
import {GalleryPhotos} from "./Main/Photos/Photos";
import {Upload} from "./Uploads/After/After";
import SetServices from "./Uploads/SetServices/SetServices";
import {Watermark} from "./Uploads/Watermark/Watermark";
import watermark from "../../utils/watermark/builded";
import {ISetNotofication} from "../Toast";
import notify from "../Toast";
import {API} from "../../api/AWS-gateway";
import {AppContext} from "../../context/app.context";
import {resizeFile} from "../../utils/resizer";
import {IUserGallery} from "../../reducers/types";
import {UserTypes} from "../../reducers";

const gallerySchema = Yup.object().shape({
  before_title: Yup.string().required(),
  after_title: Yup.string().required(),
  before_altTags: Yup.string(),
  after_altTags: Yup.string(),
});

export const Gallery: React.FC = () => {
  const {loading} = useLocalData();

  const {state, dispatch} = useContext(AppContext);

  const [step, setStep] = useState<"gallery" | "uploads" | "edit">("gallery");
  const [keyOfEditingPhoto, setItemKey] = useState("");

  const [watermarkedAfter, setWatermarkedAfter] = useState("");
  const [watermarkedBefore, setWatermarkedBefore] = useState("");

  const [confirmCheckbox, setConfirm] = useState<"yes" | "no">("no");
  const [photoService, setServiceId] = useState("");

  const [editingService, setEditingService] = useState({id: "", name: "Choose Service"});

  const [watermarkFile, setWatermarkFile] = useState<File | string>("");

  const [afterImg, setAfterImg] = useState<File | string>("");
  const [beforeImg, setBeforeImg] = useState<File | string>("");

  const [afterCroppedImg, setAfterCroppedImg] = useState<File | string>("");
  const [beforeCroppedImg, setBeforeCroppedImg] = useState<File | string>("");

  const [initialValues, setInitialValues] = useState({
    before_title: '',
    after_title: '',
    before_altTags: '',
    after_altTags: '',
    after_img: '',
    before_img: '',
    service: {id: '', name: ''},
  });

  const setNotification = useCallback<ISetNotofication>(
    ({...notifyProps}) => {
      notify({...notifyProps});
    }, []);

  const onBeforeSaveCrop = (src) => setBeforeCroppedImg(src);
  const onAfterSaveCrop = (src) => setAfterCroppedImg(src);

  const onSubmitForm = async (data) => {
    if (!watermarkedAfter || !watermarkedBefore) {
      setNotification({
        type: "warning",
        message: "Please set watermark and use it!",
      });
      return;
    }
    if (confirmCheckbox === "no") {
      setNotification({
        type: "warning",
        message: "Please check confirmation",
      });
      return;
    }
    if (!photoService) {
      setNotification({
        type: "warning",
        message: "Please select service",
      });
      return;
    }
    try {
      const {email} = state.userState;
      const {after_altTags, after_title, before_altTags, before_title} = data;
      const body = {
        email,
        images: {
          before: {
            title: before_title,
            altTags: before_altTags,
            files: {
              extension: watermarkedBefore
                .split(",")[0]!
                .split("/")[1]
                .split(";")[0],
              value: watermarkedBefore.split(",")[1],
            },
          },
          after: {
            title: after_title,
            altTags: after_altTags,
            files: {
              extension: watermarkedAfter
                .split(",")[0]!
                .split("/")[1]
                .split(";")[0],
              value: watermarkedAfter.split(",")[1],
            },
          },
        },
        service_id: photoService,
      };

      const res = await axios.post<IUserGallery>(API.SET_DENTIST_GALLERY, body);
      dispatch({
        type: UserTypes.ADD_TO_GALLERY,
        payload: {
          item: res.data,
        },
      });
      setNotification({
        type: "success",
        message: "Successfully added new image to Gallery!",
        autoClose: 2,
        position: "top-right",
      });
      reset();
      setStep("gallery");
    } catch (exp) {
    }
  };

  const reset = () => {
    setAfterImg("");
    setBeforeImg("");
    setAfterCroppedImg("");
    setBeforeCroppedImg("");
    setServiceId("");
    setWatermarkFile("");
    setConfirm("no");
    setEditingService({
      id: "",
      name: "Select service",
    });
  };

  const onCancel = () => {
    reset();
    setStep("gallery");
  };

  const handleUseWatermark = async () => {
    if (!beforeImg || !afterImg) {
      setNotification({type: "warning", message: "Please upload all images"});
      return;
    }
    if (!beforeCroppedImg || !afterCroppedImg) {
      setNotification({type: "warning", message: "Please crop all images"});
      return;
    }
    try {
      const image = await resizeFile(watermarkFile, 100, 100, 80);
      const watermarkedAfter = await watermark([afterCroppedImg, image]).image(watermark.image.upperRight(0.5));
      setWatermarkedAfter(watermarkedAfter.src);
      const watermarkedBefore = await watermark([beforeCroppedImg, image]).image(watermark.image.upperRight(0.5));
      setWatermarkedBefore(watermarkedBefore.src);
      setNotification({
        type: "success",
        message: "Successfully applied watermark!",
        autoClose: 2,
        position: "top-right",
      });
    } catch (exp) {
      setNotification({
        type: "error",
        message: "Error on create watermark image",
      });
    }
  };

  const onEdit = async (target: IUserGallery) => {
    reset();
    setInitialValues({
      after_title: target.titleAfter,
      before_title: target.titleBefore,
      after_altTags: target.altTagsAfter,
      before_altTags: target.altTagsBefore,
      after_img: target.imageAfterUrl,
      before_img: target.imageBeforeUrl,
      service: {id: target.service_id, name: target.service_name},
    })
    setAfterImg(target.imageAfterUrl as string);
    setBeforeImg(target.imageBeforeUrl as string);
    setEditingService({id: target.service_id, name: target.service_name});
    setServiceId(target.service_id);
    setItemKey(target.key);
    setStep("edit");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const onSubmitEdit = async (data) => {
    const {email} = state.userState;
    if (!photoService) {
      setNotification({type: "warning", message: "Please choose service!"});
      return;
    }
    if (confirmCheckbox === "no") {
      setNotification({type: "warning", message: "Please confirm!"});
      return;
    }
    try {
      const {after_altTags, after_title, before_altTags, before_title} = data;
      const body = {
        email,
        images: {
          before: {
            title: before_title,
            altTags: before_altTags || null,
            files: null,
          },
          after: {
            title: after_title,
            altTags: after_altTags || null,
            files: null,
          },
        },
        service_id: photoService,
      };
      const key = keyOfEditingPhoto;
      const res = await axios.put<IUserGallery>(
        `${API.SET_DENTIST_GALLERY}?key=${key}`,
        body
      );
      dispatch({
        type: UserTypes.UPDATE_ITEM_GALLERY,
        payload: {
          item: {...res.data, key},
        },
      });
      setNotification({
        type: "success",
        message: "Successfully added new image to Gallery!",
        autoClose: 2,
        position: "top-right",
      });
      reset();
      setStep("gallery");
    } catch (exp) {
    }
  };

  const disabledAction = !(afterImg && beforeImg && afterCroppedImg && beforeCroppedImg);

  const onFire = !disabledAction ? handleUseWatermark : undefined;


  return (
    <>
      {step === "uploads" && (
        <Formik initialValues={initialValues} enableReinitialize={true} onSubmit={onSubmitForm}>
          {({errors, touched}) =>
            <Form className='gallery-edit'>
              <div className="row-gallery row-gallery-upload">
                <Upload
                  type='After'
                  img={afterImg}
                  setImg={setAfterImg}
                  onSaveCrop={onAfterSaveCrop}
                  disableEdit={!!watermarkFile}
                  errors={errors}
                  touched={touched} />
                <Upload
                  type='Before'
                  img={beforeImg}
                  setImg={setBeforeImg}
                  onSaveCrop={onBeforeSaveCrop}
                  disableEdit={!!watermarkFile}
                  errors={errors}
                  touched={touched} />
                <Watermark
                  setWatermarkFile={setWatermarkFile}
                  onFire={onFire}
                  disableUpload={disabledAction} />
              </div>
              <div className="row-gallery">
                <SetServices
                  editingService={editingService}
                  onCancel={onCancel}
                  isConfirmed={confirmCheckbox}
                  setConfirm={setConfirm}
                  setServiceId={setServiceId} />
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
                <Upload
                  type='Before'
                  img={beforeImg}
                  setImg={setBeforeImg}
                  onSaveCrop={onBeforeSaveCrop}
                  disableEdit={!!watermarkFile}
                  errors={errors}
                  touched={touched} />
                <Upload
                  type='After'
                  img={afterImg}
                  setImg={setAfterImg}
                  onSaveCrop={onAfterSaveCrop}
                  disableEdit={!!watermarkFile}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="row-gallery">
                <SetServices
                  editingService={editingService}
                  onCancel={onCancel}
                  isConfirmed={confirmCheckbox}
                  setConfirm={setConfirm}
                  setServiceId={setServiceId} />
              </div>
            </Form>}
        </Formik>
      )}
      {step === "gallery" && loading ? <Skeleton width={"80vw"} height={"98vh"} />
        : <GalleryPhotos onUpload={() => setStep("uploads")} onEdit={onEdit} />}
    </>
  );
};
