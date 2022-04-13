import React, {useContext, useEffect, useState} from "react";

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
    <ProfileLayout title='Locations' subTitle='Information For Patients'>
      <div className="box-2-box">
       {countLocations.map((index) =>
          <div key={index} className="profile-block-box">
            <LocationForm index={index} title={`Location ${index}`} />
          </div>)}
        {subscription_plan === "FREE" && <div className={`profile-block-box disabled`}>
          <LocationForm index={false} title={`Second Location ${subscription_plan === 'FREE' ? '- Premium' : ''}`} />
        </div>}
      </div>
    </ProfileLayout>
  );
};

export default Locations;
