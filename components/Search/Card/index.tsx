import { SearchDentistiResult } from "..";
import Link from "next/link";
import { dentists } from "../../../mock/search";

interface IDentistCardsProps {
  dentists: SearchDentistiResult[];
  selectTarget: (dent: SearchDentistiResult) => void;
  selectedTarget: SearchDentistiResult | undefined;
}

export const DentistCards: React.FC<IDentistCardsProps> = ({
  dentists,
  selectedTarget,
  selectTarget,
}) => {
  return (
    <div className="main-index index-main-box left-size">
      <div className="index-gallery-box">
        {dentists.map((item, idx) => (
          <a href={`/search/${item.email}`} target={"_blank"}>
            <div
              className="index-gallery-image-box"
              style={{
                boxShadow:
                  selectedTarget === item ? "15px 8px 20px 1px" : "none",
              }}
              onClick={() => {
                selectTarget(item);
              }}
              key={idx}
            >
              <img
                className="index-gallery-image"
                src={item.avatar_url || "../images/empty_avatar.png"}
                alt="gallery image"
              />
              <p className="index-gallery-image-watermark"></p>
              {item.accountType !== "free" && (
                <img
                  className="index-gallery-image-watermark-img"
                  src="../images/check_circle.svg"
                  alt="check"
                />
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
