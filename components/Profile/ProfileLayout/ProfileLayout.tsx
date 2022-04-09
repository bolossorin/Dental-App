import Link from "next/link";
import {routes} from "../../../utils/routes";
import React, {useContext} from "react";
import {AppContext} from "../../../context/app.context";

export const ProfileLayout = ({children, title, subTitle}: any) => {
  const {state} = useContext(AppContext);
  const {subscription_plan} = state.dentistState;

  return (
    <div className="profile-box-form">
      <div className="form-info-block">
        <div>
          <p className="form-bio-title green px20">{title}</p>
          <p className="form-bio-subtitle gray px12 mb-6px">{subTitle}</p>
        </div>
        {subscription_plan === "FREE" && (<div className="upgrade-button-bio">
          <Link href={routes.pricing}>
            <button className="button-green-outline">Upgrade</button>
          </Link>
        </div>)}
      </div>
      {children}
    </div>
  )
}
