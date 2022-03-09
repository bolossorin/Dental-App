import { useContext } from "react";
import { AppContext } from "../../../../context/app.context";

interface GallerySetServiceProps {
  isConfirmed: "yes" | "no";
  setConfirm: (status: "yes" | "no") => void;
  setServiceId: (service: string) => void;
  onCancel: () => void;
  editingService: {
    name: string;
    id: string;
  };
}

const GallerySetService: React.FC<GallerySetServiceProps> = ({
  isConfirmed,
  setConfirm,
  setServiceId,
  onCancel,
  editingService,
}) => {
  const { state } = useContext(AppContext);
  const { services } = state.userState;
  return (
    <div className="row-gallery">
      <div className="profile-box-form cut-block-2">
        <div className="profile-block-box">
          <div>
            <div className="form-profile-label">
              <label className="form-profile-label">Service</label>
            </div>
            <div className="row-content space-between">
              <select
                className="gallery-select arrows"
                name="services"
                id="services"
                placeholder="asdasd"
                onChange={(e) => {
                  setServiceId(e.target.value);
                }}
              >
                {services?.map((item) => {
                  return (
                    <option
                      value={item.service_id}
                      key={item.service_id}
                      selected={item.service_id === editingService.id}
                    >
                      {item.service_name}
                    </option>
                  );
                })}
              </select>

              <div className="checkbox">
                <input
                  type="checkbox"
                  name="delete"
                  id="delete"
                  value={isConfirmed}
                  onChange={(e) => {
                    if (e.target.value === "no") {
                      setConfirm("yes");
                    } else {
                      setConfirm("no");
                    }
                  }}
                />
                <span className="gallery-checkbox-text">
                  I confirm I have full rights for the use and publication of
                  these images.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="gallery-button-block">
        <div className="form-login-buttons">
          <button className="gallery-button-green" type={"submit"}>
            Confirm
          </button>
        </div>
        <div className="form-login-buttons">
          <button
            className="gallery-button-green-outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GallerySetService;
