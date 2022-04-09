import React, {useContext} from "react";

// components
import {AppContext} from "../../../context/app.context";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";
import {LocationForm} from "./LocationForm/LocationForm";

const Locations: React.FC = () => {
  const {state} = useContext(AppContext);
  const {subscription_plan, locations} = state.dentistState;

  return (
    <ProfileLayout title='Locations' subTitle='Information For Patients'>
      <div className="box-2-box">
        {(locations && locations.length > 0) ? locations.map((location, index) =>
            <LocationForm key={index} locations={locations} location={location} primary title='Primary Location' />) :
          <LocationForm locations={locations} primary title='Primary Location' />}
        <div className={`profile-block-box ${subscription_plan === "FREE" && "disabled"}`}>
          <LocationForm title={`Second Location ${subscription_plan === 'FREE' ? '- Premium' : ''}`} />
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Locations;
