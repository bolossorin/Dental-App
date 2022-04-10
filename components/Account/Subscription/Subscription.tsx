import React, {useCallback, useContext, useEffect, useState} from "react";

// libs
import moment from "moment";

// components
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {deleteSubscriptionPI} from "../../../api/AWS-gateway";
import notify, {ISetNotofication} from "../../Toast";
import {AppContext} from "../../../context/app.context";
import {Billing} from "../Billing/Billing";

interface ISubscription {
  subscriptionPlan: any
  setSubscriptionPlan: (value: string) => void
}

export const Subscription: React.FC<ISubscription> = ({subscriptionPlan, setSubscriptionPlan}) => {
  const {state} = useContext(AppContext);
  const {access_token, subscription_end_date}: any = state.dentistState;

  const [showBilling, setShowBilling] = useState(false);
  const [date, setDate] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);

  const setNotification = useCallback<ISetNotofication>(
    ({...notifyProps}) => {
      notify({...notifyProps});
    },
    []
  );
  const cancelSubscription = async () => {
    setLoading(true);
    try {
      const config = {headers: {Authorization: `Bearer ${access_token}`}};
      const {data} = await deleteSubscriptionPI(config);
      setSubscriptionPlan(data.subscription_plan);
    } catch (error: any) {
      setNotification({type: "error", message: error.response.data.message});
    }
    setLoading(false);
  };

  useEffect(() => {
    if (subscription_end_date) {
      setDate(moment.unix(subscription_end_date).format("MM/DD/YYYY"));
    } else {
      if (subscriptionPlan) {
        setDate(moment.unix(subscriptionPlan.created).format("MM/DD/YYYY"))
      } else {
        setDate(null);
      }
    }
  }, [subscription_end_date]);

  return (
    <ProfileBox title='My Subscription' subTitle='Subscription Information'>
      <div className="account-profile-block-box">
        <div className="account-double-blocks-2">
          <div className="account-form-profile-label">
            <label className="account-form-profile-label">Status</label>
            <input className="account-form-profile-input" type="text" defaultValue="ACTIVE" disabled />
          </div>
          {date && <div className="account-form-profile-label">
            <label className="account-form-profile-label">Renewal</label>
            <input type="text" className="account-form-profile-input" value={date} disabled />
          </div>}
        </div>
        <div className="account-form-login-buttons">
          <button type='button' className="account-button-green" onClick={() => setShowBilling(!showBilling)}>
            Update subscription
          </button>
          <button
            disabled={loading}
            type='button'
            className="account-button-green-outline"
            onClick={() => cancelSubscription()}>
            Cancel subscription
          </button>
        </div>
      </div>
      {showBilling && <Billing setSubscriptionPlan={setSubscriptionPlan} />}
    </ProfileBox>
  );
};
