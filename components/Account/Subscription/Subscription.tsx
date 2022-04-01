import React, {useCallback, useContext, useState} from "react";

// libs
import axios from "axios";

// components
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {API} from "../../../api/AWS-gateway";
import notify, {ISetNotofication} from "../../Toast";
import {AppContext} from "../../../context/app.context";
import {Billing} from "../Billing/Billing";

export const Subscription: React.FC = () => {
  const {state} = useContext(AppContext);
  const {email}: any = state.dentistState;

  const [showBilling, setShowBilling] = useState(false);

  const setNotification = useCallback<ISetNotofication>(
    ({...notifyProps}) => {
      notify({...notifyProps});
    },
    []
  );

  const cancelSubscription = async () => {
    try {
      await axios.delete(`${API.STRIPE_SUBSCRIPTION}?email=${email}`);
    } catch (exp) {
      setNotification({
        type: "error",
        message: "Error to delete account, please try again!",
      });
    }
  };

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
            <input type="text" className="account-form-profile-input" defaultValue="01/06/2021" />
          </div>
        </div>
        <div className="account-form-login-buttons">
          <button type='button' className="account-button-green" onClick={() => setShowBilling(!showBilling)}>
            Update subscription
          </button>
          <button type='button' className="account-button-green-outline" onClick={() => cancelSubscription()}>
            Cancel subscription
          </button>
        </div>
      </div>
      {showBilling && <Billing />}
    </ProfileBox>
  );
};
