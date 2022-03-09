import Link from "next/link";
import { SearchDentistiResult } from "../../..";
import { dentists } from "../../../../../mock/search";

interface ICard {
  selectedTarget: SearchDentistiResult | undefined;
  selectTarget: (dent: SearchDentistiResult) => void;
  target: SearchDentistiResult;
  lat: number;
  lng: number;
}

export const DentistMarker: React.FC<ICard> = ({
  selectTarget,
  target,
  selectedTarget,
}) => {
  const selected = selectedTarget && selectedTarget.key === target.key;
  return (
    <div
      onClick={() => {
        selectTarget(target);
      }}
      className="dentist_target"
    >
      <img
        className="targerImage"
        src="../images/dentistMarker.svg"
        alt="dentist"
        style={{ background: selected ? "white" : "transparent" }}
      />
      <>
        {selected && (
          <>
            <div className="dentist_target_card_box"></div>
            <div className="dentist_target_card_circle">
              <img
                src={target.avatar_url}
                className="dentist_target_card_circle_img"
                alt="no image"
              />
              <p className="dentist_target_card_name">
                <Link href={"/"}>{target.username}</Link>
              </p>
            </div>
          </>
        )}
      </>
    </div>
  );
};
