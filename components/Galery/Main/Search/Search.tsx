import React, {useState} from "react";

// components
import {ProfileBox} from "../../../common/ProfileBox/ProfileBox";

interface GallerySearchProps {
  onUpload: () => void;
  onSearch: (title: string) => void;
}

export const GallerySearch: React.FC<GallerySearchProps> = ({onUpload, onSearch}) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <ProfileBox title='Gallery' subTitle='Add and edit your portfolio'>
      <div className="search-gallery">
        <input
          className="search-users"
          type="search"
          name="search"
          placeholder=" Search Images"
          onChange={(e) => {
            onSearch(e.target.value);
            setSearchValue(e.target.value);
          }} />
        <img
          className="search-button"
          src={"../images/search.svg"}
          alt="search"
          onClick={() => onSearch(searchValue)} />
        <button type='button' className="search-gallery-button-green centered" onClick={onUpload}>
          Upload to gallery
        </button>
      </div>
    </ProfileBox>
  );
};
