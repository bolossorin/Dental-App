import React, {useContext} from "react";

// components
import {AppContext} from "../../../../context/app.context";

interface GallerySetServiceProps {
  setSelectedService: (value: string) => void;
  confirm: boolean;
  setConfirm: (status: boolean) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const SetServices: React.FC<GallerySetServiceProps> = (
  {
    confirm,
    setConfirm,
    onCancel,
    setSelectedService,
    isSubmitting
  }) => {
  const {state} = useContext(AppContext);
  const {services} = state.dentistState;

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
                onChange={(e: any) => setSelectedService(e.target.value)}
                className="gallery-select arrows"
                name="service">
                <option value='' defaultValue=''>Select Service</option>
                {services.map((item, index) =>
                  <option key={index} value={item.id}>{item.service_name}</option>)}
              </select>
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="confirm_checkbox"
                  value={JSON.stringify(confirm)}
                  onChange={(e: any) => setConfirm(e.target.checked)} />
                <label htmlFor='confirm_checkbox' className="gallery-checkbox-text">
                  I confirm I have full rights for the use and publication of these images.
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="gallery-button-block services-buttons">
        <div className="form-login-buttons">
          <button disabled={isSubmitting} className="gallery-button-green" type="submit">Confirm</button>
        </div>
        <div className="form-login-buttons">
          <button type='button' className="gallery-button-green-outline" onClick={() => onCancel()}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetServices;
