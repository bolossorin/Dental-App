import React, {useContext} from "react";

// components
import {Chart} from "./chart2";
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {AppContext} from "../../../context/app.context";

export const TotalSubs: React.FC = () => {
  const {state} = useContext(AppContext);
  const {
    NEW_SUBSCRIPTION,
    FREE_ACCOUNT,
    SUBSCRIPTION_CLOSED,
    ACCOUNT_CLOSED,
    IMAGE_UPLOAD
  } = state.adminState.userStatistics;

  return (
    <ProfileBox title='Total Subscriptions' subTitle='Summary'>
      <div className="account-form-info-block-full">
        <div className="double-blocks-5">
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Subscriptions</label>
            </p>
            <p>
              <input className="form-profile-input" type="text" defaultValue={NEW_SUBSCRIPTION.length} disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Free Accounts</label>
            </p>
            <p>
              <input className="form-profile-input" type="text" defaultValue={FREE_ACCOUNT.length} disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">
                Subscriptions Closed
              </label>
            </p>
            <p>
              <input className="form-profile-input" type="text" defaultValue={SUBSCRIPTION_CLOSED.length} disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Accounts Closed</label>
            </p>
            <p>
              <input className="form-profile-input" type="text" defaultValue={ACCOUNT_CLOSED.length} disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Images Uploaded</label>
            </p>
            <p>
              <input className="form-profile-input" type="text" defaultValue={IMAGE_UPLOAD.length} disabled />
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
