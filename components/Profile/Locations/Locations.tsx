import React, {useContext} from "react";

// components
import {AppContext} from "../../../context/app.context";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";
import {LocationForm} from "./LocationForm/LocationForm";

export interface ILocationsAddResponse {
  email: string;
  lat: number;
  lng: number;
  location: string;
  key: string;
}

const Locations: React.FC = () => {
  const {state} = useContext(AppContext);
  const {accountType} = state.dentistState;

  console.log(state,'state')
  return (
    <ProfileLayout title='Locations' subTitle='Information For Patients'>
      <div className="box-2-box">
        <LocationForm primary title='Primary Location' />
        <div className={`profile-block-box ${accountType === "free" && "disabled"}`}>
          <LocationForm
            locations={{town: '', address: '', post_code: ''}}
            title={`Second Location ${accountType === 'free' ? '- Premium' : ''}`} />
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Locations;
