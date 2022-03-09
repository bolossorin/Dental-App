import { useState } from "react";
import ImageGallery from "react-image-gallery";
import { IUserGallery } from "../../../../../reducers/types";

interface IGalleryPhotoSlider {
  photo: IUserGallery;
  onEdit: (target: IUserGallery) => void;
  onDelete: (key: string) => Promise<void>;
}

export const GalleryPhotoSlider: React.FC<IGalleryPhotoSlider> = ({
  photo,
  onEdit,
  onDelete,
}) => {
  const [currentKey, setCurrentKey] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentTag, setCurrentTag] = useState("");

  const onChangePhoto = (idx, photo: IUserGallery) => {
    setCurrentKey(photo.key);
    if (!!idx) {
      setCurrentTag(photo.altTagsAfter);
      setCurrentTitle(photo.titleAfter);
    } else {
      setCurrentTag(photo.altTagsBefore);
      setCurrentTitle(photo.titleBefore);
    }
  };

  return (
    <>
      <div className="gallery-image-box">
        <ImageGallery
          showThumbnails={false}
          showPlayButton={false}
          showBullets={true}
          showNav={false}
          onSlide={(idx) => {
            onChangePhoto(idx, photo);
          }}
          items={[
            {
              original: photo.imageBeforeUrl,
            },
            {
              original: photo.imageBeforeUrl,
            },
          ]}
        />
        <div className="gallery-image-description">
          <p className="gallery-image-title">
            {currentKey === photo.key ? currentTitle : photo.titleBefore}
          </p>
          <p className="gallery-image-text">
            {currentKey === photo.key ? currentTag : photo.altTagsBefore}
          </p>
          <img
            className="gallery-image-edit"
            src="../images/edit.svg"
            alt="edit"
            onClick={() => {
              onEdit(photo);
            }}
          />
          <img
            className="gallery-image-delete"
            src="../images/delete_forever.svg"
            alt="delete"
            onClick={() => {
              onDelete(photo.key);
            }}
          />
        </div>
      </div>
    </>
  );
};
