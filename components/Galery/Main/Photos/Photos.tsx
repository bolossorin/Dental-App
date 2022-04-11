import React, {useCallback, useContext, useEffect, useState} from "react";

// components
import {AppContext} from "../../../../context/app.context";
import {IUserGallery} from "../../../../reducers/types";
import {ISetNotofication} from "../../../Toast";
import {GallerySearch} from "../Search/Search";
import notify from "../../../Toast";
import {GalleryPhotoSlider} from "./Slider/Slider";
import {ServicesSelect} from "../../../common/ServicesSelect/ServicesSelect";

interface GalleryPhotosProps {
  onUpload: () => void;
  onEdit: (target: IUserGallery) => void;
}

export const GalleryPhotos: React.FC<GalleryPhotosProps> = ({onUpload, onEdit}) => {
  const {state} = useContext(AppContext);
  const {gallery, services} = state.dentistState;
  const [filteredGallery, setFilteredGallery] = useState<IUserGallery[]>([]);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);


  useEffect(() => {
    setFilteredGallery(gallery);
  }, [gallery]);

  const onHandleSearchByTitle = (
    // title: string
  ) => {
    // const results = gallery?.filter((item) => {
    //   return (
    //     item.before.title.toLowerCase().includes(title.toLowerCase()) ||
    //     item.after.title.toLowerCase().includes(title.toLowerCase()) ||
    //     item.before.tag?.toLowerCase().includes(title.toLowerCase()) ||
    //     item.after.tag?.toLowerCase().includes(title.toLowerCase())
    //   );
    // });
    // setGalleryPhotos(results);
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
      setNotification({type: "success", message: "Successfully delete gallery photo!"});
    } catch (exp) {
      setNotification({type: "error", message: "Error on delete gallery photo"});
    }
  };

  return (
    <>
      <GallerySearch onUpload={onUpload} onSearch={onHandleSearchByTitle} />
      <div className="flex-end">
        <ServicesSelect setFilteredGallery={setFilteredGallery} services={services} gallery={gallery} />
      </div>
      {filteredGallery && filteredGallery.length > 0 ? <div className="gallery-box">
        {filteredGallery.map((photo, index) =>
          <GalleryPhotoSlider
            key={index}
            photo={photo}
            onEdit={onEdit}
            onDelete={handleDelete} />)}
      </div> : <h2 className='empty'>Not found</h2>}
    </>
  );
};
