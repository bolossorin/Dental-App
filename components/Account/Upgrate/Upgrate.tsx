import React from "react";

// components
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";

export const AccountUpgradeBlock: React.FC = () => {
  return (
    <ProfileBox title='My Subscription' subTitle='Subscription Information'>
      <div className="account-profile-block-box">
        <div className="account-double-blocks-2">
          <div className="account-form-profile-label">
            <label className="account-form-profile-label">Status</label>
            <input className="account-form-profile-input" type="text" placeholder="ACTIVE" />
          </div>
          <div className="account-form-profile-label">
            <label className="form-profile-label">Renewal</label>
            <input   type="text" className="account-form-profile-input" value="01/06/2021" placeholder="01/06/2021" />
          </div>
        </div>
        <div className="account-form-login-buttons">
          <button className="account-button-green">
            Cancel subscription
          </button>
        </div>
      </div>
    </ProfileBox>
  );
};
