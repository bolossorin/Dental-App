import Link from "next/link";
import {SearchDentistiResult} from "../../..";

interface ICard {
  selectedTarget: SearchDentistiResult | undefined;
  setSelectedDentist: (dent: SearchDentistiResult) => void;
  target: SearchDentistiResult;
  lat: number;
  lng: number;
}

export const DentistMarker: React.FC<ICard> = (
  {
    setSelectedDentist,
    target,
    selectedTarget,
  }) => {
  const selected = selectedTarget && selectedTarget.key === target.key;
  return (
    <div onClick={() => setSelectedDentist(target)} className="dentist_target">
      <img
        className="targerImage"
        src={"../images/dentistMarker.svg"}
        alt="dentist"
        style={{background: selected ? "white" : "transparent"}} />
      {selected && (<>
          <div className="dentist_target_card_box" />
          <div className="dentist_target_card_circle">
            <img
              src={target.avatar_url}
              className="dentist_target_card_circle_img"
              alt="no image" />
            <p className="dentist_target_card_name">
              <Link href={"/"}>{target.username}</Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
