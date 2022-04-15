import React from "react";

// components
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";

export const CurrentMonth: React.FC = () => {

  return (
    <ProfileBox title='Current Month' subTitle='Summary'>
      <div className="double-blocks-5">
        <div>
          <p className="form-profile-label">
            <label className="form-profile-label">
              New Subscriptions
            </label>
          </p>
          <p>
            {/*<input className="form-profile-input" type="text" defaultValue={amountOfSubscriptions} disabled />*/}
          </p>
        </div>
        <div>
          <p className="form-profile-label">
            <label className="form-profile-label">
              New Free Accounts
            </label>
          </p>
          <p>
            {/*<input className="form-profile-input" type="text" defaultValue={amountOfNewAccounts} disabled />*/}
          </p>
        </div>
        <div>
          <p className="form-profile-label">
            <label className="form-profile-label">
              Subscriptions Closed
            </label>
          </p>
          <p>
            {/*<input className="form-profile-input" type="text" defaultValue={amountOfClosedSubscriptions} disabled />*/}
          </p>
        </div>
        <div>
          <p className="form-profile-label">
            <label className="form-profile-label">Accounts Closed</label>
          </p>
          <p>
            {/*<input className="form-profile-input" type="text" defaultValue={amountOfClosedAccounts} disabled />*/}
          </p>
        </div>
        <div>
          <p className="form-profile-label">
            <label className="form-profile-label">Images Uploaded</label>
          </p>
          <p>
            {/*<input className="form-profile-input" type="text" defaultValue={amountOfImages} disabled />*/}
          </p>
        </div>
      </div>
    </ProfileBox>
  );
};
