import { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocalData } from "../../hooks/useLocalData";
import { GalleryPhotos } from "./Main/Photos";
import { UploadAfter } from "./Uploads/After";
import { UploadBefore } from "./Uploads/Before";
import GallerySetService from "./Uploads/SetServices";
import Skeleton from "react-loading-skeleton";
import { UploadWatermark } from "./Uploads/Watermark";
import watermark from "../../utils/watermark/builded";
import { ISetNotofication } from "../Toast";
import notify from "../Toast";
import axios from "axios";
import { API } from "../../api/AWS-gateway";
import { AppContext } from "../../context/app.context";
import { resizeFile } from "../../utils/resizer";
import { IUserGallery } from "../../reducers/types";
import { UserTypes } from "../../reducers";

interface GalleryProps {}

export interface IAfterUpload {
  after_title: string;
  after_altTags: string;
}

export interface IBeforeUpload {
  before_title: string;
  before_altTags: string;
}

interface UploadFormChilds extends IAfterUpload, IBeforeUpload {}

export const Gallery: React.FC<GalleryProps> = () => {
  const { loading } = useLocalData();

  const { state, dispatch } = useContext(AppContext);

  const [step, setStep] = useState<"gallery" | "uploads" | "edit">("gallery");
  const [keyOfEditingPhoto, setItemKey] = useState("");
  const formParams = useForm<UploadFormChilds>();

  const [watermarkedAfter, setWatermarkedAfter] = useState("");
  const [watermarkedBefore, setWatermarkedBefore] = useState("");

  const [confirmCheckbox, setConfirm] = useState<"yes" | "no">("no");
  const [photoService, setServiceId] = useState("");

  const [editingService, setEditingService] = useState({
    id: "",
    name: "Choose Service",
  });

  const [watermarkFile, setWatermarkFile] = useState<File | string>("");

  const [afterImg, setAfterImg] = useState<File | string>("");
  const [beforeImg, setBeforeImg] = useState<File | string>("");

  const [afterCroppedImg, setAfterCroppedImg] = useState<File | string>("");
  const [beforeCroppedImg, setBeforeCroppedImg] = useState<File | string>("");

  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const onBeforeSaveCrop = (src) => {
    setBeforeCroppedImg(src);
  };
  const onAfterSaveCrop = (src) => {
    setAfterCroppedImg(src);
  };

  const onSubmitForm = async (data: UploadFormChilds) => {
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
      const { email } = state.userState;
      const { after_altTags, after_title, before_altTags, before_title } = data;
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
    } catch (exp) {}
  };

  const reset = () => {
    setAfterImg("");
    setBeforeImg("");
    setAfterCroppedImg("");
    setBeforeCroppedImg("");
    formParams.reset();
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
      setNotification({ type: "warning", message: "Please upload all images" });
      return;
    }
    if (!beforeCroppedImg || !afterCroppedImg) {
      setNotification({ type: "warning", message: "Please crop all images" });
      return;
    }
    try {
      const image = await resizeFile(watermarkFile, 100, 100, 80);
      const watermarkedAfter = await watermark([afterCroppedImg, image]).image(
        watermark.image.upperRight(0.5)
      );
      setWatermarkedAfter(watermarkedAfter.src);
      const watermarkedBefore = await watermark([
        beforeCroppedImg,
        image,
      ]).image(watermark.image.upperRight(0.5));
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

  const onHandleEdit = async (target: IUserGallery) => {
    reset();
    setAfterImg(target.imageAfterUrl as string);
    setBeforeImg(target.imageBeforeUrl as string);
    formParams.setValue("after_altTags", target.altTagsAfter);
    formParams.setValue("before_altTags", target.altTagsBefore);
    formParams.setValue("after_title", target.titleAfter);
    formParams.setValue("before_title", target.titleBefore);
    setEditingService({
      id: target.service_id,
      name: target.service_name,
    });
    setServiceId(target.service_id);
    setItemKey(target.key);
    setStep("edit");
  };

  const onSubmitEdit = async (data: UploadFormChilds) => {
    const { email } = state.userState;
    if (!photoService) {
      setNotification({ type: "warning", message: "Please choose service!" });
      return;
    }
    if (confirmCheckbox === "no") {
      setNotification({ type: "warning", message: "Please confirm!" });
      return;
    }
    try {
      const { after_altTags, after_title, before_altTags, before_title } = data;
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
          item: { ...res.data, key },
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
    } catch (exp) {}
  };

  const disabledAction = !(
    afterImg &&
    beforeImg &&
    afterCroppedImg &&
    beforeCroppedImg
  );

  const onFire = !disabledAction ? handleUseWatermark : undefined;

  return (
    <>
      {step === "gallery" && (
        <>
          {!loading && (
            <GalleryPhotos
              onUpload={() => setStep("uploads")}
              onEdit={onHandleEdit}
            />
          )}
          {loading && <Skeleton width={"80vw"} height={"98vh"} />}
        </>
      )}
      {step === "uploads" && (
        <>
          <form onSubmit={formParams.handleSubmit(onSubmitForm)}>
            <div className="row-gallery">
              <UploadAfter
                afterImg={afterImg}
                setAfterImg={setAfterImg}
                onAfterSaveCrop={onAfterSaveCrop}
                formParams={formParams}
                disableEdit={!!watermarkFile}
              />
              <UploadBefore
                beforeImg={beforeImg}
                setBeforeImg={setBeforeImg}
                onBeforeSaveCrop={onBeforeSaveCrop}
                formParams={formParams}
                disableEdit={!!watermarkFile}
              />
              <UploadWatermark
                setWatermarkFile={setWatermarkFile}
                onFire={onFire}
                disableUpload={disabledAction}
              />
            </div>
            <div className="row-gallery">
              <GallerySetService
                editingService={editingService}
                onCancel={onCancel}
                isConfirmed={confirmCheckbox}
                setConfirm={setConfirm}
                setServiceId={setServiceId}
              />
            </div>
          </form>
        </>
      )}
      {step === "edit" && (
        <>
          <form onSubmit={formParams.handleSubmit(onSubmitEdit)}>
            <div className="row-gallery">
              <UploadAfter
                afterImg={afterImg}
                setAfterImg={setAfterImg}
                onAfterSaveCrop={onAfterSaveCrop}
                formParams={formParams}
                disableEdit={!!watermarkFile}
                noCrop={true}
              />
              <UploadBefore
                beforeImg={beforeImg}
                setBeforeImg={setBeforeImg}
                onBeforeSaveCrop={onBeforeSaveCrop}
                formParams={formParams}
                disableEdit={!!watermarkFile}
                noCrop={true}
              />
            </div>
            <div className="row-gallery">
              <GallerySetService
                editingService={editingService}
                onCancel={onCancel}
                isConfirmed={confirmCheckbox}
                setConfirm={setConfirm}
                setServiceId={setServiceId}
              />
            </div>
          </form>
        </>
      )}
    </>
  );
};
