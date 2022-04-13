import React, {useState} from "react";

// libs
import ImageGallery from "react-image-gallery";
import {get} from "lodash";

// components
import {IUserGallery} from "../../../../../reducers/types";

interface IGalleryPhotoSlider {
  photo: IUserGallery;
  onEdit: (target: IUserGallery) => void;
  handleDelete: (key: string) => Promise<void>;
}

export const GalleryPhotoSlider: React.FC<IGalleryPhotoSlider> = ({photo, onEdit, handleDelete}) => {
  const [currentKey, setCurrentKey] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentTag, setCurrentTag] = useState("");

  const onChangePhoto = (idx, photo: IUserGallery) => {
    setCurrentKey(photo.id);
    if (idx === 0) {
      setCurrentTag(photo.after.tag);
      setCurrentTitle(photo.after.title);
    } else {
      setCurrentTag(photo.before.tag);
      setCurrentTitle(photo.before.title);
    }
  };

  return (
    photo.before ?
      <div className="gallery-image-box">
        <ImageGallery
          showThumbnails={false}
          showPlayButton={false}
          showBullets={true}
          showNav={false}
          onSlide={(idx) => onChangePhoto(idx, photo)}
          items={[{original: photo.before.url}, {original: photo.after.url}]} />
        <div className="gallery-image-description">
          <p className="gallery-image-title">
            {currentKey === photo.id ? currentTitle : get(photo, 'before.title', '')}
          </p>
          <p className="gallery-image-text">
            {currentKey === photo.id ? currentTag : get(photo, 'before.tag', '')}
          </p>
          <img className="gallery-image-edit" src={"../images/edit.svg"} alt="edit" onClick={() => onEdit(photo)} />
          <img
            className="gallery-image-delete"
            src={"../images/delete_forever.svg"}
            alt="delete"
            onClick={() => handleDelete(photo.id)} />
        </div>
      </div> : null
  );
};
