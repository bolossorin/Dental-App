import React, {useEffect, useState} from 'react';

// libs
import cn from "classnames";

// components
import {SearchDentistResult} from "../Search";

interface IDentistCardsProps {
  allDentists: SearchDentistResult[];
  setSelectedDentist: (dent: SearchDentistResult) => void;
  selectedDentist: SearchDentistResult | undefined;
}

export const DentistCards: React.FC<IDentistCardsProps> = ({allDentists, selectedDentist, setSelectedDentist}) => {
  const [filteredDentist, setFilteredDentist] = useState<SearchDentistResult[]>([]);

  useEffect(() => {
    const filteredFree: SearchDentistResult[] = allDentists.filter((dentist) => dentist.subscription_plan === "FREE");
    const filteredPremium: SearchDentistResult[] = allDentists.filter((dentist) => dentist.subscription_plan === "PREMIUM");
    setFilteredDentist([...filteredPremium, ...filteredFree]);
  }, [allDentists]);

  return (
    <div className="main-index index-main-box">
      <div className="index-gallery-box">
        {filteredDentist.length > 0 ? filteredDentist.map((dentist, idx) => (
          <a key={idx} className="index-gallery-item" href={`/search/${dentist.gdc}`} target={"_blank"}>
            <div
              className={cn("index-gallery-image-box", {'active': selectedDentist === dentist})}
              onClick={() => setSelectedDentist(dentist)}>
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
          </a>)) : <h2>Nor found</h2>}
      </div>
    </div>
  );
};
