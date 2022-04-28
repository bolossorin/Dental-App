import React, {useCallback, useContext, useEffect, useState} from "react";

// libs
import Skeleton from "react-loading-skeleton";

// components
import {AppContext} from "../../../../context/app.context";
import {IUserGallery} from "../../../../reducers/types";
import {ISetNotofication} from "../../../Toast";
import {GallerySearch} from "../Search/Search";
import notify from "../../../Toast";
import {GalleryPhotoSlider} from "./Slider/Slider";
import {ServicesSelect} from "../../../common/ServicesSelect/ServicesSelect";
import {deleteDentistGalleryApi} from "../../../../api/AWS-gateway";
import {DentistTypes} from "../../../../reducers";

interface GalleryPhotosProps {
  onUpload: () => void;
  onEdit: (target: IUserGallery) => void;
}

export const GalleryPhotos: React.FC<GalleryPhotosProps> = ({onUpload, onEdit}) => {
  const {state, dispatch} = useContext(AppContext);
  const {gallery, services, access_token} = state.dentistState;
  const [filteredByServices, setFilteredByServices] = useState<IUserGallery[] | null>(null);
  const [filteredByTitle, setFilteredByTitle] = useState<IUserGallery[] | null>(null);
  const [filtered, setFiltered] = useState<IUserGallery[] | null>(null);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  useEffect(() => {
    if (gallery) {
      setFilteredByServices(gallery);
      setFilteredByTitle(gallery);
    }
  }, [gallery]);

  useEffect(() => {
    if (filteredByServices && filteredByTitle) {
      let intersection = filteredByServices.filter(x => filteredByTitle.includes(x));
      setFiltered(intersection);
    }
  }, [filteredByTitle, filteredByServices]);

  const onHandleSearchByTitle = (title: string) => {
    const results = gallery!.filter((item) => {
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
      await deleteDentistGalleryApi(serviceId, config);
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
      <div className="gallery-box">
        {!filtered ? <>
            <Skeleton height="216px" />
            <Skeleton height="216px" />
            <Skeleton height="216px" />
            <Skeleton height="216px" />
            <Skeleton height="216px" />
          </>
          : filtered.length > 0 ? filtered.map((photo, index) =>
              <GalleryPhotoSlider key={index} photo={photo} onEdit={onEdit} handleDelete={handleDelete} />)
            : <h2 className='empty'>Not found gallery</h2>}
      </div>
    </>
  );
};
