import React, {useCallback, useContext, useEffect} from "react";

// components
import {AppContext} from "../../../context/app.context";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";
import {LocationForm} from "./LocationForm/LocationForm";
import {getDentistLocations} from "../../../api/AWS-gateway";
import notify, {ISetNotofication} from "../../Toast";
import {DentistTypes} from "../../../reducers";

const Locations: React.FC = () => {
  const {dispatch} = useContext(AppContext);
  const {state} = useContext(AppContext);

  const {accountType, access_token, locations} = state.dentistState;

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  useEffect(() => {
    if (access_token) {
      getDentistLocations({headers: {Authorization: `Bearer ${access_token}`}})
        .then(({data}) => dispatch({type: DentistTypes.SET_LOCATIONS, payload: {locations: data}}))
        .catch(error => setNotification({type: "error", message: error.response.data.message}));
    }
  }, [access_token]);

  return (
    <ProfileLayout title='Locations' subTitle='Information For Patients'>
      <div className="box-2-box">
        {(locations && locations.length > 0) ? locations.map((location, index) =>
            <LocationForm key={index} locations={locations} location={location} primary title='Primary Location' />) :
          <LocationForm locations={locations} primary title='Primary Location' />}
        <div className={`profile-block-box ${accountType === "free" && "disabled"}`}>
          <LocationForm title={`Second Location ${accountType === 'free' ? '- Premium' : ''}`} />
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Locations;
