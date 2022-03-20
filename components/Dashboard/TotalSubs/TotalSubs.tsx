import React, {useContext} from "react";

// components
import {Chart} from "./chart2";
import {AppContext} from "../../../context/app.context";
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";

export const TotalSubs: React.FC = () => {
  const {state} = useContext(AppContext);
  const {
    amountOfClosedAccounts,
    amountOfClosedSubscriptions,
    amountOfImages,
    amountOfNewAccounts,
    amountOfSubscriptions,
  } = state.adminState.yearStats;

  return (
    <ProfileBox title='Total Subscriptions' subTitle='Summary'>
      <div className="account-form-info-block-full">
        <div className="double-blocks-5">
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Subscriptions</label>
            </p>
            <p>
              <input className="form-profile-input" type="text" defaultValue={amountOfSubscriptions} disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Free Accounts</label>
            </p>
            <p>
              <input className="form-profile-input" type="text" defaultValue={amountOfNewAccounts} disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">
                Subscriptions Closed
              </label>
            </p>
            <p>
              <input className="form-profile-input" type="text" defaultValue={amountOfClosedSubscriptions} disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Accounts Closed</label>
            </p>
            <p>
              <input className="form-profile-input" type="text" defaultValue={amountOfClosedAccounts} disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Images Uploaded</label>
            </p>
            <p>
              <input className="form-profile-input" type="text" value={amountOfImages} disabled />
            </p>
          </div>
        </div>
        <div className="profile-block-box">
          <Chart />
        </div>
      </div>
    </ProfileBox>
  );
};
