import React from 'react';

// libs
import cn from "classnames";

// components
import {SearchDentistResult} from "../Search";

interface IDentistCardsProps {
  allDentists: any;
  setSelectedDentist: (dent: SearchDentistResult) => void;
  selectedDentist: SearchDentistResult | undefined;
  setMyLocation: any;
}

export const DentistCards: React.FC<IDentistCardsProps> = (
  {
    setMyLocation,
    allDentists,
    selectedDentist,
    setSelectedDentist
  }) => {
  return (
    <div className="main-index index-main-box">
      <div className="index-gallery-box">
        {allDentists.map((dentist, idx) => (
          <a key={idx} className="index-gallery-item" href={`/search/${dentist.email}`} target={"_blank"}>
            <div
              className={cn("index-gallery-image-box", {'active': selectedDentist === dentist})}
              onClick={() => {
                setMyLocation({lat: +dentist.locations[0].lat, lng: +dentist.locations[0].lng})
                setSelectedDentist(dentist);
              }}>
              <img
                className="index-gallery-image"
                src={dentist.avatarUrl || "../images/empty_avatar.png"}
                alt="gallery image" />
              {dentist.subscription_plan !== "FREE" && (<>
                <p className="index-gallery-image-watermark" />
                <img
                  className="index-gallery-image-watermark-img"
                  src={"../images/check_circle.svg"}
                  alt="check" />
              </>)}
              <div className="index-gallery-image-description">
                <p className="index-gallery-image-title">{dentist.dentist_name}</p>
                <p className="index-gallery-image-text">{dentist.email}</p>
              </div>
            </div>
          </a>))}
      </div>
    </div>
  );
};
