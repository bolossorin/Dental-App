import { useState } from "react";

interface GallerySearchProps {
  onUpload: () => void;
  onSearch: (title: string) => void;
}

export const GallerySearch: React.FC<GallerySearchProps> = ({
  onUpload,
  onSearch,
}) => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="search-gallery-profile-box-form">
      <div className="search-galery-form-info-block">
        <div>
          <p className="search-gallery-form-login-title green ">Gallery</p>
          <p className="search-gallery-form-login-subtitle gray mb-6px">
            Add and edit your portfolio
          </p>
        </div>
      </div>
      <div className="search-gallery">
        <input
          className="search-users"
          type="search"
          id="search"
          name="search"
          placeholder=" Search Images "
          onChange={(e) => {
            onSearch(e.target.value);
            setSearchValue(e.target.value);
          }}
        />
        <img
          className="search-button"
          src="../images/search.svg"
          alt="search"
          onClick={() => {
            onSearch(searchValue);
          }}
        />
        <button
          className="search-gallery-button-green centered"
          onClick={onUpload}
        >
          Upload to gallery
        </button>
      </div>
    </div>
  );
};
