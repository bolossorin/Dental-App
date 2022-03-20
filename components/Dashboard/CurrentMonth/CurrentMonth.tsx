import React, {useContext} from "react";

// components
import {AppContext} from "../../../context/app.context";
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";

export const CurrentMonth: React.FC = () => {
  const {state} = useContext(AppContext);
  const {
    amountOfClosedAccounts,
    amountOfClosedSubscriptions,
    amountOfImages,
    amountOfNewAccounts,
    amountOfSubscriptions,
  } = state.adminState.monthlyStats;

  return (
    <>
      <ProfileBox title='Current Month' subTitle='Summary'>
        <div className="double-blocks-5">
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">
                New Subscriptions
              </label>
            </p>
            <p>
              <input
                className="form-profile-input" type="text"
                name="amountOfSubscriptions"
                defaultValue={amountOfSubscriptions}
                disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">
                New Free Accounts
              </label>
            </p>
            <p>
              <input
                className="form-profile-input"
                type="text"
                name="amountOfNewAccounts"
                defaultValue={amountOfNewAccounts}
                disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">
                Subscriptions Closed
              </label>
            </p>
            <p>
              <input
                className="form-profile-input"
                type="text"
                name="amountOfClosedSubscriptions"
                defaultValue={amountOfClosedSubscriptions}
                disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Accounts Closed</label>
            </p>
            <p>
              <input
                className="form-profile-input"
                type="text"
                name="amountOfClosedAccounts"
                defaultValue={amountOfClosedAccounts}
                disabled />
            </p>
          </div>
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Images Uploaded</label>
            </p>
            <p>
              <input
                className="form-profile-input"
                type="text"
                name="amountOfImages"
                defaultValue={amountOfImages}
                disabled />
            </p>
          </div>
        </div>
      </ProfileBox>
    </>
  );
};
