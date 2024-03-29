import React, {useContext} from "react";

// libs
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

// components
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {Billing} from "../Billing/Billing";
import {AppContext} from "../../../context/app.context";

interface IUpgrade {
  setSubscriptionPlan: (value: string) => void
}

export const Upgrade: React.FC<IUpgrade> = ({setSubscriptionPlan}) => {
  const {state} = useContext(AppContext);
  const {access_token}: any = state.dentistState;

  return (
    <ProfileBox title='Upgrade to Premium' subTitle='Paid Subscription'>
      {access_token ? <>
        <div className="account-profile-block-box">
          <div className="account-form-profile-label">
            <label className="account-form-profile-label">Features</label>
            <ul>
              <li>Verification Checkmark</li>
              <li>Up to 8 Services</li>
              <li>Services</li>
              <li>Add Second Location</li>
              <li>Add Website Address</li>
              <li>Add Phone Number</li>
            </ul>
          </div>
          <div className="account-form-profile-label">
            <label className="form-profile-label">Pricing</label>
            <ul>
              <li>Monthly Payment of £42.00+VAT</li>
              <li><Link href='#'><a>See Full Terms and Conditions Here</a></Link></li>
            </ul>
          </div>
        </div>
        <Billing setSubscriptionPlan={setSubscriptionPlan} />
      </> : <div style={{width: '100%'}}><Skeleton count={5} height="5vh" /></div>}
    </ProfileBox>
  );
};
