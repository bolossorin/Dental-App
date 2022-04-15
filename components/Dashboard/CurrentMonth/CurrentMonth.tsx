import React, {useContext} from "react";

// components
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {AppContext} from "../../../context/app.context";
import {getPeriod} from "../../../utils/getDate";

export const CurrentMonth: React.FC = () => {
  const {state} = useContext(AppContext);
  const {
    NEW_SUBSCRIPTION,
    FREE_ACCOUNT,
    SUBSCRIPTION_CLOSED,
    ACCOUNT_CLOSED,
    IMAGE_UPLOAD
  } = state.adminState.userStatistics;


  const filterByDate = (selector, period) => {
    return selector.filter((item) => {
      const creationPoint = new Date(item.createdAt);
      const startPoint = getPeriod(period);
      return creationPoint > startPoint;
    })
  }

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
            <input
              className="form-profile-input"
              type="text"
              defaultValue={filterByDate(NEW_SUBSCRIPTION, "Last month").length}
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
              defaultValue={filterByDate(FREE_ACCOUNT, "Last month").length}
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
              defaultValue={filterByDate(SUBSCRIPTION_CLOSED, "Last month").length}
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
              defaultValue={filterByDate(ACCOUNT_CLOSED, "Last month").length}
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
              defaultValue={filterByDate(IMAGE_UPLOAD, "Last month").length}
              disabled />
          </p>
        </div>
      </div>
    </ProfileBox>
  );
};
