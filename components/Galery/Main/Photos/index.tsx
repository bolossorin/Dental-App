import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { API } from "../../../../api/AWS-gateway";
import { AppContext } from "../../../../context/app.context";
import { UserTypes } from "../../../../reducers";
import { IUserGallery } from "../../../../reducers/types";
import { ISetNotofication } from "../../../Toast";
import { GallerySearch } from "../Search";
import notify from "../../../Toast";
import { GalleryPhotoSlider } from "./Slider";

interface GalleryPhotosProps {
  onUpload: () => void;
  onEdit: (targer: IUserGallery) => void;
}

export const GalleryPhotos: React.FC<GalleryPhotosProps> = ({
  onUpload,
  onEdit,
}) => {
  const { state, dispatch } = useContext(AppContext);
  const { gallery, services } = state.userState;

  const [galleryPhotos, setGalleryPhotos] = useState<IUserGallery[] | null>();

  useEffect(() => {
    setGalleryPhotos(gallery);
  }, [gallery]);

  // useLocalData();

  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const handleChangeOption = (e) => {
    const selectedService = e.target.value;
    if (!selectedService) {
      setGalleryPhotos(gallery);
    }
    if (selectedService) {
      const filter = gallery?.filter(
        (item) => item.service_id === selectedService
      );
      setGalleryPhotos(filter as any);
    }
  };

  const onHandleSearchByTitle = (title: string) => {
    const results = gallery?.filter((item) => {
      return (
        item.titleBefore.toLowerCase().includes(title.toLowerCase()) ||
        item.titleAfter.toLowerCase().includes(title.toLowerCase()) ||
        item.altTagsBefore?.toLowerCase().includes(title.toLowerCase()) ||
        item.altTagsAfter?.toLowerCase().includes(title.toLowerCase())
      );
    });
    setGalleryPhotos(results);
  };

  const handleDelete = async (key: string) => {
    try {
      await axios.delete(`${API.SET_DENTIST_GALLERY}?key=${key}`);
      dispatch({
        type: UserTypes.REMOVE_FROM_GALLERY,
        payload: { key },
      });
      setNotification({
        type: "success",
        message: "Successfully delete gallery photo!",
        autoClose: 2,
        position: "top-right",
      });
    } catch (exp) {
      setNotification({
        type: "error",
        message: "Error on delete gallery photo",
      });
    }
  };

  return (
    <>
      <GallerySearch onUpload={onUpload} onSearch={onHandleSearchByTitle} />
      <div className="flex-end">
        <select
          className="person-gallery-select person-arrows"
          name="services"
          id="services"
          onChange={handleChangeOption}
        >
          <option value="" selected>
            All services
          </option>
          {services &&
            services.map((service) => (
              <option value={service.service_id} key={service.key}>
                {service.service_name}
              </option>
            ))}
        </select>
      </div>
      <div className="gallery-box">
        {galleryPhotos &&
          galleryPhotos.map((photo, idx) => {
            return (
              <GalleryPhotoSlider
                key={photo.key}
                photo={photo}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            );
          })}
      </div>
    </>
  );
};
