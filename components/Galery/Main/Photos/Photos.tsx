import React, {useCallback, useContext, useEffect, useState} from "react";

// components
import {AppContext} from "../../../../context/app.context";
import {IUserGallery} from "../../../../reducers/types";
import {ISetNotofication} from "../../../Toast";
import {GallerySearch} from "../Search/Search";
import notify from "../../../Toast";
import {GalleryPhotoSlider} from "./Slider/Slider";
import {ServicesSelect} from "../../../common/ServicesSelect/ServicesSelect";
import {deleteDentistGallery} from "../../../../api/AWS-gateway";
import {DentistTypes} from "../../../../reducers";

interface GalleryPhotosProps {
  onUpload: () => void;
  onEdit: (target: IUserGallery) => void;
}

export const GalleryPhotos: React.FC<GalleryPhotosProps> = ({onUpload, onEdit}) => {
  const {state, dispatch} = useContext(AppContext);
  const {gallery, services, access_token} = state.dentistState;
  const [filteredByServices, setFilteredByServices] = useState<IUserGallery[]>([]);
  const [filteredByTitle, setFilteredByTitle] = useState<IUserGallery[]>([]);
  const [filtered, setFiltered] = useState<IUserGallery[]>([]);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  useEffect(() => {
    setFilteredByServices(gallery);
    setFilteredByTitle(gallery);
  }, [gallery]);

  useEffect(() => {
    let intersection = filteredByServices.filter(x => filteredByTitle.includes(x));
    setFiltered(intersection);
  }, [filteredByTitle, filteredByServices]);

  const onHandleSearchByTitle = (title: string) => {
    const results = gallery.filter((item) => {
      if (item.before) {
        return (
          item.before.title.toLowerCase().includes(title.toLowerCase()) ||
          item.after.title.toLowerCase().includes(title.toLowerCase()) ||
          item.before.tag.toLowerCase().includes(title.toLowerCase()) ||
          item.after.tag.toLowerCase().includes(title.toLowerCase())
        );
      }
    });
    setFilteredByTitle(results);
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const config = {headers: {Authorization: `Bearer ${access_token}`}};
      await deleteDentistGallery(serviceId, config);
      dispatch({type: DentistTypes.REMOVE_FROM_GALLERY, payload: serviceId});
      setNotification({type: "success", message: "Successfully delete gallery photo!"});
    } catch (exp) {
      setNotification({type: "error", message: "Error on delete gallery photo"});
    }
  };

  return (
    <>
      <GallerySearch onUpload={onUpload} onHandleSearchByTitle={onHandleSearchByTitle} />
      <div className="flex-end">
        <ServicesSelect
          setFilteredGallery={setFilteredByServices}
          services={services} gallery={gallery} />
      </div>
      {filtered && filtered.length > 0 ? <div className="gallery-box">
        {filtered.map((photo, index) =>
          <GalleryPhotoSlider
            key={index}
            photo={photo}
            onEdit={onEdit}
            handleDelete={handleDelete} />)}
      </div> : <h2 className='empty'>Not found</h2>}
    </>
  );
};
