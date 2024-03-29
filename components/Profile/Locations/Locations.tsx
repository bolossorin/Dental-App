import React, {useContext, useEffect, useState} from "react";

// libs
import Skeleton from "react-loading-skeleton";

// components
import {AppContext} from "../../../context/app.context";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";
import {LocationForm} from "./LocationForm/LocationForm";


const Locations: React.FC = () => {
  const {state} = useContext(AppContext);
  const {subscription_plan, settings_account} = state.dentistState;
  const [countLocations, setCountLocations] = useState([]);

  useEffect(() => {
    if (settings_account) {
      const count: any = []
      for (let i = 1; i <= settings_account!.maxLocations; i++) {
        count.push(i);
      }
      setCountLocations(count)
    }
  }, [settings_account]);

  return (
    <ProfileLayout
      title='Locations'
      subTitle={`Information For Patients (max ${settings_account?.maxLocations} for ${settings_account?.subscription_type})`}>
      {settings_account ? <div className="box-2-box">
        {countLocations.map((index) =>
          <div key={index} className="profile-block-box">
            <LocationForm index={index} title={`Location ${index}`} />
          </div>)}
        {subscription_plan === "FREE" && <div className={`profile-block-box disabled`}>
          <LocationForm index={false} title={`Location ${subscription_plan === 'FREE' ? '- Premium' : ''}`} />
        </div>}
      </div> : <Skeleton count={5} height="5vh" />}
    </ProfileLayout>
  );
};

export default Locations;
