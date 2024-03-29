import React from "react";

// libs
import cn from "classnames";

// components
import {SearchDentistResult} from "../../../Search";

interface ICard {
  selectedDentist: any | undefined;
  setSelectedDentist: (dent: SearchDentistResult) => void;
  location: any;
  lat: number;
  lng: number;
  currentDentist: any;
}

export const DentistMarker: React.FC<ICard> = ({setSelectedDentist, selectedDentist, currentDentist}) => {

  return (
    <div onClick={() => setSelectedDentist(currentDentist)} className="dentist_target">
      <img className={cn("targetImage", {'active': selectedDentist === currentDentist})}
           src={"../images/dentistMarker.svg"} alt="dentist" />
      {selectedDentist === currentDentist && (<>
        <div className="dentist_target_card_box" />
        <div className="dentist_target_card_circle">
          <img src={selectedDentist.avatarUrl  ? selectedDentist.avatarUrl : '/images/empty_avatar.png'} className="dentist_target_card_circle_img" alt="no image" />
          <p className="dentist_target_card_name">
            {selectedDentist.dentist_name}
          </p>
        </div>
      </>)}
    </div>
  );
};
