import React from "react";

// components
import {ProfileBox} from "../../../common/ProfileBox/ProfileBox";

interface GallerySearchProps {
  onUpload: () => void;
  onHandleSearchByTitle: (title: string) => void;
}

export const GallerySearch: React.FC<GallerySearchProps> = ({onUpload, onHandleSearchByTitle}) => {
  return (
    <ProfileBox title='Gallery' subTitle='Add and edit your portfolio'>
      <div className="search-gallery">
        <input
          className="search-users"
          type="search"
          placeholder=" Search Images"
          onChange={(e) => onHandleSearchByTitle(e.target.value)} />
        <img className="search-button" src={"../images/search.svg"} alt="search" />
        <button type='button' className="search-gallery-button-green centered" onClick={onUpload}>
          Upload to gallery
        </button>
      </div>
    </ProfileBox>
  );
};
