// import {useContext} from "react";

// components
// import {AppContext} from "../../../../context/app.context";
import {servicesInitial} from "../../../../mock/search";

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

const SetServices: React.FC<GallerySetServiceProps> = (
  {
    isConfirmed,
    setConfirm,
    setServiceId,
    onCancel,
    editingService,
  }) => {

  // todo: need backend
  // const {state} = useContext(AppContext);
  // const {services} = state.dentistState;
  return (
    <div className="row-gallery">
      <div className="profile-box-form cut-block">
        <div className="profile-block-box">
          <div className='cut-block-2'>
            <div className="form-profile-label">
              <label className="form-profile-label">Service</label>
            </div>
            <div className="row-content space-between">
              <select
                className="gallery-select arrows"
                name="services"
                id="services"
                placeholder="asdasd"
                onChange={(e) => setServiceId(e.target.value)}>
                {servicesInitial?.map((item) => <option
                  value={item.id}
                  key={item.id}
                  selected={item.id === editingService.id}>
                  {item.service_name}
                </option>)}
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
                  }} />
                <label htmlFor='delete' className="gallery-checkbox-text">
                  I confirm I have full rights for the use and publication of these images.
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="gallery-button-block services-buttons">
        <div className="form-login-buttons">
          <button className="gallery-button-green" type="submit">
            Confirm
          </button>
        </div>
        <div className="form-login-buttons">
          <button
            type='button'
            className="gallery-button-green-outline"
            onClick={() => onCancel()}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetServices;
