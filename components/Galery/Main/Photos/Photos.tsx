import React, {useCallback, useContext, useEffect, useState} from "react";

// libs
// import axios from "axios";

// components
// import {API} from "../../../../api/AWS-gateway";
import {AppContext} from "../../../../context/app.context";
// import {DentistTypes} from "../../../../reducers";
import {IUserGallery} from "../../../../reducers/types";
import {ISetNotofication} from "../../../Toast";
import {GallerySearch} from "../Search/Search";
import notify from "../../../Toast";
import {GalleryPhotoSlider} from "./Slider/Slider";
import {personInitial} from "../../../../mock/search";

interface GalleryPhotosProps {
  onUpload: () => void;
  onEdit: (target: IUserGallery) => void;
}

export const GalleryPhotos: React.FC<GalleryPhotosProps> = ({onUpload, onEdit}) => {
  const {state,
    // dispatch
  } = useContext(AppContext);
  const {gallery, services} = state.dentistState;

  const [galleryPhotos, setGalleryPhotos] = useState<IUserGallery[] | null>(personInitial);

  useEffect(() => {
    // TODO: need backend
    // setGalleryPhotos(gallery);
  }, [gallery]);

  // useLocalData();

  const setNotification = useCallback<ISetNotofication>(
    ({...notifyProps}) => {
      notify({...notifyProps});
    }, []);

  const handleChangeOption = (e) => {
    const selectedService = e.target.value;
    if (!selectedService) setGalleryPhotos(gallery);

    if (selectedService) {
      const filter = gallery?.filter((item) => item.id === selectedService);
      setGalleryPhotos(filter as any);
    }
  };

  const onHandleSearchByTitle = (title: string) => {
    const results = personInitial?.filter((item) => {
      return (
        item.titleBefore.toLowerCase().includes(title.toLowerCase()) ||
        item.titleAfter.toLowerCase().includes(title.toLowerCase()) ||
        item.altTagsBefore?.toLowerCase().includes(title.toLowerCase()) ||
        item.altTagsAfter?.toLowerCase().includes(title.toLowerCase())
      );
    });
    setGalleryPhotos(results);
  };

  const handleDelete = async (
    // key: string
  ) => {
    try {
      // await axios.delete(`${API.SET_DENTIST_GALLERY}?key=${key}`);
      // dispatch({
      //   type: DentistTypes.REMOVE_FROM_GALLERY,
      //   payload: {key},
      // });
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
        <select className="person-gallery-select person-arrows" name="services" onChange={handleChangeOption}>
          <option value="" selected>All services</option>
          {services && services.map((service) =>
            <option value={service.id} key={service.id}>{service.service_name}</option>)}
        </select>
      </div>
      {galleryPhotos && galleryPhotos.length > 0 ? <div className="gallery-box">
        {galleryPhotos.map((photo) =>
          <GalleryPhotoSlider
            key={photo.key}
            photo={photo}
            onEdit={onEdit}
            onDelete={handleDelete} />)}
      </div> : <h2 className='empty'>Not found</h2>}
    </>
  );
};
