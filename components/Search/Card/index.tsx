// libs
import cn from "classnames";

// components
import {SearchDentistiResult} from "..";

interface IDentistCardsProps {
  nearlyDentists: SearchDentistiResult[];
  setSelectedDentist: (dent: SearchDentistiResult) => void;
  selectedTarget: SearchDentistiResult | undefined;
  setMyLocation: any;
}

export const DentistCards: React.FC<IDentistCardsProps> = (
  {
    setMyLocation,
    nearlyDentists,
    selectedTarget,
    setSelectedDentist
  }) => {
  return (
    <div className="main-index index-main-box left-size">
      <div className="index-gallery-box">
        {nearlyDentists.map((item, idx) => (
          <a key={idx} href={`/search/${item.email}`} target={"_blank"}>
            <div
              className={cn("index-gallery-image-box", {'active': selectedTarget === item})}
              onClick={() => {
                setMyLocation(item.location)
                setSelectedDentist(item);
              }}>
              <img
                className="index-gallery-image"
                src={item.avatar_url || "../images/empty_avatar.png"}
                alt="gallery image" />
              {item.accountType !== "free" && (<>
                  <p className="index-gallery-image-watermark" />
                  <img
                    className="index-gallery-image-watermark-img"
                    src={"../images/check_circle.svg"}
                    alt="check" />
                </>
              )}
              <div className="index-gallery-image-description">
                <p className="index-gallery-image-title">{item.username}</p>
                <p className="index-gallery-image-text">{item.email}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
